'use strict';
const TABLE = 'media';
const utils = require('../utils/utils.js');

// AWS
const AWS = require('aws-sdk');
const REGION = 'us-east-2';

AWS.config.update({
  region: REGION, 
  accessKeyId: utils.getParameter('ACCESS_KEY'),
  secretAccessKey: utils.getParameter('SECRET_ACCESS_KEY')
});

const ddb = new AWS.DynamoDB.DocumentClient({region: REGION});

/**
 * Delete a right holder's profile with the given ID
 *
 * mediaId Integer The rights holder's unique profile ID
 * no response value expected for this operation
 **/
exports.deleteMedia = function(mediaId) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'mediaId': mediaId
      }
    };
    // Call DynamoDB to delete the item from the table
    ddb.delete(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data);
        resolve('Media record removed');
      }
    });
  });
}


/**
 * Get a list of all media
 *
 * returns medias
 **/
// AWS scan
exports.getAllMedia = function() {
  return new Promise(function(resolve, reject) {
    let params = {
      "TableName": TABLE,
    }
    // Call DynamoDB to delete the item from the table
    ddb.scan(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data);
        resolve(data.Items);
      }
    });
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
    let params = {
      TableName: TABLE,
      Key: {
        'mediaId': mediaId
      }
    };
    // Call DynamoDB to delete the item from the table
    ddb.get(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data);
        resolve(data);
      }
    });
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
    let params = {
      TableName: TABLE,
      Key: {
        'mediaId': mediaId
      },
      UpdateExpression: 'set artist = :a',
      ExpressionAttributeValues: {
        ':a' : artist.artist
      },
      ReturnValues: 'UPDATED_NEW'
    };
    // Call DynamoDB to delete the item from the table
    ddb.update(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data.Attributes);
        resolve(data.Attributes);
      }
    });
  });
}


/**
 * Update the duration of the media with the given ID
 *
 * mediaId Integer The artwork agreement's unique ID
 * msDuration msDuration The duration in seconds of the given piece of media
 * returns Object
 **/
exports.patchMediaDuration = function(mediaId,msDuration) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'mediaId': mediaId
      },
      UpdateExpression: 'set msDuration = :d',
      ExpressionAttributeValues: {
        ':d' : msDuration
      },
      ReturnValues: 'UPDATED_NEW'
    };
    // Call DynamoDB to delete the item from the table
    ddb.update(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data.Attributes);
        resolve(data.Attributes);
      }
    });
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
    let params = {
      TableName: TABLE,
      Key: {
        'mediaId': mediaId
      },
      UpdateExpression: 'set genre = :g',
      ExpressionAttributeValues: {
        ':g' : genre.genre
      },
      ReturnValues: 'UPDATED_NEW'
    };
    // Call DynamoDB to delete the item from the table
    ddb.update(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data.Attributes);
        resolve(data.Attributes);
      }
    });
  });
}


/**
 * Update the genre of the media with the given ID
 *
 * mediaId Integer The artwork agreement's unique ID
 * genre Genre The genre of the artwork
 * returns Object
 **/
exports.patchMediaSecondaryGenre = function(mediaId,secondaryGenre) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'mediaId': mediaId
      },
      UpdateExpression: 'set secondaryGenre = :g',
      ExpressionAttributeValues: {
        ':g' : secondaryGenre.secondaryGenre
      },
      ReturnValues: 'UPDATED_NEW'
    };
    // Call DynamoDB to delete the item from the table
    ddb.update(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data.Attributes);
        resolve(data.Attributes);
      }
    });
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
    let params = {
      TableName: TABLE,
      Key: {
        'mediaId': mediaId
      },
      UpdateExpression: 'set jurisdiction = :j',
      ExpressionAttributeValues: {
        ':j' : jurisdiction.jurisdiction
      },
      ReturnValues: 'UPDATED_NEW'
    };
    // Call DynamoDB to delete the item from the table
    ddb.update(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data.Attributes);
        resolve(data.Attributes);
      }
    });
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
    let params = {
      TableName: TABLE,
      Key: {
        'mediaId': mediaId
      },
      UpdateExpression: 'set irsc = :i',
      ExpressionAttributeValues: {
        ':i' : isrc.isrc
      },
      ReturnValues: 'UPDATED_NEW'
    };
    // Call DynamoDB to delete the item from the table
    ddb.update(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data.Attributes);
        resolve(data.Attributes);
      }
    });
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
    let params = {
      TableName: TABLE,
      Key: {
        'mediaId': mediaId
      },
      UpdateExpression: 'set upc = :u',
      ExpressionAttributeValues: {
        ':u' : upc.upc
      },
      ReturnValues: 'UPDATED_NEW'
    };
    // Call DynamoDB to delete the item from the table
    ddb.update(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data.Attributes);
        resolve(data.Attributes);
      }
    });
  });
}


