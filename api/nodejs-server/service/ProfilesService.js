'use strict';


/**
 * Delete a right holder's profile with the given ID
 *
 * id Integer The rights holder's unique profile ID
 * no response value expected for this operation
 **/
exports.deleteProfile = function(id) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Get a list of all right holder profiles
 *
 * returns profiles
 **/
exports.getAllProfiles = function() {
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
 * id Integer The rights holder's unique profile ID
 * returns profile
 **/
exports.getProfile = function(id) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "ipi" : "00004576",
  "role" : "writer",
  "wallet" : "0xdd87ae15f4be97e2739c9069ddef674f907d27a8",
  "media" : "",
  "first-name" : "John",
  "email" : "john.smith@example.com",
  "last-name" : "Smith"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Get a right holder's email address with given ID
 *
 * id Integer The right holder's unique profile ID
 * returns Object
 **/
exports.getProfileEmail = function(id) {
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
 * Get a right holder's first name with the given ID
 *
 * id Integer The rights holder's unique profile ID
 * returns Object
 **/
exports.getProfileFirstName = function(id) {
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
 * Get right holder's interested party information \"#\"
 *
 * id Integer The right holder's unique profile ID
 * returns Object
 **/
exports.getProfileIPI = function(id) {
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
 * Get a right holder's last name with the given ID
 *
 * id Integer The rights holder's unique profile ID
 * returns Object
 **/
exports.getProfileLastName = function(id) {
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
 * Get list of media for the given right holder
 *
 * id Integer The right holder's unique profile ID
 * returns mediaIds
 **/
exports.getProfileMedia = function(id) {
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
 * Get a right holder's role with the given ID       (Or list of roles including copyright, performance, and/or recording)
 *
 * id Integer The right holder's unique profile ID
 * returns Object
 **/
exports.getProfileRole = function(id) {
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
 * Get the wallet address of a right holder
 *
 * id Integer The right holder's unique profile ID
 * returns Object
 **/
exports.getProfileWallet = function(id) {
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
 * id Integer The right holder's unique profile ID
 * email Email The rights holder's email address
 * returns Object
 **/
exports.patchProfileEmail = function(id,email) {
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
 * id Integer The rights holder's unique profile ID
 * firstName First-name The rights holder's first name
 * returns Object
 **/
exports.patchProfileFirstName = function(id,firstName) {
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
 * id Integer The right holder's unique profile ID
 * ipi Ipi The right holder's IPI number
 * returns Object
 **/
exports.patchProfileIPI = function(id,ipi) {
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
 * id Integer The rights holder's unique profile ID
 * lastName Last-name The rights holder's last name
 * returns Object
 **/
exports.patchProfileLastName = function(id,lastName) {
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
 * Update list of media for the given right holder
 *
 * id Integer The right holder's unique profile ID
 * mediaId MediaIds The unique ID of the given media
 * returns profile
 **/
exports.patchProfileMedia = function(id,mediaId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "ipi" : "00004576",
  "role" : "writer",
  "wallet" : "0xdd87ae15f4be97e2739c9069ddef674f907d27a8",
  "media" : "",
  "first-name" : "John",
  "email" : "john.smith@example.com",
  "last-name" : "Smith"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Update right holder's role with the given ID       (Or list of roles including copyright, performance, and/or recording)
 *
 * id Integer The right holder's unique profile ID
 * role Role The right holder's role
 * returns Object
 **/
exports.patchProfileRole = function(id,role) {
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
 * Update the wallet address of a right holder
 *
 * id Integer The right holder's unique profile ID
 * wallet Wallet The right holder's wallet address
 * returns Object
 **/
exports.patchProfileWallet = function(id,wallet) {
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
 * This method creates a new profile
 *
 * body Profile request
 * returns profile
 **/
exports.postProfile = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "ipi" : "00004576",
  "role" : "writer",
  "wallet" : "0xdd87ae15f4be97e2739c9069ddef674f907d27a8",
  "media" : "",
  "first-name" : "John",
  "email" : "john.smith@example.com",
  "last-name" : "Smith"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * This method updates a profile
 *
 * id Integer The rights holder's unique profile ID
 * body Profile request
 * returns profile
 **/
exports.updateProfile = function(id,body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "ipi" : "00004576",
  "role" : "writer",
  "wallet" : "0xdd87ae15f4be97e2739c9069ddef674f907d27a8",
  "media" : "",
  "first-name" : "John",
  "email" : "john.smith@example.com",
  "last-name" : "Smith"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

