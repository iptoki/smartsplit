'use strict';

var utils = require('../utils/writer.js');
var RightHolders = require('../service/RightHoldersService');

module.exports.deleteRightHolder = function deleteRightHolder (req, res, next) {
  var rightHolderId = req.swagger.params['rightHolderId'].value;
  RightHolders.deleteRightHolder(rightHolderId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getAllRightHolders = function getAllRightHolders (req, res, next) {
  RightHolders.getAllRightHolders()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getRightHolder = function getRightHolder (req, res, next) {
  var rightHolderId = req.swagger.params['rightHolderId'].value;
  RightHolders.getRightHolder(rightHolderId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getRightHolderId = function getRightHolderId (req, res, next) {
  var email = req.swagger.params['email'].value;
  RightHolders.getRightHolderId(email)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchRightHolderArtistName = function patchRightHolderArtistName (req, res, next) {
  var rightHolderId = req.swagger.params['rightHolderId'].value;
  var artistName = req.swagger.params['artistName'].value;
  RightHolders.patchRightHolderArtistName(rightHolderId,artistName)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchRightHolderAvatarImage = function patchRightHolderAvatarImage (req, res, next) {
  var rightHolderId = req.swagger.params['rightHolderId'].value;
  var avatarImage = req.swagger.params['avatarImage'].value;
  RightHolders.patchRightHolderAvatarImage(rightHolderId,avatarImage)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchRightHolderEmail = function patchRightHolderEmail (req, res, next) {
  var rightHolderId = req.swagger.params['rightHolderId'].value;
  var email = req.swagger.params['email'].value;
  RightHolders.patchRightHolderEmail(rightHolderId,email)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchRightHolderSource = function patchRightHolderSource (req, res, next) {
  var rightHolderId = req.swagger.params['rightHolderId'].value;
  var source = req.swagger.params['source'].value;
  RightHolders.patchRightHolderSource(rightHolderId,source)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchRightHolderFirstName = function patchRightHolderFirstName (req, res, next) {
  var rightHolderId = req.swagger.params['rightHolderId'].value;
  var firstName = req.swagger.params['firstName'].value;
  RightHolders.patchRightHolderFirstName(rightHolderId,firstName)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchRightHolderIPI = function patchRightHolderIPI (req, res, next) {
  var rightHolderId = req.swagger.params['rightHolderId'].value;
  var ipi = req.swagger.params['ipi'].value;
  RightHolders.patchRightHolderIPI(rightHolderId,ipi)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchRightHolderJurisdiction = function patchRightHolderJurisdiction (req, res, next) {
  var rightHolderId = req.swagger.params['rightHolderId'].value;
  var jurisdiction = req.swagger.params['jurisdiction'].value;
  RightHolders.patchRightHolderJurisdiction(rightHolderId,jurisdiction)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchRightHolderLastName = function patchRightHolderLastName (req, res, next) {
  var rightHolderId = req.swagger.params['rightHolderId'].value;
  var lastName = req.swagger.params['lastName'].value;
  RightHolders.patchRightHolderLastName(rightHolderId,lastName)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchRightHolderSocialMediaLinks = function patchRightHolderSocialMediaLinks (req, res, next) {
  var rightHolderId = req.swagger.params['rightHolderId'].value;
  var socialMediaLinks = req.swagger.params['socialMediaLinks'].value;
  RightHolders.patchRightHolderSocialMediaLinks(rightHolderId,socialMediaLinks)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchRightHolderDefaultRoles = function patchRightHolderDefaultRoles (req, res, next) {
  var rightHolderId = req.swagger.params['rightHolderId'].value;
  var defaultRoles = req.swagger.params['defaultRoles'].value;
  RightHolders.patchRightHolderDefaultRoles(rightHolderId,defaultRoles)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchRightHolderGroups = function patchRightHolderGroups (req, res, next) {
  var rightHolderId = req.swagger.params['rightHolderId'].value;
  var groups = req.swagger.params['groups'].value;
  RightHolders.patchRightHolderGroups(rightHolderId,groups)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchRightHolderWallet = function patchRightHolderWallet (req, res, next) {
  var rightHolderId = req.swagger.params['rightHolderId'].value;
  var wallet = req.swagger.params['wallet'].value;
  RightHolders.patchRightHolderWallet(rightHolderId,wallet)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.postRightHolder = function postRightHolder (req, res, next) {
  var body = req.swagger.params['body'].value;
  RightHolders.postRightHolder(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateRightHolder = function updateRightHolder (req, res, next) {
  var rightHolderId = req.swagger.params['rightHolderId'].value;
  var body = req.swagger.params['body'].value;
  RightHolders.updateRightHolder(rightHolderId,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
