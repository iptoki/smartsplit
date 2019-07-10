'use strict';
const uuidv1 = require('uuid/v1');
const TABLE = 'rightHolder';
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
 * rightHolderId Integer The rights holder's unique profile ID
 * no response value expected for this operation
 **/
exports.deleteRightHolder = function(rightHolderId) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'rightHolderId': rightHolderId
      }
    };
    // Call DynamoDB to delete the item from the table
    ddb.delete(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data);
        resolve('Right holder removed');
      }
    });
  });
}


/**
 * Get a list of all right holder profiles
 *
 * returns rightHolders
 **/
exports.getAllRightHolders = function() {
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
 * Get a right holder's profile with the given ID
 *
 * rightHolderId Integer The rights holder's unique profile ID
 * returns rightHolder
 **/
exports.getRightHolder = function(rightHolderId) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'rightHolderId': rightHolderId
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
 * Update the artist name of a right holder
 *
 * rightHolderId Integer The right holder's unique profile ID
 * artistName ArtistName The right holder's artist name
 * returns Object
 **/
exports.patchRightHolderArtistName = function(rightHolderId,artistName) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'rightHolderId': rightHolderId
      },
      UpdateExpression: 'set artistNsme = :a',
      ExpressionAttributeValues: {
        ':a' : artistName.artistName
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


/**
 * Update the artist name of a right holder
 *
 * rightHolderId Integer The right holder's unique profile ID
 * avatarS3ETag AvatarS3Etag The right holder's S3 Etag for the profile avatar image
 * returns rightHolder/properties/avatarS3Etag
 **/
exports.patchRightHolderAvatarS3ETag = function(rightHolderId,avatarS3ETag) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'rightHolderId': rightHolderId
      },
      UpdateExpression: 'set avatarS3ETag = :a',
      ExpressionAttributeValues: {
        ':a' : avatarS3ETag.avatarS3ETag
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


/**
 * Update the cognito user pool Id of a right holder
 *
 * rightHolderId Integer The right holder's unique profile ID
 * cognitoId CognitoId The right holder's cognito Id in AWS user pools
 * returns rightHolder/properties/cognitoId
 **/
exports.patchRightHolderCognitoId = function(rightHolderId,cognitoId) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'rightHolderId': rightHolderId
      },
      UpdateExpression: 'set cognitoId = :c',
      ExpressionAttributeValues: {
        ':c' : cognitoId.cognitoId
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


/**
 * Update right holder's email address with given ID
 *
 * rightHolderId Integer The right holder's unique profile ID
 * email Email The rights holder's email address
 * returns Object
 **/
exports.patchRightHolderEmail = function(rightHolderId,email) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'rightHolderId': rightHolderId
      },
      UpdateExpression: 'set email = :e',
      ExpressionAttributeValues: {
        ':e' : email.email
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


/**
 * Update right holder's first name with the given ID
 *
 * rightHolderId Integer The rights holder's unique profile ID
 * firstName FirstName The rights holder's first name
 * returns Object
 **/
exports.patchRightHolderFirstName = function(rightHolderId,firstName) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'rightHolderId': rightHolderId
      },
      UpdateExpression: 'set firstName  = :f',
      ExpressionAttributeValues: {
        ':f' : firstName.firstName
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


/**
 * Update right holder's IPI number
 *
 * rightHolderId Integer The right holder's unique profile ID
 * ipi Ipi The right holder's IPI number
 * returns Object
 **/
exports.patchRightHolderIPI = function(rightHolderId,ipi) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'rightHolderId': rightHolderId
      },
      UpdateExpression: 'set ipi = :i',
      ExpressionAttributeValues: {
        ':i' : ipi.ipi
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


/**
 * Update the jurisdiction for the given right holder
 *
 * rightHolderId Integer The artwork agreement's unique ID
 * jurisdiction Jurisdiction The jurisdiction of the given right holder
 * returns Object
 **/
exports.patchRightHolderJurisdiction = function(rightHolderId,jurisdiction) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'rightHolderId': rightHolderId
      },
      UpdateExpression: 'set jurisdiction = :j',
      ExpressionAttributeValues: {
        ':j' : jurisdiction.jurisdiction
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


/**
 * Update right holder's last name with the given ID
 *
 * rightHolderId Integer The rights holder's unique profile ID
 * lastName LastName The rights holder's last name
 * returns Object
 **/
exports.patchRightHolderLastName = function(rightHolderId,lastName) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'rightHolderId': rightHolderId
      },
      UpdateExpression: 'set lastName  = :l',
      ExpressionAttributeValues: {
        ':l' : lastName.lastName
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


/**
 * Update right holder's password with given ID
 *
 * rightHolderId Integer The right holder's unique profile ID
 * password Password The rights holder's password
 * no response value expected for this operation
 **/
exports.patchRightHolderPassword = function(rightHolderId,password) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'rightHolderId': rightHolderId
      },
      UpdateExpression: 'set password = :p',
      ExpressionAttributeValues: {
        ':p' : password.password
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


/**
 * Update list of social media links for the given right holder
 *
 * rightHolderId Integer The right holder's unique profile ID
 * socialMediaLinks SocialMediaLinks The object containing the given right holder profile's social media links
 * returns rightHolder
 **/
exports.patchRightHolderSocialMediaLinks = function(rightHolderId,socialMediaLinks) {
  return new Promise(function(resolve, reject) {
    let params = {
      "TableName": TABLE,
      Key: {
        'rightHolderId': rightHolderId
      }
    }
    // Get old social media links
    ddb.get(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        let oldSocialMediaLinks = data.Item.socialMediaLinks;
        let socialMediaLinksJoined = Object.assign({}, oldSocialMediaLinks, socialMediaLinks);
        let params = {
          TableName: TABLE,
          Key: {
            'rightHolderId': rightHolderId
          },
          UpdateExpression: 'set socialMediaLinks  = :m',
          ExpressionAttributeValues: {
            ':m' : socialMediaLinksJoined
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
 * Update the wallet address of a right holder
 *
 * rightHolderId Integer The right holder's unique profile ID
 * wallet Wallet The right holder's wallet address
 * returns Object
 **/
exports.patchRightHolderWallet = function(rightHolderId,wallet) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'rightHolderId': rightHolderId
      },
      UpdateExpression: 'set wallet  = :f',
      ExpressionAttributeValues: {
        ':f' : wallet.wallet
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


/**
 * This method creates a new right holder profile
 *
 * body RightHolder request
 * returns rightHolder
 **/
exports.postRightHolder = function(body) {
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
        let RIGHT_HOLDER_ID = data.Count + 1;

        let params = {
          TableName: TABLE,
          Item: {
            'rightHolderId': RIGHT_HOLDER_ID,
            'ipi': body.ipi,
            'wallet': body.wallet,
            'media': body.media,
            'firstName': body.firstName,
            'email': body.email,
            'lastName': body.lastName,
            'password': body.password,
            'jurisdiction' : body.jurisdiction,
            'artistName' : body.artistName,
            'avatarS3ETag' : body.avatarS3ETag,
            'cognitoId' : body.cognitoId,
            'socialMediaLinks': body.socialMediaLinks
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
 * This method updates a right holder profile
 *
 * rightHolderId Integer The rights holder's unique profile ID
 * body RightHolder request
 * returns rightHolder
 **/
exports.updateRightHolder = function(rightHolderId,body) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'rightHolderId': rightHolderId
      },
      UpdateExpression: 'set ipi  = :i, wallet = :w, media = :m, firstName = :f, email = :e, lastName = :l, socialMediaLinks = :s, jurisdiction = :j, password = :p, artistName = :n, avatarS3ETag = :t, cognitoId = :c',
      ExpressionAttributeValues: {
        ':i' : body.ipi,
        ':w' : body.wallet,
        ':m' : body.media,
        ':f' : body.firstName,
        ':e' : body.email,
        ':l' : body.lastName,
        ':p' : body.password,
        ':j' : body.jurisdiction,
        ':n' : body.artistName,
        ':t' : body.avatarS3ETag,
        ':c' : body.cognitoId,
        ':s' : body.socialMediaLinks
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
