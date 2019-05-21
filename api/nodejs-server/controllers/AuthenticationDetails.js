'use strict';

var utils = require('../utils/writer.js');
var AuthenticationDetails = require('../service/AuthenticationDetailsService');

module.exports.getRefreshToken = function getRefreshToken (req, res, next) {
  AuthenticationDetails.getRefreshToken()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.postAuth = function postAuth (req, res, next) {
  var auth = req.swagger.params['auth'].value;
  AuthenticationDetails.postAuth(auth)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
