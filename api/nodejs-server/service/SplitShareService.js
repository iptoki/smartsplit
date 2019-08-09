'use strict';

const uuidv1 = require('uuid/v1');
const TABLE = 'splitShare';
const utils = require('../utils/utils.js');

// AWS
const AWS = require('aws-sdk');
const REGION = 'us-east-2';

AWS.config.update({
  region: REGION,
  accessKeyId: utils.getParameter('ACCESS_KEY'),
  secretAccessKey: utils.getParameter('SECRET_ACCESS_KEY')
});

const ddb = new AWS.DynamoDB.DocumentClient({region: REGION})

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