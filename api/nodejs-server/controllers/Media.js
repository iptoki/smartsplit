'use strict';

var utils = require('../utils/writer.js');
var Media = require('../service/MediaService');

module.exports.mediaGET = function mediaGET (req, res, next) {
  Media.mediaGET()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.mediaMediaIdCreation_dateGET = function mediaMediaIdCreation_dateGET (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  Media.mediaMediaIdCreation_dateGET(mediaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.mediaMediaIdDELETE = function mediaMediaIdDELETE (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  Media.mediaMediaIdDELETE(mediaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.mediaMediaIdDescriptionGET = function mediaMediaIdDescriptionGET (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  Media.mediaMediaIdDescriptionGET(mediaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.mediaMediaIdDescriptionPATCH = function mediaMediaIdDescriptionPATCH (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  var description = req.swagger.params['description'].value;
  Media.mediaMediaIdDescriptionPATCH(mediaId,description)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.mediaMediaIdGET = function mediaMediaIdGET (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  Media.mediaMediaIdGET(mediaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.mediaMediaIdGenreGET = function mediaMediaIdGenreGET (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  Media.mediaMediaIdGenreGET(mediaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.mediaMediaIdGenrePATCH = function mediaMediaIdGenrePATCH (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  var genre = req.swagger.params['genre'].value;
  Media.mediaMediaIdGenrePATCH(mediaId,genre)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.mediaMediaIdJurisdictionGET = function mediaMediaIdJurisdictionGET (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  Media.mediaMediaIdJurisdictionGET(mediaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.mediaMediaIdJurisdictionPATCH = function mediaMediaIdJurisdictionPATCH (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  var jurisdiction = req.swagger.params['jurisdiction'].value;
  Media.mediaMediaIdJurisdictionPATCH(mediaId,jurisdiction)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.mediaMediaIdPUT = function mediaMediaIdPUT (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  var body = req.swagger.params['body'].value;
  Media.mediaMediaIdPUT(mediaId,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.mediaMediaIdPublisherGET = function mediaMediaIdPublisherGET (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  Media.mediaMediaIdPublisherGET(mediaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.mediaMediaIdPublisherPATCH = function mediaMediaIdPublisherPATCH (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  var publisher = req.swagger.params['publisher'].value;
  Media.mediaMediaIdPublisherPATCH(mediaId,publisher)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.mediaMediaIdRight_holdersGET = function mediaMediaIdRight_holdersGET (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  Media.mediaMediaIdRight_holdersGET(mediaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.mediaMediaIdRights_typeGET = function mediaMediaIdRights_typeGET (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  Media.mediaMediaIdRights_typeGET(mediaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.mediaMediaIdSplitGET = function mediaMediaIdSplitGET (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  Media.mediaMediaIdSplitGET(mediaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.mediaMediaIdTitleGET = function mediaMediaIdTitleGET (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  Media.mediaMediaIdTitleGET(mediaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.mediaMediaIdTitlePATCH = function mediaMediaIdTitlePATCH (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  var title = req.swagger.params['title'].value;
  Media.mediaMediaIdTitlePATCH(mediaId,title)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.mediaPOST = function mediaPOST (req, res, next) {
  var body = req.swagger.params['body'].value;
  Media.mediaPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
