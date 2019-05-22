'use strict';
const lodb = require('lodb');
const db = lodb('db.json');


/**
 * Delete a right holder's profile with the given ID
 *
 * id Integer The rights holder's unique profile ID
 * no response value expected for this operation
 **/
exports.deletePayment = function(id) {
  return new Promise(function(resolve, reject) {
    let payment = db('payments').find({ id: id }).value()
    db('payments').remove({ id: id })
    db.save()
    if (Object.keys(payment).length > 0) {
      resolve('Payment record removed');
    } else {
      resolve();
    }
  });
}


/**
 * Get a list of all payments' details
 *
 * returns payments
 **/
exports.getAllPayments = function() {
  return new Promise(function(resolve, reject) {
    let payments = db('payments').value()
    if (Object.keys(payments).length > 0) {
      resolve(payments);
    } else {
      resolve();
    }
  });
}


/**
 * Get the details of a payment with the given ID
 *
 * id Integer The payment's unique ID
 * returns payment
 **/
exports.getPayment = function(id) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "transaction-id" : "12345678",
  "mediaId" : 1,
  "transaction-hash" : "0x58a4c5ff945f8f1c0d0218466886d1e860c78cb625a2a4860e1efaf3a7c33b0c"
};
    let payment = db('payments').find({id: id}).value()
    if (Object.keys(payment).length > 0) {
      resolve(payment);
    } else {
      resolve();
    }
  });
}

/**
 * Get the amount for the given payment
 *
 * id Integer The payment's unique ID
 * returns Object
 **/
exports.getPaymentAmount = function(id) {
  return new Promise(function(resolve, reject) {
    let payment = db('payments').find({id: id}).value()
    if (Object.keys(payment).length > 0) {
      resolve("Payment amount: $" + payment.amount);
    } else {
      resolve();
    }
  });
}


/**
 * Get blockchain transaction hash of a payment
 *
 * id Integer The payment's unique ID
 * returns Object
 **/
exports.getPaymentTransactionHash = function(id) {
  return new Promise(function(resolve, reject) {
    let payment = db('payments').find({id: id}).value()
    if (Object.keys(payment).length > 0) {
      resolve(payment['transaction-hash']);
    } else {
      resolve();
    }
  });
}


/**
 * Get management societies' payment transaction ID
 *
 * id Integer The payment's unique ID
 * returns Object
 **/
exports.getPaymentTransactionID = function(id) {
  return new Promise(function(resolve, reject) {
    let payment = db('payments').find({id: id}).value()
    if (Object.keys(payment).length > 0) {
      resolve(payment['transaction-id']);
    } else {
      resolve();
    }
  });
}


/**
 * Update blockchain transaction hash of a payment
 *
 * id Integer The payment's unique ID
 * transactionHash Transaction-hash The blockchain hash of the transaction
 * returns Object
 **/
exports.patchPaymentTransactionHash = function(id,transactionHash) {
  return new Promise(function(resolve, reject) {
    let transactionHashOld = (db('payments').find({ id: id }).value())['transaction-hash'];
    db('payments').find({ id: id }).assign({ 'transaction-hash': transactionHash['transaction-hash'] });
    db.save();
    let payment = db('payments').find({ id: id }).value();
    if (payment['transaction-hash']  != transactionHashOld) {
      resolve("Transaction Hash updated: " + payment['transaction-hash']);
    } else {
      resolve();
    }
  });
}


/**
 * Update management societies' payment transaction ID
 *
 * id Integer The payment's unique ID
 * transactionId Transaction-id The payment transaction ID
 * returns Object
 **/
exports.patchPaymentTransactionID = function(id,transactionId) {
  return new Promise(function(resolve, reject) {
    let transactionIdOld = (db('payments').find({ id: id }).value())['transaction-id'];
    db('payments').find({ id: id }).assign({ 'transaction-id': transactionId['transaction-id'] });
    db.save();
    let payment = db('payments').find({ id: id }).value();
    if (payment['transaction-id']  != transactionIdOld) {
      resolve("Transaction ID updated: " + payment['transaction-id']);
    } else {
      resolve();
    }
  });
}


/**
 * Add a new payment
 *
 * body Payment The payment details
 * returns payment
 **/
exports.postPayment = function(body) {
  return new Promise(function(resolve, reject) {
    db('payments').push( body )
    db.save()
    if (body) {
      resolve(body);
    } else {
      resolve();
    }
  });
}


/**
 * Update the details of a payment with the given ID
 *
 * id Integer The payment's unique ID
 * body Payment The payment details
 * returns payment
 **/
exports.updatePayment = function(id,body) {
  return new Promise(function(resolve, reject) {
    db('payments').find({ id: id }).assign({ 
      id: id,
      amount: body.amount,
      'transaction-id': body['transaction-id'],
      'transaction-hash': body['transaction-hash']
    })
    let payment =  db('payments').find({ id: id }).value();
    if (body) {
      resolve(payment);
    } else {
      resolve();
    }
  });
}

