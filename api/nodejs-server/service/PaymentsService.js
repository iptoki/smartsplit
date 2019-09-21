'use strict';
const TABLE = 'payments';
const utils = require('../utils/utils.js');
const uuidv1 = require('uuid/v1');

// AWS 
const AWS = require('aws-sdk');
const REGION = 'us-east-2';

AWS.config.update({
  region: REGION,
  accessKeyId: utils.getParameter('ACCESS_KEY'),
  secretAccessKey: utils.getParameter('SECRET_ACCESS_KEY')
});

const ddb = new AWS.DynamoDB.DocumentClient({region: REGION});



/**
 * Delete a right holder's profile with the given ID
 *
 * id Integer The rights holder's unique profile ID
 * no response value expected for this operation
 **/
exports.deletePayment = function(id) {
  return new Promise(function(resolve, reject) {
    let params = {
      Key: {
        'id': id
      },
      TableName: TABLE
    };
    console.log(params);
    // Call DynamoDB to delete the item from the table
    ddb.delete(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data);
        resolve('Payment record removed');
      }
    });
  });
}




/**
 * Get a list of all payments' details
 *
 * returns payments
 **/
exports.getAllPayments = function() {
  return new Promise(function(resolve, reject) {
    let params = {
      "TableName": TABLE,
    }
    // Call DynamoDB to delete the item from the table
    ddb.scan(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data);
        resolve(data);
      }
    });
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
    let params = {
      TableName: TABLE,
      Key: {
        'id': id
      }
    };
    // Call DynamoDB to delete the item from the table
    ddb.get(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data);
        resolve(data);
      }
    });
  });
}


/**
 * Update blockchain transaction hash of a payment
 *
 * id Integer The payment's unique ID
 * transactionHash TransactionHash The blockchain hash of the transaction
 * returns Object
 **/
exports.patchPaymentTransactionHash = function(id,transactionHash) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'id': id
      },
      UpdateExpression: 'set transactionHash = :t',
      ExpressionAttributeValues: {
        ':t' : transactionHash.transactionHash
      },
      ReturnValues: 'UPDATED_NEW'
    };
    // Call DynamoDB to delete the item from the table
    ddb.update(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        
        resolve(data.Attributes);
      }
    });
  });
}


/**
 * Update management societies' payment transaction ID
 *
 * id Integer The payment's unique ID
 * transactionId TransactionId The payment transaction ID
 * returns Object
 **/
exports.patchPaymentTransactionID = function(id,transactionId) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'id': id
      },
      UpdateExpression: 'set transactionId = :t',
      ExpressionAttributeValues: {
        ':t' : transactionId.transactionId
      },
      ReturnValues: 'UPDATED_NEW'
    };
    // Call DynamoDB to delete the item from the table
    ddb.update(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        
        resolve(data.Attributes);
      }
    });
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
    // let ID_VALUE = uuidv1(); // ⇨ '45745c60-7b1a-11e8-9c9c-2d42b21b1a3e'
    
    let params = {
      "TableName": TABLE,
    }
    // Call DynamoDB to delete the item from the table
    ddb.scan(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data.Count);
        // Create unique ID value
        let ID_VALUE = data.Count + 1;

        let params = {
          TableName: TABLE,
          Item: {
            'id': ID_VALUE,
            'amount': body.amount,
            'payee': body.payee,
            'transactionId': body.transactionId,
            'transactionHash': body.transactionHash
          }
        };
        ddb.put(params, function(err, data) {
          if (err) {
            console.log("Error", err);
            resolve();
          } else {
            resolve("Success. Item Added");
          }
        });
      }

    });
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
    let params = {
      TableName: TABLE,
      Key: {
        'id': id
      },
      UpdateExpression: 'set amount = :a, payee = :p, transactionId = :i, transactionHash = :h',
      ExpressionAttributeValues: {
        ':a' : body.amount,
        ':p' : body.payee,
        ':i' : body.transactionId,
        ':h' : body.transactionHash
      },
      ReturnValues: 'UPDATED_NEW'
    };
    // Call DynamoDB to delete the item from the table
    ddb.update(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        
        resolve(data.Attributes);
      }
    });
  });
}

