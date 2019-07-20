'use strict';
const uuidv1 = require('uuid/v1');
const TABLE = 'proposal';
const utils = require('../utils/utils.js');
const jwt = require('jsonwebtoken');
const axios = require('axios');

// AWS
const AWS = require('aws-sdk');
const REGION = 'us-east-2';

AWS.config.update({
  region: REGION,
  accessKeyId: utils.getParameter('ACCESS_KEY'),
  secretAccessKey: utils.getParameter('SECRET_ACCESS_KEY')
});

const ddb = new AWS.DynamoDB.DocumentClient({region: REGION})

const TYPE_PARTAGE = ['workCopyrightSplit', 'performanceNeighboringRightSplit', 'masterNeighboringRightSplit']

function finDuVote(proposalId) {  
  // Si tous les votes sont récupérés, envoi du courriel de fin de votation 

  let toutEstAccepte = true, encoreEnAttente = false  

  // Récupère la proposition
  let params = {
    TableName: TABLE,
    Key: {
      'uuid': proposalId
    }
  }
  
  ddb.get(params, function(err, data) {
    if (err) {
      console.log("Error", err)
    }
      
    let proposition = data.Item
    let partages = proposition.rightsSplits

    let tousOntVote = true
    let voteUnanime = true

    // Contiendra les ayants-droits de la proposition
    let rightHolders = {}

    // Parcours tous les partages ...    
    TYPE_PARTAGE.forEach((elem, idx)=>{
      
      // Dépendant du type de partage ...

      function aVote(elem, type) {
        let ret = true
        if(elem && type && partages[elem][type]) {
          partages[elem][type].forEach((droit)=>{
            if(!rightHolders[droit.rightHolder.rightHolderId]) {
              // Ajout l'ayant-droit dans le tableau local pour traitement 
              // et envoi de courriel
              rightHolders[droit.rightHolder.rightHolderId] = droit.rightHolder
            }
            if(droit.voteStatus === 'active') {
              ret = false            
            }
          })
        } 
        return ret
      }

      function estUnanime(elem, type) {
        let ret = true
        if(elem && type && partages[elem][type]) {
          partages[elem][type].forEach((droit)=>{
            console.log('estUnanime()', elem, type, droit.voteStatus)
            if(droit.voteStatus === 'reject') {
              ret = false
              return
            }
          })
        }
        return ret
      }      

      switch(idx) {
        case 0: // Droit d'auteur
          if(partages[elem]) {                  
            // Paroles et musique
            tousOntVote = aVote(elem,  'lyrics') && aVote(elem,  'music')
            voteUnanime = estUnanime(elem,  'lyrics') && estUnanime(elem,  'music')
          }
          break
        case 1: // Droit voisin interprète
          if(partages[elem]) {
            // Principal et secondaire
            tousOntVote = aVote(elem,  'principal') && aVote(elem,  'accompaniment')
            voteUnanime = estUnanime(elem,  'principal') && estUnanime(elem,  'accompaniment')
          }
          break
        case 2: // Droit voisin enregistrement
          if(partages[elem]) {
            tousOntVote = aVote(elem, 'split')
            voteUnanime = estUnanime(elem, 'split')
          }
          break
        default:
      }
    })

    if(tousOntVote) {
      // Tout le monde a voté
      Object.keys(rightHolders).forEach(dest=>{        
        let _d = rightHolders[dest]

        // Récupérer le courriel de l'ayant-droit
        let params = {
          TableName: 'rightHolder',
          Key: {
            'rightHolderId': parseInt(_d.rightHolderId)
          }
        }
        ddb.get(params, function(err, _rH) {
          if (err) {
            console.log("Error", err)
          }
          _rH = _rH.Item

          // Récupérer le titre du média
          let params = {
            TableName: 'media',
            Key: {
              'mediaId': parseInt(proposition.mediaId)
            }
          }
          ddb.get(params, function(err, media) {
            if (err) {
              console.log("Error", err)
            }
            let titre = media.Item.title

            let body = [
              {
                  "toEmail": _rH.email,
                  "firstName": _rH.firstName,
                  "workTitle": titre,
                  "callbackURL": `http://proto.smartsplit.org:3000/partage/${proposalId}`
              }
            ]
    
            if(voteUnanime) {
              // Enoi du courriel d'unanimité
              body[0].template = "unanimousVote"          
            } else {
              // Envoi du courriel de non accord
              body[0].template = "nonUnanimousVote"
            }
    
            axios.post('http://messaging.smartsplit.org:3034/sendEmail', body)

          })
        })
      })
    }
  })  

}
  
