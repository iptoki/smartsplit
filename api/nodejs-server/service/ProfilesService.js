'use strict';
const lodb = require('lodb');
const db = lodb('db.json');


/**
 * Delete a right holder's profile with the given ID
 *
 * id Integer The rights holder's unique profile ID
 * no response value expected for this operation
 **/
exports.deleteProfile = function(id) {
  return new Promise(function(resolve, reject) {
    let profile = db('profiles').find({ id: id }).value()
    db('profiles').remove({ id: id })
    db.save()
    if (Object.keys(profile).length > 0) {
      resolve('Profile removed');
    } else {
      resolve();
    }
  });
}


/**
 * Get a list of all right holder profiles
 *
 * returns profiles
 **/
exports.getAllProfiles = function() {
  return new Promise(function(resolve, reject) {
    let profiles = db('profiles').value()
    if (Object.keys(profiles).length > 0) {
      resolve(profiles);
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
    let profile = db('profiles').find({ id: id }).value()
    if (Object.keys(profile).length > 0) {
      resolve(profile);
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
    let profile = db('profiles').find({ id: id }).value()
    if (Object.keys(profile).length > 0) {
      resolve(profile.email);
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
    let profile = db('profiles').find({ id: id }).value()
    if (Object.keys(profile).length > 0) {
      resolve(profile['first-name']);
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
    let profile = db('profiles').find({ id: id }).value()
    if (Object.keys(profile).length > 0) {
      resolve(profile.ipi);
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
    let profile = db('profiles').find({ id: id }).value()
    if (Object.keys(profile).length > 0) {
      resolve(profile['last-name']);
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
    let profile = db('profiles').find({ id: id }).value()
    if (Object.keys(profile).length > 0) {
      resolve(profile.media);
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
    let profile = db('profiles').find({ id: id }).value()
    if (Object.keys(profile).length > 0) {
      resolve(profile.role);
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
    let profile = db('profiles').find({ id: id }).value()
    if (Object.keys(profile).length > 0) {
      resolve(profile.wallet);
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
    let emailOld = (db('profiles').find({ id: id }).value()).email;
    db('profiles').find({ id: id }).assign({ email: email.email });
    db.save();
    let profile = db('profiles').find({ id: id }).value();
    if (profile.email != emailOld) {
      resolve("Email updated: " + profile.email);
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
    let firstNameOld = (db('profiles').find({ id: id }).value())['first-name'];
    db('profiles').find({ id: id }).assign({ 'first-name': firstName['first-name'] });
    db.save();
    let profile = db('profiles').find({ id: id }).value();
    if (( profile['first-name'] ) != firstNameOld) {
      resolve("First name updated: " + profile['first-name']);
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
    let ipiOld = (db('profiles').find({ id: id }).value()).ipi;
    db('profiles').find({ id: id }).assign({ ipi: ipi.ipi });
    db.save();
    let profile = db('profiles').find({ id: id }).value();
    if (profile.ipi  != ipiOld) {
      resolve("Interested party information number updated: " + profile.ipi);
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
    let lastNameOld = (db('profiles').find({ id: id }).value())['last-name'];
    db('profiles').find({ id: id }).assign({ 'last-name': lastName['last-name'] });
    db.save();
    let profile = db('profiles').find({ id: id }).value();
    if (profile['last-name']  != lastNameOld) {
      resolve("Last name updated: " + profile['last-name']);
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
    let mediaOld = (db('profiles').find({ id: id }).value()).media;
    let mediaString = mediaOld + "," + mediaId;
    // convert to an array of sorted numbers
    let mediaValue = mediaString.split(',').map(Number).sort();
    db('profiles').find({ id: id }).assign({ media: [...new Set(mediaValue)] });
    db.save();
    let profile = db('profiles').find({ id: id }).value();
    if (profile.media != mediaOld) {
      resolve("Media added: " + profile.media);
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
    let roleOld = (db('profiles').find({ id: id }).value()).role;
    db('profiles').find({ id: id }).assign({ role: role.role });
    db.save();
    let profile = db('profiles').find({ id: id }).value();
    if (profile.role  != roleOld) {
      resolve("Role updated: " + profile.role);
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
    let walletOld = (db('profiles').find({ id: id }).value()).wallet;
    db('profiles').find({ id: id }).assign({ wallet: wallet.wallet });
    db.save();
    let profile = db('profiles').find({ id: id }).value();
    if (profile.wallet  != walletOld) {
      resolve("Wallet updated: " + profile.wallet);
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
    db('profiles').push( body )
    db.save()
    if (body) {
      resolve(body);
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
    db('profiles').find({ id: id }).assign({ 
      id: id,
      ipi: body.ipi,
      'first-name': body['first-name'],
      'last-name': body['last-name'],
      role: body.role,
      wallet: body.wallet,
      email: body.email,
      media: body.media
    })
    let profile =  db('profiles').find({ id: id }).value();
    if (body) {
      resolve(profile);
    } else {
      resolve();
    }
  });
}

