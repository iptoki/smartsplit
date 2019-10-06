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