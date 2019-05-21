'use strict';

var utils = require('../utils/writer.js');
var Payments = require('../service/PaymentsService');

module.exports.paymentsGET = function paymentsGET (req, res, next) {
  Payments.paymentsGET()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.paymentsIdDELETE = function paymentsIdDELETE (req, res, next) {
  var id = req.swagger.params['id'].value;
  Payments.paymentsIdDELETE(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.paymentsIdGET = function paymentsIdGET (req, res, next) {
  var id = req.swagger.params['id'].value;
  Payments.paymentsIdGET(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.paymentsIdPUT = function paymentsIdPUT (req, res, next) {
  var id = req.swagger.params['id'].value;
  var body = req.swagger.params['body'].value;
  Payments.paymentsIdPUT(id,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.paymentsIdTransaction_hashGET = function paymentsIdTransaction_hashGET (req, res, next) {
  var id = req.swagger.params['id'].value;
  Payments.paymentsIdTransaction_hashGET(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.paymentsIdTransaction_hashPATCH = function paymentsIdTransaction_hashPATCH (req, res, next) {
  var id = req.swagger.params['id'].value;
  var transactionHash = req.swagger.params['transaction-hash'].value;
  Payments.paymentsIdTransaction_hashPATCH(id,transactionHash)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.paymentsIdTransaction_idGET = function paymentsIdTransaction_idGET (req, res, next) {
  var id = req.swagger.params['id'].value;
  Payments.paymentsIdTransaction_idGET(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.paymentsIdTransaction_idPATCH = function paymentsIdTransaction_idPATCH (req, res, next) {
  var id = req.swagger.params['id'].value;
  var transactionId = req.swagger.params['transaction-id'].value;
  Payments.paymentsIdTransaction_idPATCH(id,transactionId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.paymentsPOST = function paymentsPOST (req, res, next) {
  var body = req.swagger.params['body'].value;
  Payments.paymentsPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
