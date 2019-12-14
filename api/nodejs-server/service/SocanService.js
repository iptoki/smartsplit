'use strict';
// const TABLE = 'socan';
const utils = require('../utils/utils.js');
const axios = require('axios');
// const uuidv1 = require('uuid/v1');

// AWS 
const AWS = require('aws-sdk');
const REGION = 'us-east-2';
const REGION_PARAMS = 'us-east-2';

AWS.config.update({
  region: REGION_PARAMS,
  accessKeyId: utils.getParameter('ACCESS_KEY'),
  secretAccessKey: utils.getParameter('SECRET_ACCESS_KEY')
});

// const ddb = new AWS.DynamoDB.DocumentClient({region: REGION});

const apiKey = utils.getParameter('SOCAN_API_KEY');
const accessTokenAWS = utils.getParameter('SOCAN_ACCESS_TOKEN');
const passwordSOCAN = utils.getParameter('SOCAN_ACCOUNT_PASSWORD');
const clientSecret = utils.getParameter('SOCAN_API_SECRET');
const accountIdSOOCAN = 'smartsplit';

/**
 * Request to join SOCAN as a writer member payment
 *
 * body The member details
 * returns success message
 **/
exports.postSocan = function(body) {
  return new Promise(function(resolve, reject) {
    // get new access token
    axios.post('https://api.socan.ca/auth/oauth/v2/token?client_id=' + apiKey + '&client_secret=' + clientSecret + '&grant_type=password' + '&password=' + passwordSOCAN + 'username=smartsplit')

    .then((response) => {                                
      let ACCESS_TOKEN = response.access_token
      // let ACCESS_TOKEN_2 = accessTokenAWS
      let config = {
        headers: {'Authorization': "Bearer " + ACCESS_TOKEN}
      };
      // let config2 = {
      //   headers: {'Authorization': "bearer " + ACCESS_TOKEN_2}
      // };
      const refreshToken = ''; // TODO Implement refresh token logic
      setTimeout(()=>{
        axios.post('https://api.socan.ca/sandbox/JoinSOCAN?apiKey=' + apiKey, body, config)
      }, 4000)                                
    })                            
    .catch((error) => {
       console.log(error)
    })
    .finally(()=>{
    })
  });
}