'use strict';


/**
 * Delete a right holder's profile with the given ID
 *
 * rightHolderId Integer The rights holder's unique profile ID
 * no response value expected for this operation
 **/
exports.deleteRightHolder = function(rightHolderId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Get a list of all right holder profiles
 *
 * returns rightHolders
 **/
exports.getAllRightHolders = function() {
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
 * Get a right holder's profile with the given ID
 *
 * rightHolderId Integer The rights holder's unique profile ID
 * returns rightHolder
 **/
exports.getRightHolder = function(rightHolderId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "firstName" : "John",
  "lastName" : "Smith",
  "email" : "john.smith@example.com",
  "password" : "3c9c93e0f8eb2161e5787f7cd3e4b67f8d98fbd80b7d237cc757583b06daa3e3",
  "jurisdiction" : "Canada",
  "ipi" : "00004576",
  "wallet" : "0xdd87ae15f4be97e2739c9069ddef674f907d27a8",
  "avatarS3Etag" : "2f03d99fbf37d8d585285fd4cce27fea",
  "artistName" : "Questlove",
  "socialMediaLinks" : {
    "facebook" : "https://facebook.com/ex",
    "twitter" : "https://twitter.com/ex",
    "youtube" : "https://youtube.com/ex"
  }
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
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
 * Update the artist name of a right holder
 *
 * rightHolderId Integer The right holder's unique profile ID
 * avatarS3ETag AvatarS3Etag The right holder's S3 Etag for the profile avatar image
 * returns rightHolder/properties/avatarS3Etag
 **/
exports.patchRightHolderAvatarS3ETag = function(rightHolderId,avatarS3ETag) {
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
 * Update the cognito user pool Id of a right holder
 *
 * rightHolderId Integer The right holder's unique profile ID
 * cognitoId CognitoId The right holder's cognito Id in AWS user pools
 * returns rightHolder/properties/cognitoId
 **/
exports.patchRightHolderCognitoId = function(rightHolderId,cognitoId) {
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
 * Update right holder's email address with given ID
 *
 * rightHolderId Integer The right holder's unique profile ID
 * email Email The rights holder's email address
 * returns Object
 **/
exports.patchRightHolderEmail = function(rightHolderId,email) {
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
 * Update right holder's first name with the given ID
 *
 * rightHolderId Integer The rights holder's unique profile ID
 * firstName FirstName The rights holder's first name
 * returns Object
 **/
exports.patchRightHolderFirstName = function(rightHolderId,firstName) {
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
 * Update right holder's IPI number
 *
 * rightHolderId Integer The right holder's unique profile ID
 * ipi Ipi The right holder's IPI number
 * returns Object
 **/
exports.patchRightHolderIPI = function(rightHolderId,ipi) {
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
 * Update the jurisdiction for the given right holder
 *
 * rightHolderId Integer The artwork agreement's unique ID
 * jurisdiction Jurisdiction The jurisdiction of the given right holder
 * returns Object
 **/
exports.patchRightHolderJurisdiction = function(rightHolderId,jurisdiction) {
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
 * Update right holder's last name with the given ID
 *
 * rightHolderId Integer The rights holder's unique profile ID
 * lastName LastName The rights holder's last name
 * returns Object
 **/
exports.patchRightHolderLastName = function(rightHolderId,lastName) {
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
 * Update right holder's password with given ID
 *
 * rightHolderId Integer The right holder's unique profile ID
 * password Password The rights holder's password
 * no response value expected for this operation
 **/
exports.patchRightHolderPassword = function(rightHolderId,password) {
  return new Promise(function(resolve, reject) {
    resolve();
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
    var examples = {};
    examples['application/json'] = {
  "firstName" : "John",
  "lastName" : "Smith",
  "email" : "john.smith@example.com",
  "password" : "3c9c93e0f8eb2161e5787f7cd3e4b67f8d98fbd80b7d237cc757583b06daa3e3",
  "jurisdiction" : "Canada",
  "ipi" : "00004576",
  "wallet" : "0xdd87ae15f4be97e2739c9069ddef674f907d27a8",
  "avatarS3Etag" : "2f03d99fbf37d8d585285fd4cce27fea",
  "artistName" : "Questlove",
  "socialMediaLinks" : {
    "facebook" : "https://facebook.com/ex",
    "twitter" : "https://twitter.com/ex",
    "youtube" : "https://youtube.com/ex"
  }
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
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
 * This method creates a new right holder profile
 *
 * body RightHolder request
 * returns rightHolder
 **/
exports.postRightHolder = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "firstName" : "John",
  "lastName" : "Smith",
  "email" : "john.smith@example.com",
  "password" : "3c9c93e0f8eb2161e5787f7cd3e4b67f8d98fbd80b7d237cc757583b06daa3e3",
  "jurisdiction" : "Canada",
  "ipi" : "00004576",
  "wallet" : "0xdd87ae15f4be97e2739c9069ddef674f907d27a8",
  "avatarS3Etag" : "2f03d99fbf37d8d585285fd4cce27fea",
  "artistName" : "Questlove",
  "socialMediaLinks" : {
    "facebook" : "https://facebook.com/ex",
    "twitter" : "https://twitter.com/ex",
    "youtube" : "https://youtube.com/ex"
  }
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
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
    var examples = {};
    examples['application/json'] = {
  "firstName" : "John",
  "lastName" : "Smith",
  "email" : "john.smith@example.com",
  "password" : "3c9c93e0f8eb2161e5787f7cd3e4b67f8d98fbd80b7d237cc757583b06daa3e3",
  "jurisdiction" : "Canada",
  "ipi" : "00004576",
  "wallet" : "0xdd87ae15f4be97e2739c9069ddef674f907d27a8",
  "avatarS3Etag" : "2f03d99fbf37d8d585285fd4cce27fea",
  "artistName" : "Questlove",
  "socialMediaLinks" : {
    "facebook" : "https://facebook.com/ex",
    "twitter" : "https://twitter.com/ex",
    "youtube" : "https://youtube.com/ex"
  }
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

