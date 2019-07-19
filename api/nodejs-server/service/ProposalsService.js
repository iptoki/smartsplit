'use strict';
const uuidv1 = require('uuid/v1');
const TABLE = 'proposal';
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
 * Delete a right split proposal with the given ID
 *
 * uuid String The splits proposal's unique profile ID
 * no response value expected for this operation
 **/
exports.deleteProposal = function(uuid) {
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
        resolve('split proposal removed');
      }
    });
  });
}


/**
 * Get a list of all media split proposals
 *
 * returns listProposals
 **/
exports.getAllProposals = function() {
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
 * Get a split proposal with the given ID
 *
 * uuid String The split proposal's unique ID
 * returns proposal
 **/
exports.getProposal = function(uuid) {
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
 * Get a split proposal with the given rightHolderId
 *
 * rightHolderId Number The right holder's unique ID
 * returns listProposals
 * 
 * TODO Modify FilterExpression to query rightsSplits object for rightHolderId
 **/
exports.getProposalsRightHolder = function(rightHolderId) {
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
  // return new Promise(function(resolve, reject) {
  //   let params = {
  //     TableName: TABLE,
  //     ExpressionAttributeValues: {
  //       ':rightHolderId' : {N: rightHolderId}
  //     },
  //     ProjectionExpression: "uuid, rightsSplits, initiator, mediaId, comments",
  //     FilterExpression: "contains (rightsSplits, :rightHolderId)"
  //   };
  //   ddb.get(params, function(err, data) {
  //     if (err) {
  //       console.log("Error", err);
  //       resolve();
  //     } else {
  //       console.log("Success", data);
  //       resolve(data);
  //     }
  //   });
  //   ddb.query(params, function(err, data) {
  //     if (err) {
  //       console.log("Error", err);
  //     } else {
  //       //console.log("Success", data.Items);
  //       data.Items.forEach(function(element, index, array) {
  //         console.log(element.uuid.N);
  //       });
  //     }
  //   });
  // });
}


/**
 * Update initiator for a given split proposal
 *
 * uuid String The split's unique ID
 * initiator Initiator The initiator of the given split proposal
 * returns Object
 **/
exports.patchProposalInitiator = function(uuid,initiator) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'uuid': uuid
      },
      UpdateExpression: 'set initiator = :i',
      ExpressionAttributeValues: {
        ':i' : initiator.initiator
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
 * Update mediaId for given split proposal
 *
 * uuid String The split proposal's unique ID
 * mediaId MediaId The split proposal's media Id
 * returns Object
 **/
exports.patchProposalMediaId = function(uuid,mediaId) {
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
 * Update rights split object for given split proposal
 *
 * uuid String The split proposal's unique ID
 * rightsSplits RightsSplits The split proposal's rights splits object
 * returns proposal/properties/rightsSplits
 **/
exports.patchProposalRightsSplits = function(uuid,rightsSplits) {
  return new Promise(function(resolve, reject) {
    let params = {
      "TableName": TABLE,
      Key: {
        'uuid': uuid
      }
    }
    // Get old proposals
    ddb.get(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        let oldRightsSplits = data.Item.rightsSplits; 
        // if (workCopyrightSplit,performanceNeighboringRightSplit,masterNeighboringRightSplit) 
        // TODO ADD LOGIC TO UPDATE RIGHTS SPLITS OBJECT INTELLIGENTLY
        let rightsSplitsJoined = Object.assign({}, oldRightsSplits, rightsSplits);
        let params = {
          TableName: TABLE,
          Key: {
            'uuid': uuid
          },
          UpdateExpression: 'set rightsSplits  = :r',
          ExpressionAttributeValues: {
            ':r' : rightsSplitsJoined
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
 * Update comments array for given split proposal
 *
 * uuid String The split proposal's unique ID
 * comments Comments The split proposal's comments array
 * returns proposal/properties/comments
 **/
exports.patchProposalComments = function(uuid, comments) {
  return new Promise(function(resolve, reject) {
    let params = {
      "TableName": TABLE,
      Key: {
        'uuid': uuid
      }
    }
    // Get old comments
    ddb.get(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        let oldComments = data.Item.comments
        let result = Object.keys(oldComments).map(function(key) {
            return Number(key), oldComments[key];
        });
        let commentsJoined = result.concat(comments);
        let params = {
          TableName: TABLE,
          Key: {
            'uuid': uuid
          },
          UpdateExpression: 'set comments  = :c',
          ExpressionAttributeValues: {
            ':c' : commentsJoined
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
 * This method creates a new split proposal for a given media
 *
 * body Proposal request
 * returns proposal
 **/
exports.postProposal = function(body) {
  return new Promise(function(resolve, reject) {
    let SPLIT_UUID = uuidv1();
    console.log('SPLIT UUID', SPLIT_UUID, SPLIT_UUID.type)
    let params = {
      TableName: TABLE,
      Item: {
        'uuid': SPLIT_UUID,
        'mediaId': body.mediaId,
        'initiator': body.initiator,
        'rightsSplits': body.rightsSplits,
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
  });
}


/**
 * This method updates a split proposal
 *
 * uuid String The split proposal's unique profile ID
 * body Proposal request
 * returns proposal
 * WIP - overrights existing splits
 **/
exports.updateProposal = function(uuid,body) {
  let params = {
    TableName: TABLE,
    Key: {
      'uuid': uuid
    },

  };
  ddb.get(params, function(err, data) {
    if (err) {
      console.log("Error", err);
      resolve();
    } else {
      // let oldProposal = data.Item; 
      // TODO ADD LOGIC TO UPDATE RIGHTS SPLITS OBJECT INTELLIGENTLY
      // let proposal = Object.assign({}, oldProposal, data.Item);
      let params = {
        TableName: TABLE,
        Key: {
          'uuid': uuid
        },
        // TODO ADD LOGIC TO UPDATE RIGHTS SPLITS OBJECT INTELLIGENTLY
        UpdateExpression: 'set rightsSplits  = :r, mediaId = :m, initiator = :i',
        ExpressionAttributeValues: {
          ':r' : body.rightsSplits,
          ':m' : body.mediaId,
          ':i' : body.initiator
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
}

