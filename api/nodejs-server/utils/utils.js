// Connexion à AWSSecretManager pour récupérer des secrets
getParameter = function (paramKey, cb) {    
    const AWS = require('aws-sdk');
    const ssm = new AWS.SSM();
    let params = {
        Name: 'ACCESS_KEY',
        /* required */
        WithDecryption: /*true ||*/ false
    };
    let request = ssm.getParameter(params, function(err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred
        } else {
            console.log('API_KEY', data.Parameter.Value); // successful response
            cb(data.Parameter.Value);
        };
    })
}
  