function overwriteRightSplits(uuid, rightsSplits) {
  let params = {
    TableName: TABLE,
    Key: {
      'uuid': uuid
    },
    UpdateExpression: 'set rightsSplits  = :r',
    ExpressionAttributeValues: {
      ':r' : rightsSplits
    },
    ReturnValues: 'UPDATED_NEW'
  };
  ddb.update(params, function(err, data) {
    if (err) {
      console.log("Error", err)
    } else {
      console.log("Success", data.Attributes)
    }
  })
}

function ajouterCommentaire(propositionId, userId, commentaire) {

  // Récupère la proposition
  let params = {
    TableName: TABLE,
    Key: {
      'uuid': propositionId
    }
  }

  ddb.get(params, function(err, data) {
    if (err) {
      console.log("Error", err)
    }

    let proposition = data.Item
    let commentaires = proposition.comments

    commentaires[userId] = commentaire

    let params = {
      TableName: TABLE,
      Key: {
        'uuid': propositionId
      },
      UpdateExpression: 'set comments  = :c',
      ExpressionAttributeValues: {
        ':c' : commentaires
      },
      ReturnValues: 'UPDATED_NEW'
    }
    ddb.update(params, function(err, data) {
      if (err) {
        console.log("Error", err)
      } else {
        console.log("Success", data.Attributes)
      }
    })

  })    
}

