const AWS = require('aws-sdk');
const TABLE = 'rightHolder';
const TABLE_2 = 'entities';
const REGION = process.env.REGION;

const ddb = new AWS.DynamoDB.DocumentClient({region: REGION});

const http = require('http');


exports.handler = function(event, context, callback) {
  
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
  
    return new Promise(function(resolve, reject) {
       
        // Confirm the user
        event.response.autoConfirmUser = true;
      
        // Set the email as verified if it is in the request
        if (event.request.userAttributes.hasOwnProperty("email")) {
            event.response.autoVerifyEmail = true;
        }
        
        console.log(event.request.userAttributes.given_name, event.request.userAttributes.family_name, event.request.userAttributes);
        
        let prenom, nom, nomArtiste, roles, instruments, groupes;
        prenom = JSON.parse(JSON.stringify(event.request.userAttributes.given_name));
        nom = JSON.parse(JSON.stringify(event.request.userAttributes.family_name));
        nomArtiste = event.request.userAttributes['custom:artistName'] ? JSON.parse(JSON.stringify(event.request.userAttributes['custom:artistName'])) : `${prenom} ${nom}`;
        roles = event.request.userAttributes['custom:defaultRoles'] ? JSON.parse(event.request.userAttributes['custom:defaultRoles']) : [];
        instruments = event.request.userAttributes['custom:instruments'] ? JSON.parse(event.request.userAttributes['custom:instruments']) : [];
        groupes = event.request.userAttributes['custom:groups'] ? JSON.parse(event.request.userAttributes['custom:groups']) : [];
        
        let params = {
        TableName: TABLE,
          Item: {
            'rightHolderId': event.userName,
            'firstName': prenom,
            'lastName': nom,
            'email': event.request.userAttributes.email,
            'avatarImage': event.request.userAttributes['custom:avatarImage'],
            'artistName': nomArtiste,
            'defaultRoles': roles,
            'instruments': instruments,
            'groups': groupes
          }
        };
        ddb.put(params, function(err, data) {
          if (err) {
            console.log("Error", err);
            context.done(null, event);
            reject(err);
          } else {
            
            /*
            
            Envoi courriel de bienvenue.
            
            */
            let body = [
            	{
            		"toEmail": event.request.userAttributes.email,
            		"firstName": prenom,
            		"lastName": nom,
            		"callbackURL": "http://proto.smartsplit.org/",
            		"template": "compteCree"
            	}
            ]
            
            const options = {
              hostname: 'messaging.smartsplit.org',
              port: 3034,
              path: '/sendEmail',
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(JSON.stringify(body))
              }
            }
            
            const req = http.request(options, (res) => {
              console.log(`STATUS: ${res.statusCode}`);
              console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
              
              res.setEncoding('utf8');
              
            });
          
            req.on('error', (e) => {
              console.error(`problem with request: ${e.message}`);
            });
            
            // Write data to request body
            req.write(JSON.stringify(body));
            req.end();
            
            /*
            
            Ajouter les entités de groupes ici
            
            */
            
            let _groupes = JSON.parse(event.request.userAttributes['custom:groups']) || [];
            
            console.log(_groupes)
            _groupes.forEach(_g=>{
              
              let gId, membres
              
              ddb.scan({TableName: TABLE_2}, (err, data)=>{
                if(err)
                  console.log(err)
                let _d = data.Items
                let groupeExiste = false
                _d.forEach(e=>{
                  if(e.name === _g) {
                    groupeExiste = true
                    gId = e.uuid
                    membres = e.members
                    console.log("Le groupe existe")
                    return
                  }
                })
                // ajoute aux entités si le groupe n'existe pas déjà
                if(!groupeExiste) {
                  let params_2 = {
                    TableName: TABLE_2,
                      Item: {
                        // uuid: uuid_de_lentite, type: type_artistique(p.ex.), nom: nom_de_lentite, membres: [tableau_des_uuid_de_rightHolders]}
                        'uuid': generateUUID(),
                        'type': 'type_artistique',
                        'name': _g,
                        'members': [event.userName]
                      }
                    };
                    console.log("Ajout à la base d'entités")
                    ddb.put(params_2, function(err, data) {
                      if (err) {
                        console.log("Error", err);
                        context.done(null, event);
                        reject(err);
                      } else {
                        resolve("Success. Item Added");
                        context.done(null, event);
                      }
                    });
                } else {
                  // Ajout de l'utilisateur dans les membres
                  
                  membres.push(event.userName)
                  
                  let params = {
                    TableName: TABLE_2,
                    Key: {
                      'uuid': gId
                    },
                    UpdateExpression: 'set members = :m',
                    ExpressionAttributeValues: {
                      ':m' : membres
                    },
                    ReturnValues: 'UPDATED_NEW'
                  };
                  // Call DynamoDB to delete the item from the table
                  ddb.update(params, function(err, data) {
                    if (err) {
                      console.log("Error", err);
                    } else {
                      console.log('Mise à jour des membres de groupe réussie')
                    }
                  });
                  
                }
              })
              
            })
            
          }
        });
        
        callback(null, event);
        
  });
};