'use strict';
const uuidv1 = require('uuid/v1');
const TABLE = 'rightsSplit';
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
 * Delete a right split with the given ID
 *
 * splitUuid String The split's unique profile ID
 * no response value expected for this operation
 **/
exports.deleteRightsSplit = function(id) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'id': id
      }
    };
    ddb.delete(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data);
        resolve('Rights split removed');
      }
    });
  });
}


/**
 * Get a list of all rights splits
 *
 * returns rightsSplits
 **/
exports.getAllRightsSplits = function() {
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
 * Get a rights split with the given ID
 *
 * splitUuid String The split's unique ID
 * returns rightsSplit
 **/
exports.getRightsSplit = function(id) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'id': id
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
 * Update split percentage for given rights split
 *
 * splitUuid String The split's unique ID
 * splitPct SplitPct The split percentage for the given rights split
 * returns Object
 **/
exports.patchRightsSplitPct = function(id,splitPct) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'id': id
      },
      UpdateExpression: 'set splitPct = :p',
      ExpressionAttributeValues: {
        ':p' : splitPct.splitPct
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
 * Update split uuid for given rights split
 *
 * id Integer The rights split's unique ID
 * splitUuid SplitUuid The uuid of the split for the given rights split
 * returns Object
 **/
exports.patchRightsSplitSplitUuid = function(id,splitUuid) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'id': id
      },
      UpdateExpression: 'set splitUuid  = :s',
      ExpressionAttributeValues: {
        ':s' : splitUuid.splitUuid
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
 * Update right holder for given rights split
 *
 * splitUuid String The rights split's unique ID
 * rightHolderId RightHolderId The split's email token
 * returns Object
 **/
exports.patchRightsSplitRightHolder = function(id,rightHolderId) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'id': id
      },
      UpdateExpression: 'set rightHolderId  = :r',
      ExpressionAttributeValues: {
        ':r' : rightHolderId.rightHolderId
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
 * Update roles of the right holder for a given rights split
 *
 * splitUuid String The rights split's unique ID
 * roles Roles The roles array of the given rights split for the right holder
 * returns Object
 **/
exports.patchRightsSplitRoles = function(id,roles) {
  return new Promise(function(resolve, reject) {
    let params = {
      "TableName": TABLE,
      Key: {
        'id': id
      }
    }
    // Get old roles
    ddb.get(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        let oldRoles = data.Item.roles;
        let rolesJoined = Object.assign({}, oldRoles, roles);
        let params = {
          TableName: TABLE,
          Key: {
            'id': id
          },
          UpdateExpression: 'set roles  = :r',
          ExpressionAttributeValues: {
            ':r' : rolesJoined
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
      }
    });
  });
}


/**
 * Update state for a given rights split
 *
 * splitUuid String The split's unique ID
 * state State The state of the rights split
 * returns Object
 **/
exports.patchRightsSplitState = function(id,state) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'id': id
      },
      UpdateExpression: 'set state  = :s',
      ExpressionAttributeValues: {
        ':s' : state.state
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
 * This method creates a new rights split for a given right holder
 *
 * body RightsSplits request
 * returns rightsSplits
 **/
exports.postRightsSplit = function(body) {
  return new Promise(function(resolve, reject) {
    let params = {
      "TableName": TABLE,
    }
    ddb.scan(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        let ID_VALUE = data.Count + 1;
        // Assign creationDate to current date time

        let params = {
          TableName: TABLE,
          Item: {
            'id': ID_VALUE,
            'splitUuid': body.splitUuid,
            'rightHolderId': body.rightHolderId,
            'splitPct': body.splitPct,
            'state': body.state,
            'roles': body.roles
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
 * This method updates a rights split
 *
 * splitUuid String The splits unique id
 * body RightsSplit request
 * returns rightsSplit
 **/
exports.updateRightsSplit = function(id,body) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'id': id
      },
      UpdateExpression: 'set splitUuid = :u, rightHolderId  = :i, splitPct = :p, state = :s, roles = :r',
      ExpressionAttributeValues: {
        ':u' : body.splitUuid,
        ':i' : body.rightHolderId,
        ':p' : body.splitPct,
        ':s' : body.state,
        ':r' : body.roles
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

