'use strict';

const uuidv1 = require('uuid/v1')
const TABLE = 'splitShare'
const utils = require('../utils/utils.js')
const jwt = require('jsonwebtoken')
const axios = require('axios')

// AWS
const AWS = require('aws-sdk')
const REGION = 'us-east-1'
const REGION_PARAMS = 'us-east-2'

AWS.config.update({
  region: REGION_PARAMS,
  accessKeyId: utils.getParameter('ACCESS_KEY'),
  secretAccessKey: utils.getParameter('SECRET_ACCESS_KEY')
});

const ddb = new AWS.DynamoDB.DocumentClient({region: REGION})

exports.getSplitShare = function(proposalId, rightHolderId) {

  return new Promise(function(resolve, reject){
    // 4. Récupère la proposition de part à un tier
    let params = {
      TableName: "splitShare"           
    }
    ddb.scan(params, function(err, data) {
      if (err) {
        console.log("Error", err)
      }
      let partages = data.Items
      partages.forEach(p=>{
        if(p.proposalId === proposalId && p.rightHolderId === rightHolderId) {
          resolve(p)
        }
      })
    })
  })  
}

exports.inviteEditeur = function(body, type) {
  return new Promise(function(resolve, reject) {
    let proposalId = body.proposalId,
        mediaId = body.mediaId, 
        _beneficiaire = body.shareeId, 
        _ayantDroit = body.rightHolder

    try {
      // 1. Réceptionne le secret de génération JWT des paramètres AWS
      utils.getParameter('SECRET_JWS_INVITE', (secret)=>{

        // 1.1 --> Génère un jeton JWT pour chaque ayant-droit
        const EXPIRATION = "7 days"
        let jeton = jwt.sign(
          {
              data: {proposalId: proposalId, donateur: _ayantDroit.uuid, beneficiaire: _beneficiaire}
          },
          secret,
          {expiresIn: EXPIRATION}
        )          

        // 2. Récupère le titre du média
        let params = {
          TableName: "media",
          Key: {
            'mediaId': mediaId
          }
        };
        ddb.get(params, function(err, data) {
          if (err) {
            console.log("Error", err)
          }                
          let titre = data.Item.title
          
          // 3. Récupère le bénéficiaire
          let params = {
            TableName: "rightHolder",
            Key: {
              'rightHolderId': _beneficiaire
            }
          };
          ddb.get(params, function(err, data) {
            if (err) {
              console.log("Error", err)
            }        
            let destinataire = data.Item
            // 3.1 Envoyer un courriel au bénéficiaire
            let body = [
              {
                  "toEmail": destinataire.email,
                  "firstName": destinataire.firstName,
                  "workTitle": titre,
                  "callbackURL": `http://proto.smartsplit.org:3000/partage/editeur/vote/${jeton}`,
                  "template": "partageEditeur",
                  "ayantDroit": _ayantDroit.nom
              }
            ]      
            axios.post('http://messaging.smartsplit.org:3034/sendEmail', body)          
          })

          // 4. Envoi de la confirmation d'envoi à l'ayant-droit qui a partagé
          params = {
            TableName: "rightHolder",
            Key: {
              'rightHolderId': _ayantDroit.uuid
            }
          };
          ddb.get(params, function(err, data) {
            if (err) {
              console.log("Error", err)
            }        
            let ayantDroit = data.Item
            let body = [
              {
                  "toEmail": ayantDroit.email,
                  "firstName": ayantDroit.firstName,
                  "workTitle": titre,
                  "callbackURL": `http://proto.smartsplit.org:3000/partager/${mediaId}`,
                  "template": "partageEditeurEnvoye",
              }
            ]
            axios.post('http://messaging.smartsplit.org:3034/sendEmail', body)
          })                   

          // 4. Récupère la proposition de part à un tier
          params = {
            TableName: "splitShare"           
          }
          ddb.scan(params, function(err, data) {
            if (err) {
              console.log("Error", err)
            }        
            data.Items.forEach(p => {
              if(p.proposalId === proposalId && p.rightHolderId === _ayantDroit.uuid && p.shareeId === _beneficiaire) {
                // 5. Modifier l'état de la proposition
                let params = {
                  TableName: TABLE,
                  Key: {
                    'uuid': p.uuid
                  },
                  UpdateExpression: 'set etat = :s',
                  ExpressionAttributeValues: {
                    ':s' : "VOTATION"
                  },
                  ReturnValues: 'UPDATED_NEW'
                };
                ddb.update(params, function(err, data) {
                  if (err) {
                    console.log("Error", err)
                  } else {
                    
                    // Test la fin du vote
                    resolve(p.uuid)
                  }
                })
              }
            })          
          })
        })            
      })
    } catch (err) {
      console.log(err)
      reject(err)
    } 
  })
}

