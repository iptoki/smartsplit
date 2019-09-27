'use strict';
const uuidv1 = require('uuid/v1');
const TABLE = 'rightHolder';
const utils = require('../utils/utils.js');

// AWS
const AWS = require('aws-sdk');
const REGION = 'us-east-1';

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
      UpdateExpression: 'set artistName = :a',
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
        
        resolve(data.Attributes);
      }
    });
  });
}


/**
 * Update the artist name of a right holder
 *
 * rightHolderId Integer The right holder's unique profile ID
 * avatarImage  The right holder's image file name key on S3 for the profile avatar image
 * returns rightHolder/properties/avatarImage
 **/
exports.patchRightHolderAvatarImage = function(rightHolderId,avatarImage) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'rightHolderId': rightHolderId
      },
      UpdateExpression: 'set avatarImage = :a',
      ExpressionAttributeValues: {
        ':a' : avatarImage.avatarImage
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
            
            resolve(data.Attributes);
          }
        });
      }
    });
  });
}


/**
 * Update string set list of groups for the given right holder
 *
 * rightHolderId Integer The right holder's unique profile ID
 * groups:  The array (string set) containing the given right holder profile's groups
 **/
exports.patchRightHolderGroups = function(rightHolderId,groups) {
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
        let oldGroups = data.Item.groups;
        let groupsJoined = oldGroups.concat(groups);
        let params = {
          TableName: TABLE,
          Key: {
            'rightHolderId': rightHolderId
          },
          UpdateExpression: 'set groups  = :g',
          ExpressionAttributeValues: {
            ':g' : groupsJoined
          },
          ReturnValues: 'UPDATED_NEW'
        };
        ddb.update(params, function(err, data) {
          if (err) {
            console.log("Error", err);
            resolve();
          } else {
            
            resolve(data.Attributes);
          }
        });
      }
    });
  });
}


/**
 * Update string set list of groups for the given right holder
 *
 * rightHolderId Integer The right holder's unique profile ID
 * defaultRoles:  The array containing the given right holder profile's default roles
 **/
exports.patchRightHolderDefaultRoles = function(rightHolderId,defaultRoles) {
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
        let oldRoles = data.Item.defaultRoles;
        let rolesJoined = oldRoles.concat(defaultRoles);
        let params = {
          TableName: TABLE,
          Key: {
            'rightHolderId': rightHolderId
          },
          UpdateExpression: 'set defaultRoles  = :r',
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
        
        resolve(data.Attributes);
      }
    });
  });
}


/**
 * This method creates a new right holder profile (Currently it is not used)
 *
 * body RightHolder request
 * returns rightHolder
 **/
exports.postRightHolder = function(body) {
  return new Promise(function(resolve, reject) {
      let RIGHT_HOLDER_ID = uuidv1();
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
          'avatarImage' : body.avatarImage,
          'socialMediaLinks': body.socialMediaLinks,
          'defaultRoles': body.defaultRoles,
          'groups': body.groups,
          'newUser': body.newUser
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
      UpdateExpression: 'set ipi  = :i, wallet = :w, media = :m, firstName = :f, email = :e, lastName = :l, \
                             socialMediaLinks = :s, jurisdiction = :j, artistName = :n, avatarImage = :t, \
                             defaultRoles = :r, groups = :g, newUser = :u',
      ExpressionAttributeValues: {
        ':i' : body.ipi,
        ':w' : body.wallet,
        ':m' : body.media,
        ':f' : body.firstName,
        ':e' : body.email,
        ':l' : body.lastName,
        ':j' : body.jurisdiction,
        ':n' : body.artistName,
        ':t' : body.avatarImage,
        ':s' : body.socialMediaLinks,
        ':r' : body.defaultRoles,
        ':g' : body.groups,
        ':u' : body.newUser
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