/**
 * Update the modification date of the given media
 *
 * mediaId Integer The artwork agreement's unique ID
 * modificationDate modification date The date the given media was modified
 * returns Object
 **/
exports.patchModificationDate = function(mediaId,modificationDate) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'mediaId': mediaId
      },
      UpdateExpression: 'set modificationDate = :m',
      ExpressionAttributeValues: {
        ':m' : modificationDate.modificationDate
      },
      ReturnValues: 'UPDATED_NEW'
    };
    // Call DynamoDB to delete the item from the table
    ddb.update(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data.Attributes);
        resolve(data.Attributes);
      }
    });
  });
}


/**
 * Update the publish date of the given media
 *
 * mediaId Integer The artwork agreement's unique ID
 * publishDate publish date The date the given media was published
 * returns Object
 **/
exports.patchPublishDate = function(mediaId,publishDate) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'mediaId': mediaId
      },
      UpdateExpression: 'set publishDate = :p',
      ExpressionAttributeValues: {
        ':p' : publishDate.publishDate
      },
      ReturnValues: 'UPDATED_NEW'
    };
    // Call DynamoDB to delete the item from the table
    ddb.update(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data.Attributes);
        resolve(data.Attributes);
      }
    });
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
    let params = {
      TableName: TABLE,
      Key: {
        'mediaId': mediaId
      },
      UpdateExpression: 'set publisher = :p',
      ExpressionAttributeValues: {
        ':p' : publisher.publisher
      },
      ReturnValues: 'UPDATED_NEW'
    };
    // Call DynamoDB to delete the item from the table
    ddb.update(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data.Attributes);
        resolve(data.Attributes);
      }
    });
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
    let params = {
      TableName: TABLE,
      Key: {
        'mediaId': mediaId
      },
      UpdateExpression: 'set title = :t',
      ExpressionAttributeValues: {
        ':t' : title.title
      },
      ReturnValues: 'UPDATED_NEW'
    };
    // Call DynamoDB to delete the item from the table
    ddb.update(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data.Attributes);
        resolve(data.Attributes);
      }
    });
  });
}


/**
 * Update the album of a piece of media
 *
 * mediaId Integer The artwork agreement's unique ID
 * album The album name of the artwork
 * returns Object
 **/
exports.patchMediaAlbum = function(mediaId,album) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'mediaId': mediaId
      },
      UpdateExpression: 'set album  = :a',
      ExpressionAttributeValues: {
        ':a' : album.album
      },
      ReturnValues: 'UPDATED_NEW'
    };
    // Call DynamoDB to delete the item from the table
    ddb.update(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data.Attributes);
        resolve(data.Attributes);
      }
    });
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
    let params = {
      TableName: TABLE,
      Key: {
        'mediaId': mediaId
      },
      UpdateExpression: 'set lyrics  = :l',
      ExpressionAttributeValues: {
        ':l' : lyrics.lyrics
      },
      ReturnValues: 'UPDATED_NEW'
    };
    // Call DynamoDB to delete the item from the table
    ddb.update(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data.Attributes);
        resolve(data.Attributes);
      }
    });
  });
}


/**
 * Update list of languages for the lyrics for the given piece of media
 *
 * mediaId Integer The artwork agreement's unique ID
 * inLanguages inLanguages The object containing the languages for the given media's lyrics
 * returns media
 **/
