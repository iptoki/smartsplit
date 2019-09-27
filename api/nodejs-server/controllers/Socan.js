'use strict';

var utils = require('../utils/writer.js');
var Payments = require('../service/SocanService');

module.exports.postSocan = function postSocan (req, res, next) {
  var body = req.swagger.params['body'].value;
  Payments.postSocan(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