exports.splitShareVote = function(body) {
  return new Promise(function(resolve, reject) {
    try{
      // Décoder le jeton
      let jeton = body.jeton
      let rightHolderId = body.userId
      let choix = body.choix
      utils.getParameter('SECRET_JWS_INVITE', (secret)=>{
        try {
          let contenu = jwt.verify(jeton, secret).data

            // 4. Récupère la proposition de part à un tier
          let params = {
            TableName: "splitShare"           
          }
          ddb.scan(params, function(err, data) {
            if (err) {
              console.log("Error", err)
            }        
            data.Items.forEach(p => {
              if(p.proposalId === contenu.proposalId && 
                p.rightHolderId === contenu.donateur && 
                p.shareeId === contenu.beneficiaire &&
                rightHolderId === contenu.beneficiaire) {
                // 5. Modifier l'état de la proposition
                let params = {
                  TableName: TABLE,
                  Key: {
                    'uuid': p.uuid
                  },
                  UpdateExpression: 'set etat = :s',
                  ExpressionAttributeValues: {
                    ':s' : choix === 'accept' ? 'ACCEPTE' : 'REFUSE'
                  },
                  ReturnValues: 'UPDATED_NEW'
                };
                ddb.update(params, function(err, data) {
                  if (err) {
                    console.log("Error", err)
                  } else {
                    
                    
                    let params = {
                      TableName: "proposal",
                      Key: {
                        'uuid': contenu.proposalId
                      }
                    };
                    ddb.get(params, function(err, data) {
                      if (err) {
                        console.log("Error", err)
                      }                
                      let _proposition = data.Item

                      // 2. Récupère le titre du média
                      let params = {
                        TableName: "media",
                        Key: {
                          'mediaId': _proposition.mediaId
                        }
                      };
                      ddb.get(params, function(err, data) {
                        if (err) {
                          console.log("Error", err)
                        }                
                        let titre = data.Item.title

                        // Envoi des courriels ici
                        // 3. Récupère le bénéficiaire
                        let params = {
                          TableName: "rightHolder",
                          Key: {
                            'rightHolderId': contenu.beneficiaire
                          }
                        };
                        ddb.get(params, function(err, data) {
                          if (err) {
                            console.log("Error", err)
                          }        
                          let destinataire = data.Item
                          // 3.1 Envoyer un courriel au bénéficiaire
                          let body = [
                            {
                                "toEmail": destinataire.email,
                                "firstName": destinataire.firstName,
                                "workTitle": titre,
                                "callbackURL": `http://proto.smartsplit.org:3000/partage/editeur/vote/${jeton}`
                            }
                          ]

                          if(choix === 'accept') {
                            body[0].template = "partageEditeurAccepte"
                          } else {
                            body[0].template = "partageEditeurRefuse"
                          }

                          axios.post('http://messaging.smartsplit.org:3034/sendEmail', body)          
                        })

                        // 4. Envoi de la confirmation d'envoi à l'ayant-droit qui a partagé
                        params = {
                          TableName: "rightHolder",
                          Key: {
                            'rightHolderId': contenu.donateur
                          }
                        };
                        ddb.get(params, function(err, data) {
                          if (err) {
                            console.log("Error", err)
                          }        
                          let ayantDroit = data.Item
                          let body = [
                            {
                                "toEmail": ayantDroit.email,
                                "firstName": ayantDroit.firstName,
                                "workTitle": titre,
                                "callbackURL": `http://proto.smartsplit.org:3000/partage/editeur/vote/${jeton}`
                            }
                          ]

                          if(choix === 'accept') {
                            body[0].template = "partageEditeurAccepte"
                          } else {
                            body[0].template = "partageEditeurRefuse"
                          }

                          axios.post('http://messaging.smartsplit.org:3034/sendEmail', body)
                        })
                        resolve(choix)
                      })
                    })
                  }
                })
              }
            })          
          })
        } catch(err) {
            console.log(err)
        }
      })
    } catch(err) {
      console.log(err)
      reject(err)
    }
  })
}

exports.addSplitShare = function(body, type) {
  return new Promise(function(resolve, reject) {
    let SPLITSHARE_UUID = uuidv1();    
    let params = {
      TableName: TABLE,
      Item: {
        'uuid': SPLITSHARE_UUID,
        'rightHolderId': body.rightHolderId,
        'shareeId': body.shareeId,
        'proposalId': body.proposalId,
        'rightHolderPct': body.rightHolderPct,
        'shareePct': body.shareePct,
        'etat': 'ATTENTE',
        'type': type
      }
    };
    ddb.put(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        resolve(SPLITSHARE_UUID);
      }
    });
  });
}