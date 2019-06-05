'use strict';
const lodb = require('lodb');
const db = lodb('./data/db.json');
const uuid = require('uuid');
const TABLE = 'profiles';
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
 * id Integer The rights holder's unique profile ID
 * no response value expected for this operation
 **/ 
exports.deleteProfile = function(id) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'id': id
      }
    };
    // Call DynamoDB to delete the item from the table
    ddb.delete(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data);
        resolve('Profile removed');
      }
    });
  });
}


/**
 * Get a list of all right holder profiles
 *
 * returns profiles
 **/
exports.getAllProfiles = function() {
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
        resolve(data.Items);
      }
    });
  });
}


/**
 * Get a right holder's profile with the given ID
 *
 * id Integer The rights holder's unique profile ID
 * returns profile
 **/
exports.getProfile = function(id) {
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
 * Update right holder's email address with given ID
 *
 * id Integer The right holder's unique profile ID
 * email Email The rights holder's email address
 * returns Object
 **/
exports.patchProfileEmail = function(id,email) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'id': id
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
 * id Integer The rights holder's unique profile ID
 * firstName First-name The rights holder's first name
 * returns Object
 **/
exports.patchProfileFirstName = function(id,firstName) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'id': id
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
 * Update right holder's artist name with the given ID
 *
 * id Integer The rights holder's unique profile ID
 * artistName Artist name The rights holder's artist name
 * returns Object
 **/
exports.patchProfileArtistName = function(id,artistName) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'id': id
      },
      UpdateExpression: 'set artistName  = :f',
      ExpressionAttributeValues: {
        ':f' : artistName.artistName
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
 * Update right holder's IPI number
 *
 * id Integer The right holder's unique profile ID
 * ipi Ipi The right holder's IPI number
 * returns Object
 **/
exports.patchProfileIPI = function(id,ipi) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'id': id
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
 * Update right holder's last name with the given ID
 *
 * id Integer The rights holder's unique profile ID
 * lastName Last-name The rights holder's last name
 * returns Object
 **/
exports.patchProfileLastName = function(id,lastName) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'id': id
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
 * Update list of media for the given right holder
 *
 * id Integer The right holder's unique profile ID
 * mediaId MediaIds The unique ID of the given media
 * returns profile
 **/
exports.patchProfileMedia = function(id,mediaId) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'id': id
      },
      UpdateExpression: 'set media = list_append(if_not_exists(media, :empty_list), :m)',
      ExpressionAttributeValues: {
        ':m' : mediaId,
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
 * Update right holder's role with the given ID       (Or list of roles including copyright, performance, and/or recording)
 *
 * id Integer The right holder's unique profile ID
 * contributorRole Contributor Role The right holder's role
 * returns Object
 **/
exports.patchProfileContributorRole = function(id,contributorRole) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'id': id
      },
      UpdateExpression: 'set contributorRole = list_append(if_not_exists(contributorRole, :empty_list), :r)',
      ExpressionAttributeValues: {
        ':r' : contributorRole,
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
 * Update the wallet address of a right holder
 *
 * id Integer The right holder's unique profile ID
 * wallet Wallet The right holder's wallet address
 * returns Object
 **/
exports.patchProfileWallet = function(id,wallet) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'id': id
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
 * Update list of social media links for the given right holder
 *
 * id Integer The right holder's unique profile ID
 * socialMediaLinks Social Media Links The Social Media URLs of the given profile  
 * returns profile
 **/
exports.patchProfileSocialMediaLinks = function(id,socialMediaLinks) {
  return new Promise(function(resolve, reject) {
    let params = {
      "TableName": TABLE,
      Key: {
        'id': id
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
            'id': id
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
 * This method creates a new profile
 *
 * body Profile request
 * returns profile
 **/
exports.postProfile = function(body) {
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
        let ID_VALUE = data.Count + 1;

        let params = {
          TableName: TABLE,
          Item: {
            'id': ID_VALUE,
            'ipi': body.ipi,
            'contributorRole': body.contributorRole,
            'wallet': body.wallet,
            'media': body.media,
            'firstName': body.firstName,
            'email': body.email,
            'lastName': body.lastName,
            'artistName': body.artistName,
            'socialMediaLinks': body.socialMediaLinks
          }
        };
        ddb.put(params, function(err, data) {
          if (err) {
            console.log("Error", err);
            resolve();
          } else {
            console.log("Success", data);
            resolve(data);
          }
        });
      }

    });
  });
}


/**
 * This method updates a profile
 *
 * id Integer The rights holder's unique profile ID
 * body Profile request
 * returns profile
 **/
// AWS updateItem
exports.updateProfile = function(id,body) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'id': id
      },
      UpdateExpression: 'set ipi  = :i, contributorRole = :r, wallet = :w, media = :m, firstName = :f, email = :e, lastName = :l, socialMediaLinks = :s, artistName = :a',
      ExpressionAttributeValues: {
        ':i' : body.ipi,
        ':r' : body.contributorRole,
        ':w' : body.wallet,
        ':m' : body.media,
        ':f' : body.firstName,
        ':e' : body.email,
        ':l' : body.lastName,
        ':s' : body.socialMediaLinks,
        ':a' : body.artistName
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

