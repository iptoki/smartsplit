'use strict';

var utils = require('../utils/writer.js')
var Entities = require('../service/EntitiesService')

module.exports.getAllEntities = function getAllEntities (req, res, next) {
  Entities.getAllEntities()
    .then(function (response) {
      utils.writeJson(res, response)
    })
    .catch(function (response) {
      utils.writeJson(res, response)
    })
}