exports.patchMediaInLanguages = function(mediaId,inLanguages) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'mediaId': mediaId
      },
      UpdateExpression: 'set inLanguages = list_append(if_not_exists(inLanguages, :empty_list), :l)',
      ExpressionAttributeValues: {
        ':l' : inLanguages,
        ':empty_list': []
      },
      ReturnValues: 'UPDATED_NEW'
    };
    // Call DynamoDB to delete the item from the table
    ddb.update(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data.Attributes);
        resolve(data.Attributes);
      }
    });
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
    let params = {
      "TableName": TABLE,
      Key: {
        'mediaId': mediaId
      }
    }
    // Get old streaming service links
    ddb.get(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        let oldPlaylistLinks = data.Item.playlistLinks;
        let playlistLinksJoined = Object.assign({}, oldPlaylistLinks, playlistLinks);
        let params = {
          TableName: TABLE,
          Key: {
            'mediaId': mediaId
          },
          UpdateExpression: 'set playlistLinks  = :p',
          ExpressionAttributeValues: {
            ':p' : playlistLinksJoined
          },
          ReturnValues: 'UPDATED_NEW'
        };
        ddb.update(params, function(err, data) {
          if (err) {
            console.log("Error", err);
            resolve();
          } else {
            console.log("Success", data.Attributes);
            resolve(data.Attributes);
          }
        });
      }
    });
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
    let params = {
      "TableName": TABLE,
      Key: {
        'mediaId': mediaId
      }
    }
    // Get old streaming service links
    ddb.get(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        let oldPressArticleLinks = data.Item.pressArticleLinks;
        let pressArticleLinksJoined = Object.assign({}, oldPressArticleLinks, pressArticleLinks);
        let params = {
          TableName: TABLE,
          Key: {
            'mediaId': mediaId
          },
          UpdateExpression: 'set pressArticleLinks  = :a',
          ExpressionAttributeValues: {
            ':a' : pressArticleLinksJoined
          },
          ReturnValues: 'UPDATED_NEW'
        };
        ddb.update(params, function(err, data) {
          if (err) {
            console.log("Error", err);
            resolve();
          } else {
            console.log("Success", data.Attributes);
            resolve(data.Attributes);
          }
        });
      }
    });
  });
}


/**
 * Update the right holders who collaborated on media
 *
 * mediaId Integer The artwork agreement's unique ID
 * rightHolders RightHolders The object containing the right holders for the given media
 * returns media
 **/
exports.patchMediaRightHolders = function(mediaId,rightHolders) {
  return new Promise(function(resolve, reject) {
    let params = {
      "TableName": TABLE,
      Key: {
        'mediaId': mediaId
      }
    }
    // Get old social media links
    ddb.get(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        let oldrightHolders = data.Item.rightHolders;
        let rightHoldersJoined = Object.assign({}, oldrightHolders, rightHolders);
        let params = {
          TableName: TABLE,
          Key: {
            'mediaId': mediaId
          },
          UpdateExpression: 'set rightHolders  = :r',
          ExpressionAttributeValues: {
            ':r' : rightHoldersJoined
          },
          ReturnValues: 'UPDATED_NEW'
        };
        ddb.update(params, function(err, data) {
          if (err) {
            console.log("Error", err);
            resolve();
          } else {
            console.log("Success", data.Attributes);
            resolve(data.Attributes);
          }
        });
      }
    });
  });
}


/**
 * Update rights holders' percentage split given media
 *
 * mediaId Integer The artwork agreement's unique ID
 * rightsSplit RightsSplit The object containing the percentage split for the given media
 * returns media
 **/
exports.patchMediaRightsSplit = function(mediaId,rightsSplit) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'mediaId': mediaId
      },
      UpdateExpression: 'set rightsSplit  = :s',
      ExpressionAttributeValues: {
        ':s' : rightsSplit.rightsSplit
      },
      ReturnValues: 'UPDATED_NEW'
    };
    // Call DynamoDB to delete the item from the table
    ddb.update(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data.Attributes);
        resolve(data.Attributes);
      }
    });
  });
}


/**
 * Update the type of rights of the given media         (Including copyright, performance, recording)
 *
 * mediaId Integer The artwork agreement's unique ID
 * rightsType RightsType The object containing the type of rights for the given media
 * returns media
 **/
