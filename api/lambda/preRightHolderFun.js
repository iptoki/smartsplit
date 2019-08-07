const AWS = require('aws-sdk');
const TABLE = 'rightHolder';
const REGION = 'us-east-2';

const ddb = new AWS.DynamoDB.DocumentClient({region: REGION});


exports.handler = function(event, context, callback) {
    return new Promise(function(resolve, reject) {
        let params = {
        TableName: TABLE,
        Item: {
          'rightHolderId': event.userName,
          'firstName': event.request.userAttributes.name,
          'lastName': event.request.userAttributes.family_name,
          'email': event.request.userAttributes.email
          }
        };
        ddb.put(params, function(err, data) {
          if (err) {
            console.log("Error", err);
            context.done(null, event);
            resolve();
          } else {
            resolve("Success. Item Added");
            context.done(null, event);
          }
        });    
  });
};