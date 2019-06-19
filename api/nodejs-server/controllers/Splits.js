'use strict';

var utils = require('../utils/writer.js');
var Splits = require('../service/SplitsService');

module.exports.deleteSplit = function deleteSplit (req, res, next) {
  var uuid = req.swagger.params['uuid'].value;
  Splits.deleteSplit(uuid)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getAllSplits = function getAllSplits (req, res, next) {
  Splits.getAllSplits()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getSplit = function getSplit (req, res, next) {
  var uuid = req.swagger.params['uuid'].value;
  Splits.getSplit(uuid)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchSplitEmailToken = function patchSplitEmailToken (req, res, next) {
  var uuid = req.swagger.params['uuid'].value;
  var emailToken = req.swagger.params['emailToken'].value;
  Splits.patchSplitEmailToken(uuid,emailToken)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchSplitMediaId = function patchSplitMediaId (req, res, next) {
  var uuid = req.swagger.params['uuid'].value;
  var mediaId = req.swagger.params['mediaId'].value;
  Splits.patchSplitMediaId(uuid,mediaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchSplitType = function patchSplitType (req, res, next) {
  var uuid = req.swagger.params['uuid'].value;
  var splitType = req.swagger.params['splitType'].value;
  Splits.patchSplitType(uuid,splitType)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.postSplit = function postSplit (req, res, next) {
  var body = req.swagger.params['body'].value;
  Splits.postSplit(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateSplit = function updateSplit (req, res, next) {
  var uuid = req.swagger.params['uuid'].value;
  var body = req.swagger.params['body'].value;
  Splits.updateSplit(uuid,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
