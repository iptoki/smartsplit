'use strict';
const uuidv1 = require('uuid/v1');
const TABLE = 'splits';
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

const ddb = new AWS.DynamoDB.DocumentClient({region: REGION});

// Structure de données des Splits proposés et des invitations
let _splits = []

function finDuVote(splitId, jeton) {  
  // Si tous les votes sont récupérés, envoi du courriel de fin de votation  

  let acceptationDeTout = true, acceptationEnAttente = false

  Object.keys(_splits[splitId].parts).forEach(droit=>{
    Object.keys(_splits[splitId].parts[droit]).forEach(_d=>{
      if(_splits[splitId].parts[droit][_d].etat !== "ACCEPTE") {
        acceptationDeTout = false
        if(_splits[splitId].parts[droit][_d].etat === "ATTENTE") {
          acceptationEnAttente = true
        }
      }
    })
  })

  // Récupère tous les ayant droits dans tous les partages avec leurs nom et courriel
  let destinataires = {}
  Object.keys(_splits[splitId].parts).forEach(droit=>{
    Object.keys(_splits[splitId].parts[droit]).forEach(uuid=>{        
      if(!destinataires[uuid])
      destinataires[uuid] = {
        nom: _splits[splitId].parts[droit][uuid].nom, 
        courriel: _splits[splitId].parts[droit][uuid].courriel
      }
    })
  })

  if(acceptationDeTout) {

    Object.keys(destinataires).forEach(dest=>{
      let _d = destinataires[dest]
      let body = [
        {
            "toEmail": _d.courriel,
            "template": "unanimousVote",
            "firstName": _d.nom,
            "workTitle": _splits[splitId].media.title,
            "callbackURL": `http://proto.smartsplit.org:3000/split/voter/${jeton}`
        }
      ]
      axios.post('http://messaging.smartsplit.org:3034/sendEmail', body)    
    })

    _splits[splitId].estClos = true

  } else if (!acceptationEnAttente) {
    // Il n'y a rien en attente et ce n'est pas unanime
    Object.keys(destinataires).forEach(dest=>{
      let _d = destinataires[dest]
      let body = [
        {
            "toEmail": _d.courriel,
            "template": "nonUnanimousVote",
            "firstName": _d.nom,
            "workTitle": _splits[splitId].media.title,
            "callbackURL": `http://proto.smartsplit.org:3000/split/voter/${jeton}`
        }
      ]
      axios.post('http://messaging.smartsplit.org:3034/sendEmail', body)    
    })
    _splits[splitId].estClos = true
  }

}

