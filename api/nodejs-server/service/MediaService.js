'use strict';
const TABLE = 'media';
const utils = require('../utils/utils.js');
const uuidv1 = require('uuid/v1');

const moment = require('moment')

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
    ddb.get(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
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
        
        resolve(data.Attributes);
      }
    });
  });
}


/**
 * Update the AWS audio file for given media
 *
 * mediaId Integer The artwork agreement's unique ID
 * audioFile  The AWS s3 filename string for the given media
 * returns media
 **/
exports.patchMediaAudioFile = function(mediaId,audioFile) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'mediaId': mediaId
      },
      UpdateExpression: 'set audioFile  = :s',
      ExpressionAttributeValues: {
        ':s' : audioFile.audioFile
      },
      ReturnValues: 'UPDATED_NEW'
    };
    ddb.update(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        
        resolve(data.Attributes);
      }
    });
  });
}


/**
 * Update the AWS audio file for given media
 *
 * mediaId Integer The artwork agreement's unique ID
 * audioFile  The AWS s3 filename string for the given media
 * returns media
 **/
exports.patchMediaImageFile = function(mediaId,imageFile) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'mediaId': mediaId
      },
      UpdateExpression: 'set imageFile  = :s',
      ExpressionAttributeValues: {
        ':s' : imageFile.imageFile
      },
      ReturnValues: 'UPDATED_NEW'
    };
    ddb.update(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        
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
    ddb.update(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        
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
            
            resolve(data.Attributes);
          }
        });
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
            
            resolve(data.Attributes);
          }
        });
      }
    });
  });
}

exports.putMedia = function(title, type, creator) {
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
        let ID_VALUE = 0

        // Récupère le dernier identifiant
        data.Items.forEach(elem=>{
          if(ID_VALUE < elem.mediaId) {
            ID_VALUE = elem.mediaId
          }
        })
        ID_VALUE += 1 // Ajout 1

        // Assign creationDate to current date time
        let d = Date(Date.now());   
        let DATE_CREATED = d.toString();
        let params = {
          TableName: TABLE,
          Item: {
            'mediaId': ID_VALUE,            
            'title': title,
            'type': type,
            'creationDate': DATE_CREATED,
            'creator': creator
          }
        };

        ddb.put(params, function(err, data) {
          if (err) {
            console.log("Error", err);
            resolve();
          } else {            
            resolve({id: ID_VALUE});
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

    console.log(body)

    // Create unique ID value
    let ID_VALUE = body.mediaId
    
    if(!ID_VALUE) {
      reject(".")
    } else {
      // Assign creationDate to current date time      
/* 
      let obj = {
        'mediaId': ID_VALUE,
        'creator': body.creator,
        'artist': body.artist,
        'album': body.album,
        'type': body.type,
        'creationDate': DATE_CREATED,
        'modificationDate': body.modificationDate,
        'audioFile': body.audioFile,
        'imageFile': body.imageFile,
        'publishDate': body.publishDate,
        'publisher': body.publisher,
        'title': body.title,
        'genre': body.genre,
        'secondaryGenre': body.secondaryGenre,
        'lyrics': body.lyrics,
        'inLanguages': body.inLanguages,
        'isrc': body.isrc,
        'iswc': body.iswc,
        'upc': body.upc,
        'msDuration': body.msDuration,       
        'socialMediaLinks': body.socialMediaLinks,
        'streamingServiceLinks': body.streamingServiceLinks,
        'pressArticleLinks': body.pressArticleLinks,
        'playlistLinks': body.playlistLinks,
        'rightHolders': body.rightHolders
      }
 */
      let d = moment(Date.now()).format();   
      let DATE_CREATED = d;

      let params = {
        TableName: TABLE,
        Key: {
          'mediaId': body.mediaId
        },
        UpdateExpression: 'set creator  = :cr, artist = :ar, album = :al, atype = :ty, \
        \ creationDate = :crD, modificationDate = :moD, publishDate = :puD, audioFile = :auF, imageFile = :imF, publisher = :pu, \
        \ title = :ti, genre = :ge, secondaryGenre = :ge2, lyrics = :ly, inLanguages = :inL, isrc = :isrc, upc = :upc, iswc = :iswc, \
        \ msDuration = :dur, socialMediaLinks = :smL, streamingServiceLinks = :ssL, pressArticleLinks = :paL, playlistLinks = :plL, remixer = :rem',
        ExpressionAttributeValues: {
          ':cr' : body.creator,
          ':ar' : body.artist,
          ':al' : body.album ? body.album : " ",
          ':ty' : body.type,
          ':crD' : DATE_CREATED,
          ':moD' : body.modificationDate ? body.modificationDate : " ",
          ':puD' : body.publishDate ? body.publishDate : " ",
          ':auF' : body.audioFile ? body.audioFile : " ",
          ':imF' : body.imageFile ? body.imageFile : " ",
          ':pu' : body.publisher ? body.publisher : " ",
          ':ti' : body.title ? body.title : " ",
          ':ge' : body.genre ? body.genre : " ",
          ':ge2' : body.secondaryGenre ? body.secondaryGenre : " ",
          ':ly' : body.lyrics ? body.lyrics : " ",
          ':inL' : body.inLanguages ? body.inLanguages : [],
          ':isrc' : body.isrc ? body.isrc : " ",       
          ':iswc' : body.iswc ? body.iswc : " ",
          ':upc' : body.upc ? body.upc : " ",
          ':dur' : body.msDuration ? body.msDuration : " " ,
          ':smL' : body.socialMediaLinks ? body.socialMediaLinks : [],
          ':ssL' : body.streamingServiceLinks ? body.streamingServiceLinks : [],
          ':paL' : body.pressArticleLinks ? body.pressArticleLinks : [],
          ':plL' : body.playlistLinks ? body.playlistLinks : [],
          ':rem' : body.remixer ? body.remixer : " "
        },
        ReturnValues: 'UPDATED_NEW'
      };
      // Check Types, and Split Calculation
      // 
      ddb.update(params, function(err, data) {
        if (err) {
          console.log("Error", err);
          reject();
        } else {
          resolve(data);
        }
      });
    }
  })
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
      UpdateExpression: 'set title  = :t, genre = :g, secondaryGenre = :y, album = :a, s3Etag = :s\
        \ artist = :y, creationDate = :c, modificationDate = :f, publishDate = :i, type = :v, publisher = :p, \
        \ lyrics = :l, inLanguages = :u, isrc = :z, upc = :b, msDuration = :d, socialMediaLinks = :e, streamingServiceLinks = :k, pressArticleLinks = :x, playlistLinks = :q', 

      ExpressionAttributeValues: {
        ':t' : body.title,
        ':g' : body.genre,
        ':y' : body.secondaryGenre,
        ':a' : body.album,
        ':y' : body.artist,
        ':c' : body.creationDate,
        ':f' : DATE_MODIFIED,
        ':i' : body.publishDate,
        ':v' : body.type,
        ':p' : body.publisher,
        ':l' : body.lyrics,
        ':u' : body.inLanguages,
        ':s' : body.s3Etag,
        ':z' : body.isrc,
        ':b' : body.upc,
        ':d' : body.msDuration,       
        ':e' : body.socialMediaLinks,
        ':k' : body.streamingServiceLinks,
        ':x' : body.pressArticleLinks,
        ':q' : body.playlistLinks
      },
      ReturnValues: 'UPDATED_NEW'
    };
    // Call DynamoDB to delete the item from the table
    ddb.update(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        
        resolve(data.Attributes);
      }
    });
  });
}