exports.invite = function(proposalId, rightHolders) {   

  return new Promise(function(resolve, reject) {

    // Récupère la proposition
    let params = {
      TableName: TABLE,
      Key: {
        'uuid': proposalId
      }
    };
    ddb.get(params, function(err, data) {
      if (err) {
        console.log("Error", err)
      }
        
      let proposition = data.Item

      let initiateur = proposition.initiator.name,
          initiateurId = proposition.initiator.id,
          rightsSplits = proposition.rightsSplits

      console.log(`Inviation pour la proposition ${proposalId} faite par ${initiateur}\n`, proposition)

      // 0. Réceptionne le secret de génération JWT des paramètres AWS
      utils.getParameter('SECRET_JWS_INVITE', (secret)=>{
  
        // 0.1 --> Génère un jeton JWT pour chaque ayant-droit
        const EXPIRATION = "7 days"                              
        Object.keys(rightHolders).forEach((elem)=>{
          let jeton = jwt.sign(          
            {
                data: {proposalId: proposalId, rightHolderId: rightHolders[elem].rightHolderId}
            },
            secret,
            {expiresIn: EXPIRATION}
          )
          rightHolders[elem].jeton = jeton
        })

        console.log(`Jetons de votation générés pour les ayants-droits\n`, rightHolders)

        // 1. Initialisation des votes
        
        // a) Le vote positif de l'initiateur est mis à 'accept' partout où ce dernier aparaît
        // b) Les votes de chaque autre collaborateur est laissé à 'active'
        TYPE_PARTAGE.forEach((elem, idx)=>{
          // Dépendant du type de partage ...

          function accepter(elem, rightHolderId, type) {
            if(elem && type && rightsSplits[elem][type]) {
              rightsSplits[elem][type].forEach((droit, idx)=>{
                if(droit.rightHolder.rightHolderId === rightHolderId) {
                  droit.voteStatus = 'accept'
                  rightsSplits[elem][type][idx] = droit
                }
              })
            }
          }

          switch(idx) {
            case 0: // Droit d'auteur
              if(rightsSplits[elem]) {                  
                // Paroles
                accepter(elem, initiateurId, 'lyrics')
                accepter(elem, initiateurId, 'music')
              }
              break
            case 1: // Droit voisin interprète
              if(rightsSplits[elem]) {
                accepter(elem, initiateurId, 'principal')
                accepter(elem, initiateurId, 'accompaniment')
              }
              break
            case 2: // Droit voisin enregistrement
              if(rightsSplits[elem]) {
                accepter(elem, initiateurId, 'split')
              }
              break
            default:
          }

          // Ajoute le commentaire
          ajouterCommentaire(proposalId, initiateurId, 'Initiateur du split')

        })

        // 2.a -> Mettre à jour la proposition
        overwriteRightSplits(proposalId, rightsSplits)
        console.log('Droits initiaux calculés\n', rightsSplits)
        
        // 3. Récupérer le titre du média avec le mediaId (async)        
        axios.get(`http://api.smartsplit.org:8080/v1/media/${proposition.mediaId}`)
        .then(res=>{
          let titre = res.data.Item.title
          // 3.a -> Envoyer un courriel à tous (différent si initiateur)
          Object.keys(rightHolders).forEach((elem)=>{
            let body = [
              {
                  "toEmail": rightHolders[elem].email,
                  "firstName": rightHolders[elem].name,
                  "workTitle": titre,
                  "callbackURL": `http://proto.smartsplit.org:3000/proposition/vote/${rightHolders[elem].jeton}`
              }
            ]
            
            if(initiateurId === rightHolders[elem].rightHolderId) {
              // Confirmation d'envoi de proposition
              body[0].template = "splitSent"            
            } else {
              // Invitation à voter
              body[0].template = "splitCreated"
            }

            axios.post('http://messaging.smartsplit.org:3034/sendEmail', body)
          })

          // 4. Résoudre ce qui doit se produire dans le futur avec le jeton de l'initiateur
          
          // Test la fin du vote
          finDuVote(proposalId, rightHolders[initiateurId].jeton)
          resolve(rightHolders[initiateurId].jeton)    
        })
        .catch(err=>{
          console.log(err)
        })
        
      })

    })  
  })
}

exports.justifierRefus = function(userId, jeton, raison) {

  return new Promise(function(resolve, reject) {

    // Réceptionne le secret des paramètres AWS
    utils.getParameter('SECRET_JWS_INVITE', (secret)=>{
      try {
          let contenu = jwt.verify(jeton, secret)      
          let propositionId = contenu.data.proposalId,
              rightHolderId = contenu.data.rightHolderId          

          if(userId === rightHolderId) {
            ajouterCommentaire(propositionId, rightHolderId, 'Initiateur du split')
          }

          console.log(`Justification du refus de par ${userId} parce que ${raison}`)
          resolve(contenu.data)
      } catch(err) {
          console.log(err)
      }
    })
  })
}

