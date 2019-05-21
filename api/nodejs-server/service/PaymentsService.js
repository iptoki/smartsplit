'use strict';


/**
 * Delete a right holder's profile with the given ID
 *
 * id Integer The rights holder's unique profile ID
 * no response value expected for this operation
 **/
exports.deletePayment = function(id) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Get a list of all payments' details
 *
 * returns payments
 **/
exports.getAllPayments = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
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
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
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
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
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
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
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
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
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
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
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
    var examples = {};
    examples['application/json'] = {
  "transaction-id" : "12345678",
  "mediaId" : 1,
  "transaction-hash" : "0x58a4c5ff945f8f1c0d0218466886d1e860c78cb625a2a4860e1efaf3a7c33b0c"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
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
    var examples = {};
    examples['application/json'] = {
  "transaction-id" : "12345678",
  "mediaId" : 1,
  "transaction-hash" : "0x58a4c5ff945f8f1c0d0218466886d1e860c78cb625a2a4860e1efaf3a7c33b0c"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

