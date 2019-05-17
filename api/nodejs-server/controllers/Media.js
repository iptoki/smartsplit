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

module.exports.getMediaCreationDate = function getMediaCreationDate (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  Media.getMediaCreationDate(mediaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getMediaDescription = function getMediaDescription (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  Media.getMediaDescription(mediaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getMediaGenre = function getMediaGenre (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  Media.getMediaGenre(mediaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getMediaJurisdiction = function getMediaJurisdiction (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  Media.getMediaJurisdiction(mediaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getMediaPublisher = function getMediaPublisher (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  Media.getMediaPublisher(mediaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getMediaRightHolders = function getMediaRightHolders (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  Media.getMediaRightHolders(mediaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getMediaRightsType = function getMediaRightsType (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  Media.getMediaRightsType(mediaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getMediaSplit = function getMediaSplit (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  Media.getMediaSplit(mediaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getMediaTitle = function getMediaTitle (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  Media.getMediaTitle(mediaId)
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

module.exports.putMediaDescription = function putMediaDescription (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  var description = req.swagger.params['description'].value;
  Media.putMediaDescription(mediaId,description)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.putMediaGenre = function putMediaGenre (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  var genre = req.swagger.params['genre'].value;
  Media.putMediaGenre(mediaId,genre)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.putMediaJurisdiction = function putMediaJurisdiction (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  var jurisdiction = req.swagger.params['jurisdiction'].value;
  Media.putMediaJurisdiction(mediaId,jurisdiction)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.putMediaPublisher = function putMediaPublisher (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  var publisher = req.swagger.params['publisher'].value;
  Media.putMediaPublisher(mediaId,publisher)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.putMediaRightHolders = function putMediaRightHolders (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  var rightHolders = req.swagger.params['right-holders'].value;
  Media.putMediaRightHolders(mediaId,rightHolders)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.putMediaRightsType = function putMediaRightsType (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  var rightsType = req.swagger.params['rights-type'].value;
  Media.putMediaRightsType(mediaId,rightsType)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.putMediaSplit = function putMediaSplit (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  var split = req.swagger.params['split'].value;
  Media.putMediaSplit(mediaId,split)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.putMediaTitle = function putMediaTitle (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  var title = req.swagger.params['title'].value;
  Media.putMediaTitle(mediaId,title)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
