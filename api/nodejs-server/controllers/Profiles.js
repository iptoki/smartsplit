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

module.exports.getProfileEmail = function getProfileEmail (req, res, next) {
  var id = req.swagger.params['id'].value;
  Profiles.getProfileEmail(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getProfileIPI = function getProfileIPI (req, res, next) {
  var id = req.swagger.params['id'].value;
  Profiles.getProfileIPI(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getProfileMedia = function getProfileMedia (req, res, next) {
  var id = req.swagger.params['id'].value;
  Profiles.getProfileMedia(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getProfileName = function getProfileName (req, res, next) {
  var id = req.swagger.params['id'].value;
  Profiles.getProfileName(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getProfileRole = function getProfileRole (req, res, next) {
  var id = req.swagger.params['id'].value;
  Profiles.getProfileRole(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getProfileWallet = function getProfileWallet (req, res, next) {
  var id = req.swagger.params['id'].value;
  Profiles.getProfileWallet(id)
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

module.exports.putProfileEmail = function putProfileEmail (req, res, next) {
  var id = req.swagger.params['id'].value;
  var email = req.swagger.params['email'].value;
  Profiles.putProfileEmail(id,email)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.putProfileIPI = function putProfileIPI (req, res, next) {
  var id = req.swagger.params['id'].value;
  var ipi = req.swagger.params['ipi'].value;
  Profiles.putProfileIPI(id,ipi)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.putProfileMedia = function putProfileMedia (req, res, next) {
  var id = req.swagger.params['id'].value;
  var mediaId = req.swagger.params['mediaId'].value;
  Profiles.putProfileMedia(id,mediaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.putProfileName = function putProfileName (req, res, next) {
  var id = req.swagger.params['id'].value;
  var name = req.swagger.params['name'].value;
  Profiles.putProfileName(id,name)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.putProfileRole = function putProfileRole (req, res, next) {
  var id = req.swagger.params['id'].value;
  var role = req.swagger.params['role'].value;
  Profiles.putProfileRole(id,role)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.putProfileWallet = function putProfileWallet (req, res, next) {
  var id = req.swagger.params['id'].value;
  var wallet = req.swagger.params['wallet'].value;
  Profiles.putProfileWallet(id,wallet)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
