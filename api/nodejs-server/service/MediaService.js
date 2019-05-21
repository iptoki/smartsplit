'use strict';
const lodb = require('lodb');
const db = lodb('db.json');

/**
 * Delete a right holder's profile with the given ID
 *
 * mediaId Integer The rights holder's unique profile ID
 * no response value expected for this operation
 **/
exports.deleteMedia = function(mediaId) {
  return new Promise(function(resolve, reject) {
    let media = db('media').find({ mediaId: mediaId }).value()
    db('media').remove({ mediaId: mediaId })
    db.save()
    if (Object.keys(media).length > 0) {
      resolve('Media record removed');
    } else {
      resolve();
    }
  });
}


/**
 * Get a list of all media
 *
 * returns medias
 **/
exports.getAllMedia = function() {
  return new Promise(function(resolve, reject) {
    let media = db('media').value()
    if (Object.keys(media).length > 0) {
      resolve(media);
    } else {
      resolve();
    }
  });
}


/**
 * Get media with the given ID
 *
 * mediaId Integer The artwork agreement's unique ID
 * returns media
 **/
exports.getMedia = function(mediaId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "split" : {
    "key" : 0.80082819046101150206595775671303272247314453125
  },
  "jurisdiction" : "SOCAN",
  "genre" : "Rock",
  "description" : "The wonderful classic hit song, Love You Baby",
  "creation-date" : "2019-01-01T15:53:00",
  "publisher" : "sync publishing",
  "rights-type" : {
    "key" : "rights-type"
  },
  "title" : "Love You Baby",
  "right-holders" : {
    "key" : "right-holders"
  }
};
    let media = db('media').find({ mediaId: mediaId }).value()
    if (Object.keys(media).length > 0) {
      resolve(media);
    } else {
      resolve();
    }
  });
}


/**
 * Get creation date of the media with the given ID
 *
 * mediaId Integer The artwork agreement's unique ID
 * returns Object
 **/
exports.getMediaCreationDate = function(mediaId) {
  return new Promise(function(resolve, reject) {
    let media = db('media').find({ mediaId: mediaId }).value()
    if (Object.keys(media).length > 0) {
      resolve(media['creation-date']);
    } else {
      resolve();
    }
  });
}


/**
 * Get the description of a piece of media
 *
 * mediaId Integer The artwork agreement's unique ID
 * returns Object
 **/
exports.getMediaDescription = function(mediaId) {
  return new Promise(function(resolve, reject) {
    let media = db('media').find({ mediaId: mediaId }).value()
    if (Object.keys(media).length > 0) {
      resolve(media.description);
    } else {
      resolve();
    }
  });
}


/**
 * Get the genre of the media with the given ID
 *
 * mediaId Integer The artwork agreement's unique ID
 * returns Object
 **/
exports.getMediaGenre = function(mediaId) {
  return new Promise(function(resolve, reject) {
    let media = db('media').find({ mediaId: mediaId }).value()
    if (Object.keys(media).length > 0) {
      resolve(media.genre);
    } else {
      resolve();
    }
  });
}


/**
 * Get the jurisdiction of the given media
 *
 * mediaId Integer The artwork agreement's unique ID
 * returns Object
 **/
exports.getMediaJurisdiction = function(mediaId) {
  return new Promise(function(resolve, reject) {
    let media = db('media').find({ mediaId: mediaId }).value()
    if (Object.keys(media).length > 0) {
      resolve(media.jurisdiction);
    } else {
      resolve();
    }
  });
}


/**
 * Get publisher name of the media with the given ID
 *
 * mediaId Integer The artwork agreement's unique ID
 * returns Object
 **/
exports.getMediaPublisher = function(mediaId) {
  return new Promise(function(resolve, reject) {
    let media = db('media').find({ mediaId: mediaId }).value()
    if (Object.keys(media).length > 0) {
      resolve(media.publisher);
    } else {
      resolve();
    }
  });
}


/**
 * Get the right holders who collaborated on media
 *
 * mediaId Integer The artwork agreement's unique ID
 * returns Object
 **/
exports.getMediaRightHolders = function(mediaId) {
  return new Promise(function(resolve, reject) {
    let media = db('media').find({ mediaId: mediaId }).value()
    if (Object.keys(media).length > 0) {
      resolve(media['right-holders']);
    } else {
      resolve();
    }
  });
}


/**
 * Get the type of rights of the given media         (Including copyright, performance, recording)
 *
 * mediaId Integer The artwork agreement's unique ID
 * returns Object
 **/
exports.getMediaRightsType = function(mediaId) {
  return new Promise(function(resolve, reject) {
    let media = db('media').find({ mediaId: mediaId }).value()
    if (Object.keys(media).length > 0) {
      resolve(media['rights-type']);
    } else {
      resolve();
    }
  });
}


/**
 * Get rights holders' percentage split given media
 *
 * mediaId Integer The artwork agreement's unique ID
 * returns Object
 **/
exports.getMediaSplit = function(mediaId) {
  return new Promise(function(resolve, reject) {
    let media = db('media').find({ mediaId: mediaId }).value()
    if (Object.keys(media).length > 0) {
      resolve(media.split);
    } else {
      resolve();
    }
  });
}


