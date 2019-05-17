'use strict';

var utils = require('../utils/writer.js');
var Payments = require('../service/PaymentsService');

module.exports.deletePayment = function deletePayment (req, res, next) {
  var id = req.swagger.params['id'].value;
  Payments.deletePayment(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getAllPayments = function getAllPayments (req, res, next) {
  Payments.getAllPayments()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getPayment = function getPayment (req, res, next) {
  var id = req.swagger.params['id'].value;
  Payments.getPayment(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getPaymentTransactionHash = function getPaymentTransactionHash (req, res, next) {
  var id = req.swagger.params['id'].value;
  Payments.getPaymentTransactionHash(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getPaymentTransactionID = function getPaymentTransactionID (req, res, next) {
  var id = req.swagger.params['id'].value;
  Payments.getPaymentTransactionID(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.putPaymentTransactionHash = function putPaymentTransactionHash (req, res, next) {
  var id = req.swagger.params['id'].value;
  var transactionHash = req.swagger.params['transaction-hash'].value;
  Payments.putPaymentTransactionHash(id,transactionHash)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.putPaymentTransactionID = function putPaymentTransactionID (req, res, next) {
  var id = req.swagger.params['id'].value;
  var transactionId = req.swagger.params['transaction-id'].value;
  Payments.putPaymentTransactionID(id,transactionId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
