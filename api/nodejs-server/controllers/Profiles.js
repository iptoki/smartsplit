'use strict';

var utils = require('../utils/writer.js');
var Profiles = require('../service/ProfilesService');

module.exports.profilesGET = function profilesGET (req, res, next) {
  Profiles.profilesGET()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.profilesIdDELETE = function profilesIdDELETE (req, res, next) {
  var id = req.swagger.params['id'].value;
  Profiles.profilesIdDELETE(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.profilesIdEmailGET = function profilesIdEmailGET (req, res, next) {
  var id = req.swagger.params['id'].value;
  Profiles.profilesIdEmailGET(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.profilesIdEmailPATCH = function profilesIdEmailPATCH (req, res, next) {
  var id = req.swagger.params['id'].value;
  var email = req.swagger.params['email'].value;
  Profiles.profilesIdEmailPATCH(id,email)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.profilesIdFirst_nameGET = function profilesIdFirst_nameGET (req, res, next) {
  var id = req.swagger.params['id'].value;
  Profiles.profilesIdFirst_nameGET(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.profilesIdFirst_namePATCH = function profilesIdFirst_namePATCH (req, res, next) {
  var id = req.swagger.params['id'].value;
  var firstName = req.swagger.params['first-name'].value;
  Profiles.profilesIdFirst_namePATCH(id,firstName)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.profilesIdGET = function profilesIdGET (req, res, next) {
  var id = req.swagger.params['id'].value;
  Profiles.profilesIdGET(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.profilesIdIpiGET = function profilesIdIpiGET (req, res, next) {
  var id = req.swagger.params['id'].value;
  Profiles.profilesIdIpiGET(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.profilesIdIpiPATCH = function profilesIdIpiPATCH (req, res, next) {
  var id = req.swagger.params['id'].value;
  var ipi = req.swagger.params['ipi'].value;
  Profiles.profilesIdIpiPATCH(id,ipi)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.profilesIdLast_nameGET = function profilesIdLast_nameGET (req, res, next) {
  var id = req.swagger.params['id'].value;
  Profiles.profilesIdLast_nameGET(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.profilesIdLast_namePATCH = function profilesIdLast_namePATCH (req, res, next) {
  var id = req.swagger.params['id'].value;
  var lastName = req.swagger.params['last-name'].value;
  Profiles.profilesIdLast_namePATCH(id,lastName)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.profilesIdMediaGET = function profilesIdMediaGET (req, res, next) {
  var id = req.swagger.params['id'].value;
  Profiles.profilesIdMediaGET(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.profilesIdMediaPATCH = function profilesIdMediaPATCH (req, res, next) {
  var id = req.swagger.params['id'].value;
  var mediaId = req.swagger.params['mediaId'].value;
  Profiles.profilesIdMediaPATCH(id,mediaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.profilesIdPUT = function profilesIdPUT (req, res, next) {
  var id = req.swagger.params['id'].value;
  var body = req.swagger.params['body'].value;
  Profiles.profilesIdPUT(id,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.profilesIdRoleGET = function profilesIdRoleGET (req, res, next) {
  var id = req.swagger.params['id'].value;
  Profiles.profilesIdRoleGET(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.profilesIdRolePATCH = function profilesIdRolePATCH (req, res, next) {
  var id = req.swagger.params['id'].value;
  var role = req.swagger.params['role'].value;
  Profiles.profilesIdRolePATCH(id,role)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.profilesIdWalletGET = function profilesIdWalletGET (req, res, next) {
  var id = req.swagger.params['id'].value;
  Profiles.profilesIdWalletGET(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.profilesIdWalletPATCH = function profilesIdWalletPATCH (req, res, next) {
  var id = req.swagger.params['id'].value;
  var wallet = req.swagger.params['wallet'].value;
  Profiles.profilesIdWalletPATCH(id,wallet)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.profilesPOST = function profilesPOST (req, res, next) {
  var body = req.swagger.params['body'].value;
  Profiles.profilesPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
