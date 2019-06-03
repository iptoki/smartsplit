'use strict';

const lodb = require('lodb');
const db = lodb('./data/db.json');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const jwt = require('json-web-token');

app.use(bodyParser.urlencoded({ extended: false }));

// AWS
// Besoin de bootstraper la récupération des paramètres puis l'activation de la BD AWS
const AWS = require('aws-sdk');
const REGION = 'us-east-2';

AWS.config.update({
  region: REGION,
  accessKeyId: getParameter("/aws/reference/secretsmanager/ACCESS_KEY"),
  secretAccessKey: getParameter("/aws/reference/secretsmanager/SECRET_ACCESS_KEY")
});

const ddb = new AWS.DynamoDB.DocumentClient({region: REGION});


/**
 * Refreshes your current, valid JWT token
 *
 * returns authResult
 **/
exports.getRefreshToken = function() {
  return new Promise(function(resolve, reject) {
    let accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJteV9pc3N1cmVyIiwiYXVkIjoiV29ybGQiLCJpYXQiOjE0MDAwNjI0MDAyMjQsImV4cCI6MTYwOTU1NDUxODAwMCwidHlwIjoiL3YxL2F1dGgiLCJyZXF1ZXN0Ijp7ImFwaUtleSI6IjEyMzQ1Njc4OTEyMzQ1Njc4OSIsInVzZXJuYW1lIjoiYXBwbGUiLCJwYXNzd29yZCI6ImFwcGxlIn19.1pANIo2rkisv_bwCSw9Q_z52S3Q3RTQsl8kkoTf1Yvo";
    let authentication = db('authentication').find({token: accessToken}).value()
    if (Object.keys(authentication).length > 0) {
      resolve("Authentication token refreshed: " + authentication.token);
    } else {
      resolve();
    }
  });
}


/**
 * Get a JWT token for the rest of the requests
 *
 * auth Auth JSON string containing your authentication details
 * returns authResult
 **/
exports.postAuth = function(auth) {
  return new Promise(function(resolve, reject) {
    let payload = {
      "iss": "my_issurer",
      "aud": "World",
      "iat": 1400062400224,
      "exp": 1609554518000,
      "typ": "/v1/auth",
      "request": auth
    };
    let secret = 'TOPSECRET';

    jwt.encode(secret, payload, function (err, token) {
      if (err) {
        console.error(err.name, err.message);
      } else {
        if (token) {
          resolve(token);
        } else {
          resolve();
        }

        // // decode 
        // jwt.decode(secret, token, function (err_, decodedPayload, decodedHeader) {
        //   if (err) {
        //     console.error(err.name, err.message);
        //   } else {
        //     console.log(decodedPayload, decodedHeader);
        //   }
        // });

      }
    });
  });
}

