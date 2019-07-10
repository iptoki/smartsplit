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



//     var examples = {};
//     examples['application/json'] = {
//   "uuid" : "45745c60-7b1a-11e8-9c9c-2d42b21b1a3e",
//   "mediaId" : 1,
//   "initiator" : {
//     "id" : 1,
//     "name" : "Jim Smith"
//   },
//   "rightsSplits" : {
//     "workCopyrightSplit" : {
//       "music" : [ {
//         "contributorRole" : {
//           "12345c60-7b1a-11e8-9c9c-2d42b21b1a3e" : "songwriter",
//           "45745c60-7b1a-11e8-9c9c-2d42b21b1a3i" : "composer"
//         },
//         "rightHolder" : {
//           "id" : "1",
//           "name" : "Joe Smith"
//         },
//         "splitPct" : 50,
//         "voteStatus" : "active",
//         "_t" : "2019-07-08T16:45:51Z"
//       }, {
//         "contributorRole" : {
//           "12345c60-7b1a-11e8-9c9c-2d42b21b1a3f" : "songwriter",
//           "45745c60-7b1a-11e8-9c9c-2d42b21b1a3i" : "composer"
//         },
//         "rightHolder" : {
//           "id" : "2",
//           "name" : "Bob Andrews"
//         },
//         "splitPct" : 25,
//         "voteStatus" : "active",
//         "_t" : "2019-07-08T16:46:51Z"
//       } ],
//       "lyrics" : [ {
//         "contributorRole" : {
//           "12345c60-7b1a-11e8-9c9c-2d42b21b1a4g" : "arranger"
//         },
//         "id" : 3,
//         "rightHolder" : {
//           "uuid" : "3",
//           "name" : "Joe Duchane"
//         },
//         "splitPct" : 25,
//         "voteStatus" : "active",
//         "_t" : "2019-07-08T16:47:51Z"
//       } ]
//     },
//     "performanceNeighboringRightSplit" : {
//       "principal" : [ {
//         "contributorRole" : {
//           "12345c60-7b1a-11e8-9c9c-2d42b21b1a3e" : "guitarist",
//           "45745c60-7b1a-11e8-9c9c-2d42b21b1a3i" : "writer"
//         },
//         "id" : 4,
//         "rightHolder" : {
//           "uuid" : "1",
//           "name" : "Joe Smith"
//         },
//         "splitPct" : 80,
//         "voteStatus" : "active",
//         "_t" : "2019-07-08T16:40:51Z"
//       } ],
//       "accompaniment" : [ {
//         "contributorRole" : {
//           "12345c60-7b1a-11e8-9c9c-2d42b21b1a3f" : "flutist",
//           "45745c60-7b1a-11e8-9c9c-2d42b21b1a3i" : "writer"
//         },
//         "id" : 5,
//         "rightHolder" : {
//           "uuid" : "2",
//           "name" : "Bob Andrews"
//         },
//         "splitPct" : 20,
//         "voteStatus" : "active",
//         "_t" : "2019-07-08T16:39:51Z"
//       } ]
//     },
//     "masterNeighboringRightSplit" : [ {
//       "contributorRole" : {
//         "12345c60-7b1a-11e8-9c9c-2d42b21b1a3e" : "guitarist",
//         "45745c60-7b1a-11e8-9c9c-2d42b21b1a3i" : "writer"
//       },
//       "rightHolder" : {
//         "id" : "1",
//         "name" : "Joe Smith"
//       },
//       "splitPct" : 50,
//       "voteStatus" : "active",
//       "_t" : "2019-07-08T16:45:51Z"
//     }, {
//       "contributorRole" : {
//         "12345c60-7b1a-11e8-9c9c-2d42b21b1a3f" : "flutist",
//         "45745c60-7b1a-11e8-9c9c-2d42b21b1a3i" : "writer"
//       },
//       "rightHolder" : {
//         "id" : "2",
//         "name" : "Bob Andrews"
//       },
//       "splitPct" : 25,
//       "voteStatus" : "active",
//       "_t" : "2019-07-08T16:46:51Z"
//     }, {
//       "contributorRole" : {
//         "12345c60-7b1a-11e8-9c9c-2d42b21b1a4g" : "composer"
//       },
//       "id" : 3,
//       "rightHolder" : {
//         "uuid" : "3",
//         "name" : "Joe Duchane"
//       },
//       "splitPct" : 25,
//       "voteStatus" : "active",
//       "_t" : "2019-07-08T16:47:51Z"
//     } ]
//   }
// }


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
    // Get old rightsSplits
    ddb.get(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        let oldRightsSplits = data.Item.rightsSplits; 
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
 * This method creates a new split proposal for a given media
 *
 * body Proposal request
 * returns proposal
 **/
exports.postProposal = function(body) {
  return new Promise(function(resolve, reject) {
    let params = {
      "TableName": TABLE,
    }
    let SPLIT_UUID = uuidv1();
    let params = {
      TableName: TABLE,
      Item: {
        'uuid': SPLIT_UUID,
        'rightsSplits': body.rightsSplits,
        'initiator': body.initiator,
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
  });
}


/**
 * This method updates a split proposal
 *
 * uuid String The split proposal's unique profile ID
 * body Proposal request
 * returns proposal
 **/
exports.updateProposal = function(uuid,body) {
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
});
}

