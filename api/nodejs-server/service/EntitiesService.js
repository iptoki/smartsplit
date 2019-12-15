'use strict';

const uuidv1 = require('uuid/v1')
const TABLE = 'entities'
const utils = require('../utils/utils.js')
const jwt = require('jsonwebtoken')

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

exports.putUserInEntity = function(entite, username) {  
  return new Promise(function(resolve, reject){
    try {
      // 4. Récupère la proposition de part à un tier
      let params = {
        TableName: "entities"
      }
      ddb.scan(params, function(err, data) {
        if (err) {
          console.log("Error", err)
        }

        let _e
        data.Items.forEach(ent=>{
          if(ent.name === entite) {
            _e = ent
          }
        })

        let UUID = uuidv1();

        try {
          if(!_e) {
            // Création de l'entité et ajout de l'utilisateur          
            let _p = {
              TableName: "entities",
              Item: {
                uuid: UUID,
                name: entite,
                type: "type_artistique",
                members: [username]
              }
            }            
            ddb.put(_p, function(err, data) {
              if (err) {
                console.log("Error", err);
                reject(err)
              } else {    
                resolve(entite);
              }
            })
          } else {
            // Ajout de l'utilisateur à l'entité
            let _m = _e.members
            _m.push(username)
            let _p = {
              TableName: "entities",
              Key: {
                'uuid': _e.uuid
              },
              UpdateExpression: 'set members = :m',
              ExpressionAttributeValues: {
                ':m': _m
              },
              ReturnValues: 'UPDATED_NEW'
            }
            ddb.update(_p, function(err, data) {
              if (err) {
                console.log("Error", err);
                reject(err)
              } else {    
                resolve(entite);
              }
            })
          }
        } catch (err) {
          console.log(err)
          reject(err)
        }
        
      })
    } catch (err) {
      console.log(err)
    }
  })
}

exports.getAllEntities = function() {

  return new Promise(function(resolve, reject){
    // 4. Récupère la proposition de part à un tier
    let params = {
      TableName: "entities"
    }
    ddb.scan(params, function(err, data) {
      if (err) {
        console.log("Error", err)
      }

      resolve(data.Items)
      
    })
  })  
}