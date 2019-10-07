const AWS = require('aws-sdk');
const TABLE = 'rightHolder';
const TABLE_2 = 'entities';
const REGION = process.env.REGION;

const ddb = new AWS.DynamoDB.DocumentClient({region: REGION});



exports.handler = function(event, context, callback) {
  
    function b64ToUint6 (nChr) {
    
      return nChr > 64 && nChr < 91 ?
          nChr - 65
        : nChr > 96 && nChr < 123 ?
          nChr - 71
        : nChr > 47 && nChr < 58 ?
          nChr + 4
        : nChr === 43 ?
          62
        : nChr === 47 ?
          63
        :
          0;
    
    }
    
    function generateUUID() {
      let result, i, j;
      result = '';
      for(j=0; j<32; j++) {
        if( j == 8 || j == 12 || j == 16 || j == 20) 
          result = result + '-';
        i = Math.floor(Math.random()*16).toString(16).toLowerCase();
        result = result + i;
      }
      return result;
    }
    
    function base64DecToArr (sBase64, nBlockSize) {
    
      let
        sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, ""), nInLen = sB64Enc.length,
        nOutLen = nBlockSize ? Math.ceil((nInLen * 3 + 1 >>> 2) / nBlockSize) * nBlockSize : nInLen * 3 + 1 >>> 2, aBytes = new Uint8Array(nOutLen);
    
      for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
        nMod4 = nInIdx & 3;
        nUint24 |= b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4;
        if (nMod4 === 3 || nInLen - nInIdx === 1) {
          for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
            aBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
          }
          nUint24 = 0;
        }
      }
    
      return aBytes;
    }
  
    return new Promise(function(resolve, reject) {
       let groupUUID = generateUUID()
        // Confirm the user
        event.response.autoConfirmUser = true;
      
        // Set the email as verified if it is in the request
        if (event.request.userAttributes.hasOwnProperty("email")) {
            event.response.autoVerifyEmail = true;
        }
        let params = {
        TableName: TABLE,
          Item: {
            'rightHolderId': event.userName,
            'firstName': event.request.userAttributes.given_name,
            'lastName': event.request.userAttributes.family_name,
            'email': event.request.userAttributes.email,
            'avatarImage': event.request.userAttributes['custom:avatarImage'],
            'artistName': (event.request.userAttributes['custom:artistName']) ? event.request.userAttributes['custom:artistName'] : null,
            'defaultRoles': JSON.parse(String.fromCharCode.apply(null, new Uint16Array(base64DecToArr(event.request.userAttributes['custom:defaultRoles'], 2).buffer))),
            'instruments': ((event.request.userAttributes['custom:instruments']) ? JSON.parse(String.fromCharCode.apply(null, new Uint16Array(base64DecToArr(event.request.userAttributes['custom:instruments'], 2).buffer))) : null),
            // 'groups': JSON.parse(String.fromCharCode.apply(null, new Uint16Array(base64DecToArr(event.request.userAttributes['custom:groups'], 2).buffer))),
            'groups': [groupUUID]
            // 'wallet': ((event.request.userAttributes['custom:wallet']) ? (event.request.userAttributes['custom:wallet']) : null)
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
        let params_2 = {
        TableName: TABLE_2,
          Item: {
            // uuid: uuid_de_lentite, type: type_artistique(p.ex.), nom: nom_de_lentite, membres: [tableau_des_uuid_de_rightHolders]}
            'uuid': groupUUID,
            'type': 'type_artistique',
            'name': JSON.parse(String.fromCharCode.apply(null, new Uint16Array(base64DecToArr(event.request.userAttributes['custom:groups'], 2).buffer)))[0],
            'members': [event.userName]
          }
        };
        ddb.put(params_2, function(err, data) {
          if (err) {
            console.log("Error", err);
            context.done(null, event);
            resolve();
          } else {
            resolve("Success. Item Added");
            context.done(null, event);
          }
        });
        
      callback(null, event);
  });
};