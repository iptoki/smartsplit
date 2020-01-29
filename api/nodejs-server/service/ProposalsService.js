'use strict';
const uuidv1 = require('uuid/v1');
const TABLE = 'proposal';
const utils = require('../utils/utils.js');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const moment = require('moment')
moment.defaultFormat = "DD-MM-YYYY HH:mm"

// AWS
const AWS = require('aws-sdk');
const REGION = 'us-east-2';
const REGION_PARAMS = 'us-east-2';

AWS.config.update({
  region: REGION_PARAMS,
  accessKeyId: utils.getParameter('ACCESS_KEY'),
  secretAccessKey: utils.getParameter('SECRET_ACCESS_KEY')
});

const ddb = new AWS.DynamoDB.DocumentClient({region: REGION})

const Proposal = require("../models/proposal")

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
            tousOntVote = tousOntVote && aVote(elem,  'lyrics') && aVote(elem,  'music')
            voteUnanime = voteUnanime && estUnanime(elem,  'lyrics') && estUnanime(elem,  'music')
          }
          break
        case 1: // Droit voisin interprète
          if(partages[elem]) {
            // Principal et secondaire
            tousOntVote = tousOntVote && aVote(elem,  'principal') && aVote(elem,  'accompaniment')
            voteUnanime = voteUnanime && estUnanime(elem,  'principal') && estUnanime(elem,  'accompaniment')
          }
          break
        case 2: // Droit voisin enregistrement
          if(partages[elem]) {
            tousOntVote = tousOntVote && aVote(elem, 'split')
            voteUnanime = voteUnanime && estUnanime(elem, 'split')
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
            'rightHolderId': _d.rightHolderId
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
                  "callbackURL": `http://dev.smartsplit.org/partager/${proposition.mediaId}`
              }
            ]
    
            let etat
            if(voteUnanime) {
              // Enoi du courriel d'unanimité
              body[0].template = "unanimousVote"
              // Modifier l'état de la proposition pour ACCEPTE
              etat = "ACCEPTE"
            } else {
              // Envoi du courriel de non accord
              body[0].template = "nonUnanimousVote"
              // Modifier l'état de la proposition pour REFUSE
              etat = "REFUSE"
            }
                
            axios.post('http://messaging.smartsplit.org:3034/sendEmail', body)

            // Modifier l'état de la proposition
            let params = {
              TableName: TABLE,
              Key: {
                'uuid': proposalId
              },
              UpdateExpression: 'set etat  = :e',
              ExpressionAttributeValues: {
                ':e': etat
              },
              ReturnValues: 'UPDATED_NEW'
            }
            ddb.update(params, function(err, data) {
              if (err) {
                console.log("Error", err)
              } else {
                
              }
            })

            // Retirer l'initiateur de la proposition en cours du média
            params = {
              TableName: 'media',
              Key: {
                'mediaId': proposition.mediaId
              },
              UpdateExpression: 'set initiateurPropositionEnCours  = :e',
              ExpressionAttributeValues: {
                ':e': " "
              },
              ReturnValues: 'UPDATED_NEW'
            }
            ddb.update(params, function(err, data) {
              if (err) {
                console.log("Error", err)
              } else {
                
              }
            })

          })
        })
      })
    }
  })  

}

async function ajouterCommentaire(propositionId, userId, commentaire) {
	const proposal = Proposal.findOne({uuid: propositionId})
	let comment = proposal.comments.find(e => e.rightHolderId == userId)
	
	if(comment) {
		comment.comment = commentaire
	} else {
		proposal.comments.push({
			rightHolderId: userId,
			comment: commentaire
		})
	}
	
	await proposal.save()
	return proposal
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
                    droit.voteStatus = droits[famille].vote
                    droit.comment = droits[famille].raison
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
                'rightHolderId': userId
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
                      "callbackURL": `http://dev.smartsplit.org/proposition/vote/${jeton}`
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