/**
 * Get the title of the given media identified by ID
 *
 * mediaId Integer The artwork agreement's unique ID
 * returns Object
 **/
exports.getMediaTitle = function(mediaId) {
  return new Promise(function(resolve, reject) {
    let media = db('media').find({ mediaId: mediaId }).value()
    if (Object.keys(media).length > 0) {
      resolve(media.title);
    } else {
      resolve();
    }
  });
}


/**
 * Update the description of a piece of media
 *
 * mediaId Integer The artwork agreement's unique ID
 * description Description The description of the artwork
 * returns Object
 **/
exports.patchMediaDescription = function(mediaId,description) {
  return new Promise(function(resolve, reject) {
    let descriptionOld = (db('media').find({ mediaId: mediaId }).value()).description;
    db('media').find({ mediaId: mediaId }).assign({ description: description.description });
    db.save();
    let media = db('media').find({ mediaId: mediaId }).value();
    if (media.description != descriptionOld) {
      resolve(media.description);
    } else {
      resolve();
    }
  });
}


/**
 * Update the genre of the media with the given ID
 *
 * mediaId Integer The artwork agreement's unique ID
 * genre Genre The genre of the artwork
 * returns Object
 **/
exports.patchMediaGenre = function(mediaId,genre) {
  return new Promise(function(resolve, reject) {
    let genreOld = (db('media').find({ mediaId: mediaId }).value()).genre;
    db('media').find({ mediaId: mediaId }).assign({ genre: genre.genre });
    db.save();
    let media = db('media').find({ mediaId: mediaId }).value();
    if (media.genre != genreOld) {
      resolve(media.genre);
    } else {
      resolve();
    }
  });
}


/**
 * Update the jurisdiction of the given media
 *
 * mediaId Integer The artwork agreement's unique ID
 * jurisdiction Jurisdiction The jurisdiction of the given media
 * returns Object
 **/
exports.patchMediaJurisdiction = function(mediaId,jurisdiction) {
  return new Promise(function(resolve, reject) {
    let jurisdictionOld = (db('media').find({ mediaId: mediaId }).value()).jurisdiction;
    db('media').find({ mediaId: mediaId }).assign({ jurisdiction: jurisdiction.jurisdiction });
    db.save();
    let media = db('media').find({ mediaId: mediaId }).value();
    if (media.jurisdiction != jurisdictionOld) {
      resolve(media.jurisdiction);
    } else {
      resolve();
    }
  });
}


/**
 * Update publisher of the media with the given ID
 *
 * mediaId Integer The artwork agreement's unique ID
 * publisher Publisher The publisher of the media
 * returns Object
 **/
exports.patchMediaPublisher = function(mediaId,publisher) {
  return new Promise(function(resolve, reject) {
    let publisherOld = (db('media').find({ mediaId: mediaId }).value()).publisher;
    db('media').find({ mediaId: mediaId }).assign({ publisher: publisher.publisher });
    db.save();
    let media = db('media').find({ mediaId: mediaId }).value();
    if (media.publisher != publisherOld) {
      resolve(media.publisher);
    } else {
      resolve();
    }
  });
}


/**
 * Update the title of the given media identified by ID
 *
 * mediaId Integer The artwork agreement's unique ID
 * title Title The title of the artwork
 * returns Object
 **/
exports.patchMediaTitle = function(mediaId,title) {
  return new Promise(function(resolve, reject) {
    let titleOld = (db('media').find({ mediaId: mediaId }).value()).title;
    db('media').find({ mediaId: mediaId }).assign({ title: title.title });
    db.save();
    let media = db('media').find({ mediaId: mediaId }).value();
    if (media.title != titleOld) {
      resolve(media.title);
    } else {
      resolve();
    }
  });
}


/**
 * This method creates a new media item
 *
 * body Media request
 * returns media
 **/
exports.postMedia = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "split" : {
    "key" : 0.80082819046101150206595775671303272247314453125
  },
  "jurisdiction" : "SOCAN",
  "genre" : "Rock",
  "description" : "The wonderful classic hit song, Love You Baby",
  "creation-date" : "2019-01-01T15:53:00",
  "publisher" : "sync publishing",
  "rights-type" : {
    "key" : "rights-type"
  },
  "title" : "Love You Baby",
  "right-holders" : {
    "key" : "right-holders"
  }
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Update media with the given ID
 *
 * mediaId Integer The artwork agreement's unique ID
 * body Media request
 * returns media
 **/
exports.updateMedia = function(mediaId,body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "split" : {
    "key" : 0.80082819046101150206595775671303272247314453125
  },
  "jurisdiction" : "SOCAN",
  "genre" : "Rock",
  "description" : "The wonderful classic hit song, Love You Baby",
  "creation-date" : "2019-01-01T15:53:00",
  "publisher" : "sync publishing",
  "rights-type" : {
    "key" : "rights-type"
  },
  "title" : "Love You Baby",
  "right-holders" : {
    "key" : "right-holders"
  }
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

