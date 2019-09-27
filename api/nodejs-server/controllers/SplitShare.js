'use strict';

var utils = require('../utils/writer.js')
var SplitShare = require('../service/SplitShareService')

module.exports.addEditorSplitShare = function addEditorSplitShare (req, res, next) {

  let body = req.swagger.params['body'].value

  SplitShare.addSplitShare(body, 'EDITOR')
    .then(function (response) {
      utils.writeJson(res, response)
    })
    .catch(function (response) {
      utils.writeJson(res, response)
    })
}

module.exports.inviteEditeur = function inviteEditeur (req, res, next) {
  let body = req.swagger.params['body'].value 
  SplitShare.inviteEditeur(body)
    .then(function (response) {
      utils.writeJson(res, response)
    })
    .catch(function (response) {
      utils.writeJson(res, response)
    })
}

module.exports.splitShareVote = function splitShareVote (req, res, next) {
  let body = req.swagger.params['body'].value 
  SplitShare.splitShareVote(body)
    .then(function (response) {
      utils.writeJson(res, response)
    })
    .catch(function (response) {
      utils.writeJson(res, response)
    })
}

module.exports.getSplitShare = function getSplitShare (req, res, next) {
  let propositionId = req.swagger.params['proposalId'].value 
  let rightHolderId = req.swagger.params['rightHolderId'].value 
  SplitShare.getSplitShare(propositionId, rightHolderId)
    .then(function (response) {
      utils.writeJson(res, response)
    })
    .catch(function (response) {
      utils.writeJson(res, response)
    })
}