exports.invite = function(splitId, rightHolderId, courriel) {

  const SPLIT = require(`../data/${splitId}`)

  let initiateur = SPLIT.initiateur.name, 
      initiateurId = SPLIT.initiateur.uuid, 
      titre = SPLIT.media.title

  console.log(`Inviation pour splitID ${splitId} par ${initiateur} pour ${rightHolderId}`)

  return new Promise(function(resolve, reject) {

    function genererStructureSplits() {

      _splits[splitId] = {
        parts: {
        },
        initiateur: {
          uuid: initiateurId,
          nom: initiateur
        },
        media: {
          title: titre
        },
        commentaire: {},
        transmis: {}
      }

      function genererIndividuel(partage) {
        return {
          uuid: partage.rightHolder.uuid,
          nom: partage.rightHolder.name,
          courriel: partage.rightHolder.email,
          pct: partage.splitPct,
          etat: initiateurId === partage.rightHolder.uuid ? 'ACCEPTE' : 'ATTENTE'
        }
      }

      function genererTypeDroit(typeDroit) {
        if(SPLIT[typeDroit]) {
          _splits[splitId].parts[typeDroit] = {}
          SPLIT[typeDroit].rightsSplit.forEach((partage)=>{
            _splits[splitId].parts[typeDroit][partage.rightHolder.uuid] = genererIndividuel(partage, courriel)
          })
        }  
      }

      genererTypeDroit('workCopyrightSplit', courriel)
      genererTypeDroit('performanceNeighboringRightSplit', courriel)
      genererTypeDroit('masterNeighboringRightSplit', courriel)   

    }

    // Réceptionne le secret des paramètres AWS
    utils.getParameter('SECRET_JWS_INVITE', (secret)=>{

      // Génère un jeton JWT pour la votation
      const EXPIRATION = "7 days"
      let jeton = jwt.sign(          
          {
              data: {splitId: splitId, rightHolderId: rightHolderId}
          },
          secret,
          {expiresIn: EXPIRATION}
      )

      let splitCree = (undefined !== _splits[splitId])

      // TEMPORAIRE
      let aCreeSplit = false
      if(!splitCree) {
        genererStructureSplits()
        aCreeSplit = true
      }

      // Récupérer infos utilisateur d'un des droits, le premier trio courriel, id et nom parmis tous les droits
      let _infos
      
      if (_splits[splitId].parts.workCopyrightSplit && _splits[splitId].parts.workCopyrightSplit[rightHolderId]) { 
        _splits[splitId].parts.workCopyrightSplit[rightHolderId].courriel = courriel
        _infos = _splits[splitId].parts.workCopyrightSplit[rightHolderId] 
      } else if (_splits[splitId].parts.performanceNeighboringRightSplit && _splits[splitId].parts.performanceNeighboringRightSplit[rightHolderId]) { 
        _splits[splitId].parts.performanceNeighboringRightSplit[rightHolderId].courriel = courriel
        _infos = _splits[splitId].parts.performanceNeighboringRightSplit[rightHolderId] 
      } else if (_splits[splitId].parts.masterNeighboringRightSplit && _splits[splitId].parts.masterNeighboringRightSplit[rightHolderId]) { 
        _splits[splitId].parts.masterNeighboringRightSplit[rightHolderId].courriel = courriel
        _infos = _splits[splitId].parts.masterNeighboringRightSplit[rightHolderId] 
      }

      _splits[splitId].commentaire[initiateurId] = 'Initiateur du partage'
      _splits[splitId].transmis[initiateurId] = true

      if(_infos) {

        let body
        
        if(initiateurId === rightHolderId) {
          // Envoi courriel de création de partage à l'initiateur du split          
          body = [
            {
                "toEmail": _infos.courriel,
                "template": "splitSent",
                "firstName": _infos.nom,
                "workTitle": titre,
                "callbackURL": `http://proto.smartsplit.org:3000/split/voter/${jeton}`
            }
          ]
          resolve(jeton)
        } else {
          // Envoi une invitation à voter
          body = [
            {
                "toEmail": _infos.courriel,
                "template": "splitCreated",
                "firstName": _infos.nom,
                "splitInitiator": initiateur,
                "workTitle": titre,
                "callbackURL": `http://proto.smartsplit.org:3000/split/voter/${jeton}`
            }
          ]
          resolve()
        }

        // N'envoyer que s'il y a plus d'un destinataire pour ce split (si non c'est à soi-même)
        let destinataires = {}
        Object.keys(_splits[splitId].parts).forEach(droit=>{
          Object.keys(_splits[splitId].parts[droit]).forEach(uuid=>{        
            if(!destinataires[uuid])
            destinataires[uuid] = {
              nom: _splits[splitId].parts[droit][uuid].nom, 
              courriel: _splits[splitId].parts[droit][uuid].courriel
            }
          })
        })      

        if(Object.keys(destinataires).length > 0) {
          axios.post('http://messaging.smartsplit.org:3034/sendEmail', body)
          .then((resp)=>{
            
          })
        }        

      } else {
        console.log(`Erreur, pas d'informations trouvées dans les split pour utilisateur ${rightHolderId}`)
      }

      if(aCreeSplit) {
        // Teste la fin du vote
        finDuVote(splitId, jeton)
      }
      
    })    
  })
}


exports.justifierRefus = function(userId, jeton, raison) {

  return new Promise(function(resolve, reject) {

    // Réceptionne le secret des paramètres AWS
    utils.getParameter('SECRET_JWS_INVITE', (secret)=>{
      try {
          let contenu = jwt.verify(jeton, secret)      
          let splitId = contenu.data.splitId,
              rightHolderId = contenu.data.rightHolderId

          if(userId === rightHolderId) {              
            _splits[splitId].commentaire[rightHolderId] = raison
          }

          console.log(`Justification du refus de par ${userId} parce que ${raison}`)
          resolve(contenu.data)          
      } catch(err) {
          console.log(err)
      }
    })
  })
}

