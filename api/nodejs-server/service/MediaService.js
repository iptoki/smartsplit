'use strict';
const utils = require('../utils/utils.js');
const jwt = require('jsonwebtoken');
const axios = require('axios')

function mediasDontEstInitiateurDeProposition(initiatorUuid) {
  return new Promise( (res, rej) => {
    // Récupérer les propositions par l'index initiatorUuid-index
    let params = {
      "TableName": 'proposal',
      "IndexName": "initiatorUuid-index",
      "ConsistentRead": false,
      "KeyConditionExpression": "initiatorUuid = :u",
      "ExpressionAttributeValues": {
          ":u": initiatorUuid
      }
    }
    ddb.query(params, function(err, data) {
      if (err) {
        console.log(err, err.stack)
        rej()
      }
      else {
        let medias = []
        data.Items.forEach(_p=>{
          if(!medias.includes(_p.mediaId)) { medias.push(_p.mediaId) }          
        })        
        // Récupérer chaque média (complet)
        let mediasRetour = []
        if(medias.length > 0) {
          medias.forEach(_m=>{
            let paramsMedia = {
              "TableName": 'media',
              Key: {
                "mediaId": _m
              }
            }
            ddb.get(paramsMedia, (err,data)=>{
              if(err) { console.log(err.stack) }
              else {
                let media = data.Item
                // Récupérer la dernière proposition du média
                propositionsParMedia(media.mediaId)
                .then(__p=>{
                  media.propositions = __p
                  mediasRetour.push(media)
                  // Fin lorsque tous les médias sont chargés
                  if(medias.length === mediasRetour.length) {
                    res(mediasRetour)
                  }
                })
              }
            })
          })
        } else {
          res(mediasRetour)
        }
      }     
    })
  })

}

function propositionsParMedia(mediaId) {
  
  // Récupérer les médias par l'index mediaId-index
  //  * La plus récente est à l'index 0

  return new Promise( (res, rej) => {
    let params = {
      "TableName": 'proposal',
      "IndexName": "mediaId-index",      
      "ConsistentRead": false,
      "KeyConditionExpression": "mediaId = :m",
      "ExpressionAttributeValues": {
          ":m": mediaId
      }
    }
    ddb.query(params, function(err, data) {
      if (err) {
        console.log(err, err.stack)
        rej()
      }
      else {
        data.Items.sort( (a, b)=> b._d - a._d )
        res(data.Items)
      }
    })
  })
}

function mediasParCreateur(rightHolderId) {
	return Media.find({"rightHolders.id": rightHolderId})
}

exports.listeCreateur = function(rightHolderId) {
  /**
   * Deux structures à assembler de manière asynchrones et en chaîne.
   *  * Pour chaque média récupéré, on associe la dernière proposition
   * A : Médias créés par l'ayant-droit
   * B : Médias dont l'ayant-droit a initié une proposition
   */
  return new Promise( (res, rej)=>{        

    // (A) 1. Récupérer la liste des médias dont l'ayant-droit est le créateur
    mediasParCreateur(rightHolderId)
    .then(medias=>{

      function b(rightHolderId) {
        // (B) 4. Découvrir les propositions dont l'usager est l'initiateur
        //        et qui ne sont pas des médias créés par l'usager
        mediasDontEstInitiateurDeProposition(rightHolderId)
        .then(_medias=>{
            // (A + B) 5. Construire la structure finale
            //            Ajoute aux médias déjà récupérés si non existant
            _medias.forEach(__m=>{
              if(!medias.find(___m=>___m.mediaId === __m.mediaId)) { medias.push(_m) }
            })
            // (B) 6. Trier la liste de médias restant en ordre d'identifiant séquentiel croissant
            medias.sort( (a, b)=> a.mediaId - b.mediaId )
            res( medias )
          }
        )
      }

      // Si n'a pas de médias, tester si est initiateur de proposition
      if(medias.length === 0) {
        b(rightHolderId)
      } else {
        // (A) 2. Associer la proposition la plus récente pour chaque media
        let cpt = 0 // Compteur pour suivre le nombre 
        medias.forEach( (m, idx) =>{
          // (A) 3. Récupérer les propositions du média
          propositionsParMedia(m.mediaId)
          .then(p=>{
            medias[idx].propositions = p
            cpt++ 
            // (A -> B) 3.1 Détecte que toutes les réponses sont revenues
            if(cpt == medias.length) {
              b(rightHolderId)
            }
          })
        })
      }        
    })
  })  
}

exports.listeCollaborations = function(rightHolderId) {
  return new Promise(function(resolve, reject) {
    let params = {
      "TableName": 'proposal',
    }
    // 1. Récupérer liste des propositions     
    ddb.scan(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        reject(err);
      } else {
        let propositions = data.Items        
        let listeMediaIds = []
        let listeMedias = []
        // 2. Extraire des propositions les mediaId uniques qui ont l'ayant-droit dans leurs collaborateurs
        propositions.forEach(p=>{
          Object.keys(p.rightsSplits).forEach(type=>{
            Object.keys(p.rightsSplits[type]).forEach(sousType=>{
              p.rightsSplits[type][sousType].forEach(part=>{
                // Si l'ayant-droit est dans les collaborateurs
                if(part.rightHolder.rightHolderId === rightHolderId) {
                  // Si le mediaId n'a pas déjà été saisi
                  if(!listeMediaIds.includes(p.mediaId)) {
                    listeMediaIds.push(p.mediaId)
                  }
                }
              })
            })
          })
        })
        // 3. Pour tous les médias saisie, les récupérer
        let cptMedia = 0 // Compteur de récupération des médias
        listeMediaIds.forEach(mediaId=>{
          let params = {
            TableName: TABLE,
            Key: {
              'mediaId': mediaId
            }
          };    
          ddb.get(params, function(err, data) {
            if (err) {
              console.log("Error", err);
              reject(err)          
            } else {
              let _media = data.Item              
              if(_media.creator !== rightHolderId) {
                listeMedias.push(_media)
              }
              cptMedia++
              if(cptMedia === listeMediaIds.length) {
                // Tous les médias sont récupérés
                // Récupérer les propositions pour chacun des médias de la listeMedias
                let cptPropositionsMedia = 0 // Compteur pour suivre le nombre 
                listeMedias.forEach( (m, idx) =>{
                  // (A) 3. Récupérer les propositions du média
                  propositionsParMedia(m.mediaId)
                  .then(p=>{
                    listeMedias[idx].propositions = p
                    cptPropositionsMedia++ 
                    // (A -> B) 3.1 Détecte que toutes les réponses sont revenues
                    if(cptPropositionsMedia == listeMedias.length) {
                      // 4. Trier la liste de médias restant en ordre d'identifiant séquentiel
                      listeMedias.sort((a,b)=>a.mediaId < b.mediaId)
                      // 5. Retourner la liste des médias ainsi épurée, et associer la proposition la plus récente au média
                      resolve(listeMedias)
                    }
                  })
                })
              }
            }
          });
        })  
        if(listeMediaIds.length === 0) {
          resolve(listeMedias)
        }        
      }
    });
  });
}