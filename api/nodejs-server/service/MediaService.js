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
      resolve("Media description updated: " + media.description);
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
      resolve("Media genre updated: " + media.genre);
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
      resolve("Media jurisdiction updated: " + media.jurisdiction);
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
      resolve("Media publisher updated: " + media.publisher);
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
      resolve("Media title updated: " + media.title);
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
    db('media').push( body[0] )
    db.save()
    if (body) {
      resolve(body);
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
    db('media').find({ mediaId: mediaId }).assign({ 
      mediaId: mediaId,
      title: body[0].title,
      split: body[0].split,
      jurisdiction: body[0].jurisdiction,
      genre: body[0].genre,
      description: body[0].description,
      'creation-date': body[0]['creation-date'],
      cover:body[0].cover,
      publisher: body[0].publisher,
      'rights-type': body[0]['rights-type'],
      'right-holders': body[0]['right-holders']
    });
    db.save();
    let media = db('media').find({ mediaId: mediaId }).value();
    if (body[0]) {
      resolve(media);
    } else {
      resolve();
    }
  });
}