exports.voteProposal = function(userId, jeton, droits) {
  return new Promise(function(resolve, reject) {
    // Réceptionne le secret des paramètres AWS
    utils.getParameter('SECRET_JWS_INVITE', (secret)=>{
      try {
        let contenu = jwt.verify(jeton, secret)

        let proposalId = contenu.data.proposalId,
            rightHolderId = contenu.data.rightHolderId

        if(userId === rightHolderId) {

          // Récupère la proposition
          let params = {
            TableName: TABLE,
            Key: {
              'uuid': proposalId
            }
          }
          ddb.get(params, function(err, data) {
            if (err) {
              console.log("Error", err)
            }
              
            let proposition = data.Item
            let rightsSplits = proposition.rightsSplits

            // Parcours tous les partages de l'utilisateur qui vote et modifie ces partages
            Object.keys(rightsSplits).forEach(famille=>{
              Object.keys(rightsSplits[famille]).forEach(type=>{
                rightsSplits[famille][type].forEach((droit, idx)=>{
                  if(droit.rightHolder.rightHolderId === userId) {
                    // Trouver le bon droit qui a été envoyé
                    droit.voteStatus = droits[famille][type]
                    rightsSplits[famille][type][idx] = droit
                  }
                })
              })
            })

            // Appliquer le changement de droits
            overwriteRightSplits(proposalId, rightsSplits)

              // Récupère la proposition
            let params = {
              TableName: 'rightHolder',
              Key: {
                'rightHolderId': parseInt(userId)
              }
            }
            ddb.get(params, function(err, _rH) {
              if (err) {
                console.log("Error", err)
              }
              _rH = _rH.Item

              // Récupère le titre du média
              let params = {
                TableName: 'media',
                Key: {
                  'mediaId': proposition.mediaId
                }
              }
              ddb.get(params, function(err, media) {
                if (err) {
                  console.log("Error", err)
                }    

                let body = [
                  {
                      "toEmail": _rH.email,
                      "template": "thanksForVoting",
                      "firstName": `${_rH.firstName} ${_rH.lastName}`,
                      "workTitle": media.Item.title,
                      "callbackURL": `http://proto.smartsplit.org:3000/proposition/vote/${jeton}`
                  }
                ]

                axios.post('http://messaging.smartsplit.org:3034/sendEmail', body)
                .then(()=>{
                  finDuVote(proposalId, jeton)
                  resolve(contenu.data)
                })
              })
            })
          })           
        }          
      } catch(err) {
          console.log(err)
      }
    })
  })
}

exports.listeVotes = function(proposalId) {
  return new Promise(function(resolve, reject) {
    // Récupère la proposition
    let params = {
      TableName: TABLE,
      Key: {
        'uuid': proposalId
      }
    };
    ddb.get(params, function(err, data) {
      if (err) {
        console.log("Error", err)
        reject(err)
      }
        
      let proposition = data.Item
      resolve(proposition)

    })
  })
}

exports.decode = function(jeton) {
  return new Promise(function(resolve, reject) {
    // Réceptionne le secret des paramètres AWS
    utils.getParameter('SECRET_JWS_INVITE', (secret)=>{
      try {
          let contenu = jwt.verify(jeton, secret)
          resolve(contenu.data)
      } catch(err) {
          console.log(err)
      }
    })
  })
}

/**
 * Delete a right split proposal with the given ID
 *
 * uuid String The splits proposal's unique profile ID
 * no response value expected for this operation
 **/
exports.deleteProposal = function(uuid) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'uuid': uuid
      }
    };
    // Call DynamoDB to delete the item from the table
    ddb.delete(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data);
        resolve('split proposal removed');
      }
    });
  });
}


/**
 * Get a list of all media split proposals
 *
 * returns listProposals
 **/
exports.getAllProposals = function() {
  return new Promise(function(resolve, reject) {
    let params = {
      "TableName": TABLE,
    }
    ddb.scan(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data);
        resolve(data.Items);
      }
    });
  });
}


/**
 * Get a split proposal with the given ID
 *
 * uuid String The split proposal's unique ID
 * returns proposal
 **/
exports.getProposal = function(uuid) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'uuid': uuid
      }
    };
    ddb.get(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data);
        resolve(data);
      }
    });
  });
}


/**
 * Update initiator for a given split proposal
 *
 * uuid String The split's unique ID
 * initiator Initiator The initiator of the given split proposal
 * returns Object
 **/
exports.patchProposalInitiator = function(uuid,initiator) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'uuid': uuid
      },
      UpdateExpression: 'set initiator = :i',
      ExpressionAttributeValues: {
        ':i' : initiator.initiator
      },
      ReturnValues: 'UPDATED_NEW'
    };
    ddb.update(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data.Attributes);
        resolve(data.Attributes);
      }
    });
  });
}


