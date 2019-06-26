'use strict';
const uuidv1 = require('uuid/v1');
const TABLE = 'splits';
const utils = require('../utils/utils.js');

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
 * uuid String The splits's unique profile ID
 * no response value expected for this operation
 **/
exports.deleteSplit = function(uuid) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'uuid': uuid
      }
    };
    // Call DynamoDB to delete the item from the table
    ddb.delete(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data);
        resolve('split removed');
      }
    });
  });
}


/**
 * Get a list of all media splits
 *
 * returns listSplits
 **/
exports.getAllSplits = function() {
  return new Promise(function(resolve, reject) {
    let params = {
      "TableName": TABLE,
    }
    ddb.scan(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data);
        resolve(data.Items);
      }
    });
  });
}


/**
 * Get a split with the given ID
 *
 * uuid String The split's unique  ID
 * returns splits
 **/
exports.getSplit = function(uuid) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'uuid': uuid
      }
    };
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
 * Update email token for given split
 *
 * uuid String The split's unique ID
 * emailToken EmailToken The split's email token
 * returns Object
 **/
exports.patchSplitEmailToken = function(uuid,emailToken) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'uuid': uuid
      },
      UpdateExpression: 'set emailToken = :e',
      ExpressionAttributeValues: {
        ':e' : emailToken.emailToken
      },
      ReturnValues: 'UPDATED_NEW'
    };
    ddb.update(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data.Attributes);
        resolve(data.Attributes);
      }
    });
  });
}


/**
 * Update mediaId for given split
 *
 * uuid String The split's unique ID
 * mediaId MediaId The split's email token
 * returns Object
 **/
exports.patchSplitMediaId = function(uuid,mediaId) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'uuid': uuid
      },
      UpdateExpression: 'set mediaId  = :m',
      ExpressionAttributeValues: {
        ':m' : mediaId.mediaId
      },
      ReturnValues: 'UPDATED_NEW'
    };
    ddb.update(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data.Attributes);
        resolve(data.Attributes);
      }
    });
  });
}


/**
 * Update split type for a given split
 *
 * uuid String The split's unique ID
 * splitType SplitType The split type of the split
 * returns Object
 **/
exports.patchSplitType = function(uuid,splitType) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'uuid': uuid
      },
      UpdateExpression: 'set splitType = list_append(if_not_exists(splitType, :empty_list), :t)',
      ExpressionAttributeValues: {
        ':t' : splitType,
        ':empty_list': []
      },
      ReturnValues: 'UPDATED_NEW'
    };
    ddb.update(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data.Attributes);
        resolve(data.Attributes);
      }
    });
  });
}


/**
 * This method creates a new split for a given media
 *
 * body Splits request
 * returns splits
 **/
exports.postSplit = function(body) {
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
        // Create unique ID value
        let SPLIT_UUID = uuidv1();

        let params = {
          TableName: TABLE,
          Item: {
            'uuid': SPLIT_UUID,
            'emailToken': body.emailToken,
            'splitType': body.splitType,
            'mediaId': body.mediaId
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
 * This method updates a split
 *
 * uuid String The splits unique profile ID
 * body Splits request
 * returns splits
 **/
exports.updateSplit = function(uuid,body) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'uuid': uuid
      },
      UpdateExpression: 'set emailToken  = :e, splitType = :t, mediaId = :m',
      ExpressionAttributeValues: {
        ':e' : body.emailToken,
        ':t' : body.splitType,
        ':m' : body.mediaId,
      },
      ReturnValues: 'UPDATED_NEW'
    };
    // Call DynamoDB to delete the item from the table
    ddb.update(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data.Attributes);
        resolve(data.Attributes);
      }
    });
  });
}
