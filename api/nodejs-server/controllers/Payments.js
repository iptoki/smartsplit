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

module.exports.patchPaymentTransactionHash = function patchPaymentTransactionHash (req, res, next) {
  var id = req.swagger.params['id'].value;
  var transactionHash = req.swagger.params['transactionHash'].value;
  Payments.patchPaymentTransactionHash(id,transactionHash)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchPaymentTransactionID = function patchPaymentTransactionID (req, res, next) {
  var id = req.swagger.params['id'].value;
  var transactionId = req.swagger.params['transactionId'].value;
  Payments.patchPaymentTransactionID(id,transactionId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.postPayment = function postPayment (req, res, next) {
  var body = req.swagger.params['body'].value;
  Payments.postPayment(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updatePayment = function updatePayment (req, res, next) {
  var id = req.swagger.params['id'].value;
  var body = req.swagger.params['body'].value;
  Payments.updatePayment(id,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