/**
 * Update mediaId for given split proposal
 *
 * uuid String The split proposal's unique ID
 * mediaId MediaId The split proposal's media Id
 * returns Object
 **/
exports.patchProposalMediaId = function(uuid,mediaId) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'uuid': uuid
      },
      UpdateExpression: 'set mediaId  = :m',
      ExpressionAttributeValues: {
        ':m' : mediaId.mediaId
      },
      ReturnValues: 'UPDATED_NEW'
    };
    ddb.update(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data.Attributes);
        resolve(data.Attributes);
      }
    });
  });
}


/**
 * Update rights split object for given split proposal
 *
 * uuid String The split proposal's unique ID
 * rightsSplits RightsSplits The split proposal's rights splits object
 * returns proposal/properties/rightsSplits
 **/
exports.patchProposalRightsSplits = function (uuid,rightsSplits) {
  return new Promise(function(resolve, reject) {
    let params = {
      "TableName": TABLE,
      Key: {
        'uuid': uuid
      }
    }
    // Get old proposals
    ddb.get(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        let oldRightsSplits = data.Item.rightsSplits; 
        // if (workCopyrightSplit,performanceNeighboringRightSplit,masterNeighboringRightSplit) 
        // TODO ADD LOGIC TO UPDATE RIGHTS SPLITS OBJECT INTELLIGENTLY
        let rightsSplitsJoined = Object.assign({}, oldRightsSplits, rightsSplits);
        let params = {
          TableName: TABLE,
          Key: {
            'uuid': uuid
          },
          UpdateExpression: 'set rightsSplits  = :r',
          ExpressionAttributeValues: {
            ':r' : rightsSplitsJoined
          },
          ReturnValues: 'UPDATED_NEW'
        };
        ddb.update(params, function(err, data) {
          if (err) {
            console.log("Error", err);
            resolve();
          } else {
            console.log("Success", data.Attributes);
            resolve(data.Attributes);
          }
        });
      }
    });
  });
}


/**
 * This method creates a new split proposal for a given media
 *
 * body Proposal request
 * returns proposal
 **/
exports.postProposal = function(body) {
  return new Promise(function(resolve, reject) {
    let SPLIT_UUID = uuidv1();
    console.log('SPLIT UUID', SPLIT_UUID, SPLIT_UUID.type)
    let params = {
      TableName: TABLE,
      Item: {
        'uuid': SPLIT_UUID,
        'mediaId': body.mediaId,
        'initiator': body.initiator,
        'rightsSplits': body.rightsSplits,
      }
    };
    ddb.put(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        resolve("Success. Item Added");
      }
    });
  });
}


/**
 * This method updates a split proposal
 *
 * uuid String The split proposal's unique profile ID
 * body Proposal request
 * returns proposal
 * WIP - overrights existing splits
 **/
exports.updateProposal = function(uuid,body) {
  let params = {
    TableName: TABLE,
    Key: {
      'uuid': uuid
    },

  };
  ddb.get(params, function(err, data) {
    if (err) {
      console.log("Error", err);
      resolve();
    } else {
      // let oldProposal = data.Item; 
      // TODO ADD LOGIC TO UPDATE RIGHTS SPLITS OBJECT INTELLIGENTLY
      // let proposal = Object.assign({}, oldProposal, data.Item);
      let params = {
        TableName: TABLE,
        Key: {
          'uuid': uuid
        },
        // TODO ADD LOGIC TO UPDATE RIGHTS SPLITS OBJECT INTELLIGENTLY
        UpdateExpression: 'set rightsSplits  = :r, mediaId = :m, initiator = :i',
        ExpressionAttributeValues: {
          ':r' : body.rightsSplits,
          ':m' : body.mediaId,
          ':i' : body.initiator
        },
        ReturnValues: 'UPDATED_NEW'
      };
      ddb.update(params, function(err, data) {
        if (err) {
          console.log("Error", err);
          resolve();
        } else {
          console.log("Success", data.Attributes);
          resolve(data.Attributes);
        }
      });
    }
  });
}