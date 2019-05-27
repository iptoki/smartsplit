'use strict';

var utils = require('../utils/writer.js');
var Media = require('../service/MediaService');

module.exports.deleteMedia = function deleteMedia (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  Media.deleteMedia(mediaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getAllMedia = function getAllMedia (req, res, next) {
  Media.getAllMedia()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getMedia = function getMedia (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  Media.getMedia(mediaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchMediaDescription = function patchMediaDescription (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  var description = req.swagger.params['description'].value;
  Media.patchMediaDescription(mediaId,description)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchMediaGenre = function patchMediaGenre (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  var genre = req.swagger.params['genre'].value;
  Media.patchMediaGenre(mediaId,genre)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchMediaJurisdiction = function patchMediaJurisdiction (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  var jurisdiction = req.swagger.params['jurisdiction'].value;
  Media.patchMediaJurisdiction(mediaId,jurisdiction)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchMediaPublisher = function patchMediaPublisher (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  var publisher = req.swagger.params['publisher'].value;
  Media.patchMediaPublisher(mediaId,publisher)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchMediaTitle = function patchMediaTitle (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  var title = req.swagger.params['title'].value;
  Media.patchMediaTitle(mediaId,title)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchMediaAlbum = function patchMediaAlbum (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  var album = req.swagger.params['album'].value;
  Media.patchMediaAlbum(mediaId,album)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchModificationDate = function patchModificationDate (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  var modificationDate = req.swagger.params['modification-date'].value;
  Media.patchModificationDate(mediaId,modificationDate)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.postMedia = function postMedia (req, res, next) {
  var body = req.swagger.params['body'].value;
  Media.postMedia(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateMedia = function updateMedia (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  var body = req.swagger.params['body'].value;
  Media.updateMedia(mediaId,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
