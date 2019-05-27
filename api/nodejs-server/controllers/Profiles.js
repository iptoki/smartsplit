'use strict';

var utils = require('../utils/writer.js');
var Profiles = require('../service/ProfilesService');

module.exports.deleteProfile = function deleteProfile (req, res, next) {
  var id = req.swagger.params['id'].value;
  Profiles.deleteProfile(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getAllProfiles = function getAllProfiles (req, res, next) {
  Profiles.getAllProfiles()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getProfile = function getProfile (req, res, next) {
  var id = req.swagger.params['id'].value;
  Profiles.getProfile(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchProfileEmail = function patchProfileEmail (req, res, next) {
  var id = req.swagger.params['id'].value;
  var email = req.swagger.params['email'].value;
  Profiles.patchProfileEmail(id,email)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchProfileFirstName = function patchProfileFirstName (req, res, next) {
  var id = req.swagger.params['id'].value;
  var firstName = req.swagger.params['first-name'].value;
  Profiles.patchProfileFirstName(id,firstName)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchProfileIPI = function patchProfileIPI (req, res, next) {
  var id = req.swagger.params['id'].value;
  var ipi = req.swagger.params['ipi'].value;
  Profiles.patchProfileIPI(id,ipi)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchProfileLastName = function patchProfileLastName (req, res, next) {
  var id = req.swagger.params['id'].value;
  var lastName = req.swagger.params['last-name'].value;
  Profiles.patchProfileLastName(id,lastName)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchProfileMedia = function patchProfileMedia (req, res, next) {
  var id = req.swagger.params['id'].value;
  var mediaId = req.swagger.params['mediaId'].value;
  Profiles.patchProfileMedia(id,mediaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchProfileRole = function patchProfileRole (req, res, next) {
  var id = req.swagger.params['id'].value;
  var role = req.swagger.params['role'].value;
  Profiles.patchProfileRole(id,role)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchProfileWallet = function patchProfileWallet (req, res, next) {
  var id = req.swagger.params['id'].value;
  var wallet = req.swagger.params['wallet'].value;
  Profiles.patchProfileWallet(id,wallet)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.postProfile = function postProfile (req, res, next) {
  var body = req.swagger.params['body'].value;
  Profiles.postProfile(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateProfile = function updateProfile (req, res, next) {
  var id = req.swagger.params['id'].value;
  var body = req.swagger.params['body'].value;
  Profiles.updateProfile(id,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
