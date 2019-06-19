'use strict';

var utils = require('../utils/writer.js');
var RightsSplit = require('../service/RightsSplitService');

module.exports.deleteRightsSplit = function deleteRightsSplit (req, res, next) {
  var id = req.swagger.params['id'].value;
  RightsSplit.deleteRightsSplit(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getAllRightsSplits = function getAllRightsSplits (req, res, next) {
  RightsSplit.getAllRightsSplits()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getRightsSplit = function getRightsSplit (req, res, next) {
  var id = req.swagger.params['id'].value;
  RightsSplit.getRightsSplit(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchRightsSplitPct = function patchRightsSplitPct (req, res, next) {
  var id = req.swagger.params['id'].value;
  var splitPct = req.swagger.params['splitPct'].value;
  RightsSplit.patchRightsSplitPct(id,splitPct)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchRightsSplitSplitUuid = function patchRightsSplitSplitUuid (req, res, next) {
  var id = req.swagger.params['id'].value;
  var splitUuid = req.swagger.params['splitUuid'].value;
  RightsSplit.patchRightsSplitSplitUuid(id,splitUuid)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchRightsSplitRightHolder = function patchRightsSplitRightHolder (req, res, next) {
  var id = req.swagger.params['id'].value;
  var rightHolderId = req.swagger.params['rightHolderId'].value;
  RightsSplit.patchRightsSplitRightHolder(id,rightHolderId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchRightsSplitRoles = function patchRightsSplitRoles (req, res, next) {
  var id = req.swagger.params['id'].value;
  var roles = req.swagger.params['roles'].value;
  RightsSplit.patchRightsSplitRoles(id,roles)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchRightsSplitState = function patchRightsSplitState (req, res, next) {
  var id = req.swagger.params['id'].value;
  var state = req.swagger.params['state'].value;
  RightsSplit.patchRightsSplitState(id,state)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.postRightsSplit = function postRightsSplit (req, res, next) {
  var body = req.swagger.params['body'].value;
  RightsSplit.postRightsSplit(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateRightsSplit = function updateRightsSplit (req, res, next) {
  var id = req.swagger.params['id'].value;
  var body = req.swagger.params['body'].value;
  RightsSplit.updateRightsSplit(id,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
