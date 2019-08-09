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