exports.patchMediaRightsType = function(mediaId,rightsType) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'mediaId': mediaId
      },
      UpdateExpression: 'set rightsType  = :t',
      ExpressionAttributeValues: {
        ':t' : rightsType.rightsType
      },
      ReturnValues: 'UPDATED_NEW'
    };
    // Call DynamoDB to delete the item from the table
    ddb.update(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data.Attributes);
        resolve(data.Attributes);
      }
    });
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
    let params = {
      "TableName": TABLE,
      Key: {
        'mediaId': mediaId
      }
    }
    // Get old social media links
    ddb.get(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        let oldSocialMediaLinks = data.Item.socialMediaLinks;
        let socialMediaLinksJoined = Object.assign({}, oldSocialMediaLinks, socialMediaLinks);
        let params = {
          TableName: TABLE,
          Key: {
            'mediaId': mediaId
          },
          UpdateExpression: 'set socialMediaLinks  = :m',
          ExpressionAttributeValues: {
            ':m' : socialMediaLinksJoined
          },
          ReturnValues: 'UPDATED_NEW'
        };
        ddb.update(params, function(err, data) {
          if (err) {
            console.log("Error", err);
            resolve();
          } else {
            console.log("Success", data.Attributes);
            resolve(data.Attributes);
          }
        });
      }
    });
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
    let params = {
      "TableName": TABLE,
      Key: {
        'mediaId': mediaId
      }
    }
    // Get old streaming service links
    ddb.get(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        let oldStreamingServiceLinks = data.Item.streamingServiceLinks;
        let streamingServiceLinksJoined = Object.assign({}, oldStreamingServiceLinks, streamingServiceLinks);
        let params = {
          TableName: TABLE,
          Key: {
            'mediaId': mediaId
          },
          UpdateExpression: 'set streamingServiceLinks  = :s',
          ExpressionAttributeValues: {
            ':s' : streamingServiceLinksJoined
          },
          ReturnValues: 'UPDATED_NEW'
        };
        ddb.update(params, function(err, data) {
          if (err) {
            console.log("Error", err);
            resolve();
          } else {
            console.log("Success", data.Attributes);
            resolve(data.Attributes);
          }
        });
      }
    });
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
    let params = {
      "TableName": TABLE,
    }
    ddb.scan(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        // Create unique ID value
        let ID_VALUE = data.Count + 1;
        // Assign creationDate to current date time
        let d = Date(Date.now());   
        let DATE_CREATED = d.toString();
        console.log(DATE_CREATED);
        let params = {
          TableName: TABLE,
          Item: {
            'mediaId': ID_VALUE,
            'rightsSplit': body[0].rightsSplit,
            'jurisdiction': body[0].jurisdiction,
            'artist': body[0].artist,
            'album': body[0].album,
            'cover': body[0].cover,
            'creationDate': DATE_CREATED,
            'modificationDate': body[0].modificationDate,
            'publishDate': body[0].publishDate,
            'publisher': body[0].publisher,
            'rightsType': body[0].rightsType,
            'title': body[0].title,
            'rightHolders': body[0].rightHolders,
            'genre': body[0].genre,
            'secondaryGenre': body[0].secondaryGenre,
            'lyrics': body[0].lyrics,
            'inLanguages': body[0].inLanguages,
            'isrc': body[0].isrc,
            'upc': body[0].upc,
            'duration': body[0].duration,       
            'socialMediaLinks': body[0].socialMediaLinks,
            'streamingServiceLinks': body[0].streamingServiceLinks,
            'pressArticleLinks': body[0].pressArticleLinks,
            'playlistLinks': body[0].playlistLinks
          },
          ReturnValues: 'ALL_OLD'
        };
        // Check Types, and Split Calculation
        // 
        ddb.put(params, function(err, data) {
          if (err) {
            console.log("Error", err);
            resolve();
          } else {
            resolve("Success. Item Added");
          }
        });
      }

    });
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
    // Assign modificationDate to current date time
    let d = Date(Date.now());   
    let DATE_MODIFIED = d.toString();
    let params = {
      TableName: TABLE,
      Key: {
        'mediaId': mediaId
      },
      UpdateExpression: 'set title  = :t, rightsSplit = :s, jurisdiction = :j, genre = :g, secondaryGenre = :y, album = :a, \
        \ artist = :y, creationDate = :c, modificationDate = :f, publishDate = :i, cover = :v, publisher = :p, rightsType = :r, rightHolders = :h \
        \ lyrics = :l, inLanguages = :u, isrc = :z, upc = :b, duration = :d, socialMediaLinks = :e, streamingServiceLinks = :k, pressArticleLinks = :x, playlistLinks = :q', 

      ExpressionAttributeValues: {
        ':t' : body[0].title,
        ':s' : body[0].rightsSplit,
        ':j' : body[0].jurisdiction,
        ':g' : body[0].genre,
        ':y' : body[0].secondaryGenre,
        ':a' : body[0].album,
        ':y' : body[0].artist,
        ':c' : body[0].creationDate,
        ':f' : DATE_MODIFIED,
        ':i' : body[0].publishDate,
        ':v' : body[0].cover,
        ':p' : body[0].publisher,
        ':r' : body[0].rightsType,
        ':h' : body[0].rightHolders,
        ':l' : body[0].lyrics,
        ':u' : body[0].inLanguages,
        ':z' : body[0].isrc,
        ':b' : body[0].upc,
        ':d' : body[0].duration,       
        ':e' : body[0].socialMediaLinks,
        ':k' : body[0].streamingServiceLinks,
        ':x' : body[0].pressArticleLinks,
        ':q' : body[0].playlistLinks
      },
      ReturnValues: 'UPDATED_NEW'
    };
    // Call DynamoDB to delete the item from the table
    ddb.update(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data.Attributes);
        resolve(data.Attributes);
      }
    });
  });
}

