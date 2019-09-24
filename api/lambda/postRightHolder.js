const AWS = require('aws-sdk');
const TABLE = 'rightHolder';
const REGION = 'us-east-1';

const ddb = new AWS.DynamoDB.DocumentClient({region: REGION});

exports.handler = function(event, context, callback) {
    return new Promise(function(resolve, reject) {
    let getParams = {
        TableName: TABLE,
        Key: {
        'rightHolderId': event.request.userAttributes.sub
        }
    }
    ddb.get(getParams, function(err, getData) {
      // if event.request.userAttributes.sub is in rightHolder table
      if (getData.Item !== undefined && getData.Item !== null) {
          let params = {
          TableName: TABLE,
          Item: {
            'rightHolderId': event.request.userAttributes.sub,
            'firstName': event.request.userAttributes.given_name,
            'lastName': event.request.userAttributes.family_name,
            'email': event.request.userAttributes.email,
            'ipi': getData.Item.ipi,
            'wallet': getData.Item.wallet,
            'jurisdiction': getData.Item.jurisdiction,
            'avatarImage': getData.Item.avatarImage,
            'artistName': getData.Item.artistName,
            'socialMediaLinks': getData.Item.socialMediaLinks,
            'defaultRoles': getData.Item.defaultRoles,
            'groups': getData.Item.groups,
            'instruments': getData.Item.instruments
          }
        }
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

      }
      // If there is an error
      else if (err) {
        console.log("Error", err);
        resolve();
        context.done(null, event);
      } 
      else {
        // else if event.request.userAttributes.sub is not in rightHolder table
        let params = {
        TableName: TABLE,
        Item: {
          'rightHolderId': event.request.userAttributes.sub,
          // 'firstName': event.request.userAttributes.given_name,
          // 'lastName': event.request.userAttributes.family_name,
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
        
      }

    });
  });
};