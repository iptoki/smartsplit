'use strict';

var utils = require('../utils/writer.js');
var Proposals = require('../service/ProposalsService');

module.exports.deleteProposal = function deleteProposal (req, res, next) {
  var uuid = req.swagger.params['uuid'].value;
  Proposals.deleteProposal(uuid)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getAllProposals = function getAllProposals (req, res, next) {
  Proposals.getAllProposals()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getProposal = function getProposal (req, res, next) {
  var uuid = req.swagger.params['uuid'].value;
  Proposals.getProposal(uuid)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchProposalInitiator = function patchProposalInitiator (req, res, next) {
  var uuid = req.swagger.params['uuid'].value;
  var initiator = req.swagger.params['initiator'].value;
  Proposals.patchProposalInitiator(uuid,initiator)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchProposalMediaId = function patchProposalMediaId (req, res, next) {
  var uuid = req.swagger.params['uuid'].value;
  var mediaId = req.swagger.params['mediaId'].value;
  Proposals.patchProposalMediaId(uuid,mediaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchProposalRightsSplits = function patchProposalRightsSplits (req, res, next) {
  var uuid = req.swagger.params['uuid'].value;
  var rightsSplits = req.swagger.params['rightsSplits'].value;
  Proposals.patchProposalRightsSplits(uuid,rightsSplits)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.postProposal = function postProposal (req, res, next) {
  var body = req.swagger.params['body'].value;
  Proposals.postProposal(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateProposal = function updateProposal (req, res, next) {
  var uuid = req.swagger.params['uuid'].value;
  var body = req.swagger.params['body'].value;
  Proposals.updateProposal(uuid,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
