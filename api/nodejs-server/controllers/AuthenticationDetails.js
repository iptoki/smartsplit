'use strict';

var utils = require('../utils/writer.js');
var AuthenticationDetails = require('../service/AuthenticationDetailsService');

module.exports.authPOST = function authPOST (req, res, next) {
  var auth = req.swagger.params['auth'].value;
  AuthenticationDetails.authPOST(auth)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.refresh_tokenGET = function refresh_tokenGET (req, res, next) {
  AuthenticationDetails.refresh_tokenGET()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
