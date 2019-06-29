const dotenv = require('dotenv');
dotenv.config()

// Connexion à AWSSecretManager pour récupérer des secrets
let getParameter = exports.getParameter = function (paramKey, fn) {    
    const AWS = require('aws-sdk');
    const REGION = 'us-east-2';
    AWS.config.update({
        region: REGION
    });

    // Si une variale d'environnement existe pour paramKey on la retourne, sinon on demande à AWS SSM
    if(process.env[paramKey]) {
        if(fn) {
            fn(process.env[paramKey])
        } else {
            return process.env[paramKey]
        }        
    } else {
        const ssm = new AWS.SSM();
        let params = {
            Name: paramKey,
            WithDecryption: /*true ||*/ false
        };
        ssm.getParameter(params, function(err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
            } else {
                if (fn) {
                    fn (data.Parameter.Value)
                } else {
                    return (data.Parameter.Value)
                }            
            };
        })
    }
    
}
  