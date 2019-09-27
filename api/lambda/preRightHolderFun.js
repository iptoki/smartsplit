const AWS = require('aws-sdk');
const TABLE = 'rightHolder';
const REGION = 'us-east-1';

const ddb = new AWS.DynamoDB.DocumentClient({region: REGION});


exports.handler = function(event, context, callback) {
    return new Promise(function(resolve, reject) {
        let params = {
        TableName: TABLE,
        Item: {
          'rightHolderId': event.userName,
          'firstName': event.request.userAttributes.given_name,
          'lastName': event.request.userAttributes.family_name,
          'email': event.request.userAttributes.email,
          'artistName': event.request.userAttributes['custom:artistName'],
          'defaultRoles': JSON.parse(Buffer.from(event.request.userAttributes['custom:defaultRoles'], 'base64').toString('ascii')),
          'instruments': JSON.parse(Buffer.from(event.request.userAttributes['custom:instruments'], 'base64').toString('ascii')),
          'avatarImage': event.request.userAttributes['custom:avatarImage'],
          'groups': JSON.parse(Buffer.from(event.request.userAttributes['custom:groups'], 'base64').toString('ascii')),
          'wallet': event.request.userAttributes['custom:wallet']
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