exports.voteSplit = function(userId, jeton, droits) {

  return new Promise(function(resolve, reject) {        

    // Réceptionne le secret des paramètres AWS
    utils.getParameter('SECRET_JWS_INVITE', (secret)=>{
      try {
          let contenu = jwt.verify(jeton, secret)

          let splitId = contenu.data.splitId,
              rightHolderId = contenu.data.rightHolderId

          if(userId === rightHolderId) {
            console.log(`${userId} a voté sur le split ${splitId}`)
            _splits[splitId].transmis[rightHolderId] = true

            Object.keys(droits).forEach(elem=>{
              _splits[splitId].parts[elem][rightHolderId].etat = droits[elem]
            })
          }

          let destinataires = {}
          Object.keys(_splits[splitId].parts).forEach(droit=>{
            Object.keys(_splits[splitId].parts[droit]).forEach(uuid=>{        
              if(!destinataires[uuid])
              destinataires[uuid] = {
                nom: _splits[splitId].parts[droit][uuid].nom, 
                courriel: _splits[splitId].parts[droit][uuid].courriel
              }
            })
          })

          let des = destinataires[rightHolderId]

          let body = [
            {
                "toEmail": des.courriel,
                "template": "thanksForVoting",
                "firstName": des.nom,
                "workTitle": _splits[splitId].media.title,
                "callbackURL": `http://proto.smartsplit.org:3000/split/voter/${jeton}`
            }
          ]
          axios.post('http://messaging.smartsplit.org:3034/sendEmail', body)
          .then(()=>{
            finDuVote(contenu.data.splitId, jeton)
            resolve(contenu.data)
          })
      } catch(err) {
          console.log(err)
      }
    })
  })
}

exports.listeVotes = function(splitId) {
  return new Promise(function(resolve, reject) {   
    resolve(_splits[splitId])
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
 * Delete a right holder's profile with the given ID
 *
 * uuid String The splits's unique profile ID
 * no response value expected for this operation
 **/
exports.deleteSplit = function(uuid) {
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
        resolve('split removed');
      }
    });
  });
}


/**
 * Get a list of all media splits
 *
 * returns listSplits
 **/
exports.getAllSplits = function() {
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
 * Get a split with the given ID
 *
 * uuid String The split's unique  ID
 * returns splits
 **/
exports.getSplit = function(uuid) {
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
 * Update email token for given split
 *
 * uuid String The split's unique ID
 * emailToken EmailToken The split's email token
 * returns Object
 **/
exports.patchSplitEmailToken = function(uuid,emailToken) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'uuid': uuid
      },
      UpdateExpression: 'set emailToken = :e',
      ExpressionAttributeValues: {
        ':e' : emailToken.emailToken
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
 * Update mediaId for given split
 *
 * uuid String The split's unique ID
 * mediaId MediaId The split's email token
 * returns Object
 **/
exports.patchSplitMediaId = function(uuid,mediaId) {
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
 * Update split type for a given split
 *
 * uuid String The split's unique ID
 * splitType SplitType The split type of the split
 * returns Object
 **/
exports.patchSplitType = function(uuid,splitType) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'uuid': uuid
      },
      UpdateExpression: 'set splitType = list_append(if_not_exists(splitType, :empty_list), :t)',
      ExpressionAttributeValues: {
        ':t' : splitType,
        ':empty_list': []
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
 * This method creates a new split for a given media
 *
 * body Splits request
 * returns splits
 **/
exports.postSplit = function(body) {
  return new Promise(function(resolve, reject) {
    let params = {
      "TableName": TABLE,
    }
    // Call DynamoDB to delete the item from the table
    ddb.scan(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        // Create unique ID value
        let SPLIT_UUID = uuidv1();

        let params = {
          TableName: TABLE,
          Item: {
            'uuid': SPLIT_UUID,
            'emailToken': body.emailToken,
            'splitType': body.splitType,
            'mediaId': body.mediaId
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
      }

    });
  });


}


/**
 * This method updates a split
 *
 * uuid String The splits unique profile ID
 * body Splits request
 * returns splits
 **/
exports.updateSplit = function(uuid,body) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'uuid': uuid
      },
      UpdateExpression: 'set emailToken  = :e, splitType = :t, mediaId = :m',
      ExpressionAttributeValues: {
        ':e' : body.emailToken,
        ':t' : body.splitType,
        ':m' : body.mediaId,
      },
      ReturnValues: 'UPDATED_NEW'
    };
    // Call DynamoDB to delete the item from the table
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

