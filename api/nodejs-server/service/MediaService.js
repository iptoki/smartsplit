'use strict';


/**
 * Delete a right holder's profile with the given ID
 *
 * mediaId Integer The rights holder's unique profile ID
 * no response value expected for this operation
 **/
exports.deleteMedia = function(mediaId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Get a list of all media
 *
 * returns medias
 **/
exports.getAllMedia = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
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
    examples['application/json'] = [ {
  "title" : "Love You Baby",
  "artist" : "LYB",
  "genre" : "Rock",
  "secondaryGenre" : "Pop",
  "creationDate" : "2019-01-01T15:53:00",
  "modificationDate" : "2019-01-01T15:53:01",
  "publishDate" : "2019-01-01T15:53:02",
  "cover" : false,
  "isrc" : "abcde1234567",
  "upc" : "123456789111",
  "publisher" : "sync publishing",
  "msDuration" : "288000",
  "lyrics" : "Love you Baby. Love you Baby. Love you Baby. Love you Baby. Love you Baby. Baby. Wooo. Love You Baby.",
  "inLanguages" : [ "english" ],
  "socialMediaLinks" : {
    "facebook" : "https://facebook.com/ex",
    "twitter" : "https://twitter.com/ex",
    "youtube" : "https://youtube.com/ex"
  },
  "streamingServiceLinks" : {
    "spotify" : "https://open.spotify.com/track/asdgj4qhfasd",
    "apple" : "https://twitter.com/ex"
  },
  "pressArticleLinks" : {
    "medium" : "https://medium.com/ex",
    "metro" : "https://metro.ca/ex"
  },
  "playlistLinks" : {
    "spotify" : "https://open.spotify.com/playlist/37i9dQZEVXbKfIuOAZrk7G",
    "youtube" : "https://www.youtube.com/playlist?list=PLgzTt0k8mXzEk586ze4BjvDXR7c-TUSnx"
  },
  "s3Etag" : "2f03d99fbf37d8d585285fd4cce27feb"
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Update the album name of the media with the given ID
 *
 * mediaId Integer The artwork agreement's unique ID
 * album Album The album of the artwork
 * returns Object
 **/
exports.patchMediaAlbum = function(mediaId,album) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Update the artist name of a piece of media
 *
 * mediaId Integer The artwork agreement's unique ID
 * artist Artist The artist name of the artwork
 * returns Object
 **/
exports.patchMediaArtist = function(mediaId,artist) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Update the duration of the media with the given ID
 *
 * mediaId Integer The artwork agreement's unique ID
 * msDuration MsDuration The duration in milliseconds of the given piece of media
 * returns Object
 **/
exports.patchMediaDuration = function(mediaId,msDuration) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
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
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Update the ISRC of the media with the given ID
 *
 * mediaId Integer The artwork agreement's unique ID
 * isrc Isrc The ISRC of the artwork
 * returns Object
 **/
exports.patchMediaISRC = function(mediaId,isrc) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Update list of languages for the lyrics for the given piece of media
 *
 * mediaId Integer The artwork agreement's unique ID
 * inLanguages InLanguages The object containing the languages for the given media's lyrics
 * returns media
 **/
exports.patchMediaInLanguages = function(mediaId,inLanguages) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "title" : "Love You Baby",
  "artist" : "LYB",
  "genre" : "Rock",
  "secondaryGenre" : "Pop",
  "creationDate" : "2019-01-01T15:53:00",
  "modificationDate" : "2019-01-01T15:53:01",
  "publishDate" : "2019-01-01T15:53:02",
  "cover" : false,
  "isrc" : "abcde1234567",
  "upc" : "123456789111",
  "publisher" : "sync publishing",
  "msDuration" : "288000",
  "lyrics" : "Love you Baby. Love you Baby. Love you Baby. Love you Baby. Love you Baby. Baby. Wooo. Love You Baby.",
  "inLanguages" : [ "english" ],
  "socialMediaLinks" : {
    "facebook" : "https://facebook.com/ex",
    "twitter" : "https://twitter.com/ex",
    "youtube" : "https://youtube.com/ex"
  },
  "streamingServiceLinks" : {
    "spotify" : "https://open.spotify.com/track/asdgj4qhfasd",
    "apple" : "https://twitter.com/ex"
  },
  "pressArticleLinks" : {
    "medium" : "https://medium.com/ex",
    "metro" : "https://metro.ca/ex"
  },
  "playlistLinks" : {
    "spotify" : "https://open.spotify.com/playlist/37i9dQZEVXbKfIuOAZrk7G",
    "youtube" : "https://www.youtube.com/playlist?list=PLgzTt0k8mXzEk586ze4BjvDXR7c-TUSnx"
  },
  "s3Etag" : "2f03d99fbf37d8d585285fd4cce27feb"
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Update the lyrics for the given piece of media
 *
 * mediaId Integer The artwork agreement's unique ID
 * lyrics Lyrics The lyrics for the given media
 * returns media
 **/
exports.patchMediaLyrics = function(mediaId,lyrics) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "title" : "Love You Baby",
  "artist" : "LYB",
  "genre" : "Rock",
  "secondaryGenre" : "Pop",
  "creationDate" : "2019-01-01T15:53:00",
  "modificationDate" : "2019-01-01T15:53:01",
  "publishDate" : "2019-01-01T15:53:02",
  "cover" : false,
  "isrc" : "abcde1234567",
  "upc" : "123456789111",
  "publisher" : "sync publishing",
  "msDuration" : "288000",
  "lyrics" : "Love you Baby. Love you Baby. Love you Baby. Love you Baby. Love you Baby. Baby. Wooo. Love You Baby.",
  "inLanguages" : [ "english" ],
  "socialMediaLinks" : {
    "facebook" : "https://facebook.com/ex",
    "twitter" : "https://twitter.com/ex",
    "youtube" : "https://youtube.com/ex"
  },
  "streamingServiceLinks" : {
    "spotify" : "https://open.spotify.com/track/asdgj4qhfasd",
    "apple" : "https://twitter.com/ex"
  },
  "pressArticleLinks" : {
    "medium" : "https://medium.com/ex",
    "metro" : "https://metro.ca/ex"
  },
  "playlistLinks" : {
    "spotify" : "https://open.spotify.com/playlist/37i9dQZEVXbKfIuOAZrk7G",
    "youtube" : "https://www.youtube.com/playlist?list=PLgzTt0k8mXzEk586ze4BjvDXR7c-TUSnx"
  },
  "s3Etag" : "2f03d99fbf37d8d585285fd4cce27feb"
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Update list of playlist links for the given piece of media
 *
 * mediaId Integer The artwork agreement's unique ID
 * playlistLinks PlaylistLinks The object containing the given piece of media's playlist links
 * returns media
 **/
exports.patchMediaPlaylistLinks = function(mediaId,playlistLinks) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "title" : "Love You Baby",
  "artist" : "LYB",
  "genre" : "Rock",
  "secondaryGenre" : "Pop",
  "creationDate" : "2019-01-01T15:53:00",
  "modificationDate" : "2019-01-01T15:53:01",
  "publishDate" : "2019-01-01T15:53:02",
  "cover" : false,
  "isrc" : "abcde1234567",
  "upc" : "123456789111",
  "publisher" : "sync publishing",
  "msDuration" : "288000",
  "lyrics" : "Love you Baby. Love you Baby. Love you Baby. Love you Baby. Love you Baby. Baby. Wooo. Love You Baby.",
  "inLanguages" : [ "english" ],
  "socialMediaLinks" : {
    "facebook" : "https://facebook.com/ex",
    "twitter" : "https://twitter.com/ex",
    "youtube" : "https://youtube.com/ex"
  },
  "streamingServiceLinks" : {
    "spotify" : "https://open.spotify.com/track/asdgj4qhfasd",
    "apple" : "https://twitter.com/ex"
  },
  "pressArticleLinks" : {
    "medium" : "https://medium.com/ex",
    "metro" : "https://metro.ca/ex"
  },
  "playlistLinks" : {
    "spotify" : "https://open.spotify.com/playlist/37i9dQZEVXbKfIuOAZrk7G",
    "youtube" : "https://www.youtube.com/playlist?list=PLgzTt0k8mXzEk586ze4BjvDXR7c-TUSnx"
  },
  "s3Etag" : "2f03d99fbf37d8d585285fd4cce27feb"
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Update list of press article links for the given piece of media
 *
 * mediaId Integer The artwork agreement's unique ID
 * pressArticleLinks PressArticleLinks The object containing the given piece of media's press article links
 * returns media
 **/
exports.patchMediaPressArticleLinks = function(mediaId,pressArticleLinks) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "title" : "Love You Baby",
  "artist" : "LYB",
  "genre" : "Rock",
  "secondaryGenre" : "Pop",
  "creationDate" : "2019-01-01T15:53:00",
  "modificationDate" : "2019-01-01T15:53:01",
  "publishDate" : "2019-01-01T15:53:02",
  "cover" : false,
  "isrc" : "abcde1234567",
  "upc" : "123456789111",
  "publisher" : "sync publishing",
  "msDuration" : "288000",
  "lyrics" : "Love you Baby. Love you Baby. Love you Baby. Love you Baby. Love you Baby. Baby. Wooo. Love You Baby.",
  "inLanguages" : [ "english" ],
  "socialMediaLinks" : {
    "facebook" : "https://facebook.com/ex",
    "twitter" : "https://twitter.com/ex",
    "youtube" : "https://youtube.com/ex"
  },
  "streamingServiceLinks" : {
    "spotify" : "https://open.spotify.com/track/asdgj4qhfasd",
    "apple" : "https://twitter.com/ex"
  },
  "pressArticleLinks" : {
    "medium" : "https://medium.com/ex",
    "metro" : "https://metro.ca/ex"
  },
  "playlistLinks" : {
    "spotify" : "https://open.spotify.com/playlist/37i9dQZEVXbKfIuOAZrk7G",
    "youtube" : "https://www.youtube.com/playlist?list=PLgzTt0k8mXzEk586ze4BjvDXR7c-TUSnx"
  },
  "s3Etag" : "2f03d99fbf37d8d585285fd4cce27feb"
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
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
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Update the AWS s3 Etag for given media
 *
 * mediaId Integer The artwork agreement's unique ID
 * s3Etag S3Etag The AWS s3 Etag string for the given media
 * returns media
 **/
exports.patchMediaS3Etag = function(mediaId,s3Etag) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "title" : "Love You Baby",
  "artist" : "LYB",
  "genre" : "Rock",
  "secondaryGenre" : "Pop",
  "creationDate" : "2019-01-01T15:53:00",
  "modificationDate" : "2019-01-01T15:53:01",
  "publishDate" : "2019-01-01T15:53:02",
  "cover" : false,
  "isrc" : "abcde1234567",
  "upc" : "123456789111",
  "publisher" : "sync publishing",
  "msDuration" : "288000",
  "lyrics" : "Love you Baby. Love you Baby. Love you Baby. Love you Baby. Love you Baby. Baby. Wooo. Love You Baby.",
  "inLanguages" : [ "english" ],
  "socialMediaLinks" : {
    "facebook" : "https://facebook.com/ex",
    "twitter" : "https://twitter.com/ex",
    "youtube" : "https://youtube.com/ex"
  },
  "streamingServiceLinks" : {
    "spotify" : "https://open.spotify.com/track/asdgj4qhfasd",
    "apple" : "https://twitter.com/ex"
  },
  "pressArticleLinks" : {
    "medium" : "https://medium.com/ex",
    "metro" : "https://metro.ca/ex"
  },
  "playlistLinks" : {
    "spotify" : "https://open.spotify.com/playlist/37i9dQZEVXbKfIuOAZrk7G",
    "youtube" : "https://www.youtube.com/playlist?list=PLgzTt0k8mXzEk586ze4BjvDXR7c-TUSnx"
  },
  "s3Etag" : "2f03d99fbf37d8d585285fd4cce27feb"
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Update the secondary genre of the media with the given ID
 *
 * mediaId Integer The artwork agreement's unique ID
 * secondaryGenre SecondaryGenre The secondary genre of the artwork
 * returns Object
 **/
exports.patchMediaSecondaryGenre = function(mediaId,secondaryGenre) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Update list of social media links for the given piece of media
 *
 * mediaId Integer The artwork agreement's unique ID
 * socialMediaLinks SocialMediaLinks The object containing the given piece of media's social media links
 * returns media
 **/
exports.patchMediaSocialMediaLinks = function(mediaId,socialMediaLinks) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "title" : "Love You Baby",
  "artist" : "LYB",
  "genre" : "Rock",
  "secondaryGenre" : "Pop",
  "creationDate" : "2019-01-01T15:53:00",
  "modificationDate" : "2019-01-01T15:53:01",
  "publishDate" : "2019-01-01T15:53:02",
  "cover" : false,
  "isrc" : "abcde1234567",
  "upc" : "123456789111",
  "publisher" : "sync publishing",
  "msDuration" : "288000",
  "lyrics" : "Love you Baby. Love you Baby. Love you Baby. Love you Baby. Love you Baby. Baby. Wooo. Love You Baby.",
  "inLanguages" : [ "english" ],
  "socialMediaLinks" : {
    "facebook" : "https://facebook.com/ex",
    "twitter" : "https://twitter.com/ex",
    "youtube" : "https://youtube.com/ex"
  },
  "streamingServiceLinks" : {
    "spotify" : "https://open.spotify.com/track/asdgj4qhfasd",
    "apple" : "https://twitter.com/ex"
  },
  "pressArticleLinks" : {
    "medium" : "https://medium.com/ex",
    "metro" : "https://metro.ca/ex"
  },
  "playlistLinks" : {
    "spotify" : "https://open.spotify.com/playlist/37i9dQZEVXbKfIuOAZrk7G",
    "youtube" : "https://www.youtube.com/playlist?list=PLgzTt0k8mXzEk586ze4BjvDXR7c-TUSnx"
  },
  "s3Etag" : "2f03d99fbf37d8d585285fd4cce27feb"
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Update list of streaming service links for the given piece of media
 *
 * mediaId Integer The artwork agreement's unique ID
 * streamingServiceLinks StreamingServiceLinks The object containing the given piece of media's streaming service links
 * returns media
 **/
exports.patchMediaStreamingServiceLinks = function(mediaId,streamingServiceLinks) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "title" : "Love You Baby",
  "artist" : "LYB",
  "genre" : "Rock",
  "secondaryGenre" : "Pop",
  "creationDate" : "2019-01-01T15:53:00",
  "modificationDate" : "2019-01-01T15:53:01",
  "publishDate" : "2019-01-01T15:53:02",
  "cover" : false,
  "isrc" : "abcde1234567",
  "upc" : "123456789111",
  "publisher" : "sync publishing",
  "msDuration" : "288000",
  "lyrics" : "Love you Baby. Love you Baby. Love you Baby. Love you Baby. Love you Baby. Baby. Wooo. Love You Baby.",
  "inLanguages" : [ "english" ],
  "socialMediaLinks" : {
    "facebook" : "https://facebook.com/ex",
    "twitter" : "https://twitter.com/ex",
    "youtube" : "https://youtube.com/ex"
  },
  "streamingServiceLinks" : {
    "spotify" : "https://open.spotify.com/track/asdgj4qhfasd",
    "apple" : "https://twitter.com/ex"
  },
  "pressArticleLinks" : {
    "medium" : "https://medium.com/ex",
    "metro" : "https://metro.ca/ex"
  },
  "playlistLinks" : {
    "spotify" : "https://open.spotify.com/playlist/37i9dQZEVXbKfIuOAZrk7G",
    "youtube" : "https://www.youtube.com/playlist?list=PLgzTt0k8mXzEk586ze4BjvDXR7c-TUSnx"
  },
  "s3Etag" : "2f03d99fbf37d8d585285fd4cce27feb"
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
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
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Update the UPC of the media with the given ID
 *
 * mediaId Integer The artwork agreement's unique ID
 * upc Upc The UPC of the artwork
 * returns Object
 **/
exports.patchMediaUPC = function(mediaId,upc) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Update the modification date of the given media
 *
 * mediaId Integer The artwork agreement's unique ID
 * modificationDate ModificationDate The date the rights agreement for the given media was modified
 * returns Object
 **/
exports.patchModificationDate = function(mediaId,modificationDate) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Update the publish date of the given media
 *
 * mediaId Integer The artwork agreement's unique ID
 * publishDate PublishDate The date the given media was published
 * returns Object
 **/
exports.patchPublishDate = function(mediaId,publishDate) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
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
    examples['application/json'] = [ {
  "title" : "Love You Baby",
  "artist" : "LYB",
  "genre" : "Rock",
  "secondaryGenre" : "Pop",
  "creationDate" : "2019-01-01T15:53:00",
  "modificationDate" : "2019-01-01T15:53:01",
  "publishDate" : "2019-01-01T15:53:02",
  "cover" : false,
  "isrc" : "abcde1234567",
  "upc" : "123456789111",
  "publisher" : "sync publishing",
  "msDuration" : "288000",
  "lyrics" : "Love you Baby. Love you Baby. Love you Baby. Love you Baby. Love you Baby. Baby. Wooo. Love You Baby.",
  "inLanguages" : [ "english" ],
  "socialMediaLinks" : {
    "facebook" : "https://facebook.com/ex",
    "twitter" : "https://twitter.com/ex",
    "youtube" : "https://youtube.com/ex"
  },
  "streamingServiceLinks" : {
    "spotify" : "https://open.spotify.com/track/asdgj4qhfasd",
    "apple" : "https://twitter.com/ex"
  },
  "pressArticleLinks" : {
    "medium" : "https://medium.com/ex",
    "metro" : "https://metro.ca/ex"
  },
  "playlistLinks" : {
    "spotify" : "https://open.spotify.com/playlist/37i9dQZEVXbKfIuOAZrk7G",
    "youtube" : "https://www.youtube.com/playlist?list=PLgzTt0k8mXzEk586ze4BjvDXR7c-TUSnx"
  },
  "s3Etag" : "2f03d99fbf37d8d585285fd4cce27feb"
} ];
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
    examples['application/json'] = [ {
  "title" : "Love You Baby",
  "artist" : "LYB",
  "genre" : "Rock",
  "secondaryGenre" : "Pop",
  "creationDate" : "2019-01-01T15:53:00",
  "modificationDate" : "2019-01-01T15:53:01",
  "publishDate" : "2019-01-01T15:53:02",
  "cover" : false,
  "isrc" : "abcde1234567",
  "upc" : "123456789111",
  "publisher" : "sync publishing",
  "msDuration" : "288000",
  "lyrics" : "Love you Baby. Love you Baby. Love you Baby. Love you Baby. Love you Baby. Baby. Wooo. Love You Baby.",
  "inLanguages" : [ "english" ],
  "socialMediaLinks" : {
    "facebook" : "https://facebook.com/ex",
    "twitter" : "https://twitter.com/ex",
    "youtube" : "https://youtube.com/ex"
  },
  "streamingServiceLinks" : {
    "spotify" : "https://open.spotify.com/track/asdgj4qhfasd",
    "apple" : "https://twitter.com/ex"
  },
  "pressArticleLinks" : {
    "medium" : "https://medium.com/ex",
    "metro" : "https://metro.ca/ex"
  },
  "playlistLinks" : {
    "spotify" : "https://open.spotify.com/playlist/37i9dQZEVXbKfIuOAZrk7G",
    "youtube" : "https://www.youtube.com/playlist?list=PLgzTt0k8mXzEk586ze4BjvDXR7c-TUSnx"
  },
  "s3Etag" : "2f03d99fbf37d8d585285fd4cce27feb"
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

