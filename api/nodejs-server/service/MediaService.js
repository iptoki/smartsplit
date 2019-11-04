'use strict';
const TABLE = 'media';
const utils = require('../utils/utils.js');
const uuidv1 = require('uuid/v1');

const moment = require('moment')

// AWS
const AWS = require('aws-sdk');
const REGION = 'us-east-1';
const REGION_PARAMS = 'us-east-2';

AWS.config.update({
  region: REGION_PARAMS, 
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
exports.patchMediaFiles = function(mediaId,files) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'mediaId': mediaId
      },
      UpdateExpression: 'set files  = :s',
      ExpressionAttributeValues: {
        ':s' : files.files 
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

    // Create unique ID value
    let ID_VALUE = body.mediaId
    
    if(!ID_VALUE) {
      reject(".")
    } else {
      // Assign creationDate to current date time      

      try {
        let d = moment(Date.now()).format();   
        let DATE_MODIFIED = d;

        // Récupère le média actuel
        let params = {
          TableName: TABLE,
          KeyConditionExpression: "#mediaId = :mediaId",
          ExpressionAttributeNames:{
              "#mediaId": "mediaId"
          },
          ExpressionAttributeValues: {
              ":mediaId": parseInt(body.mediaId)
          }          
        }

        ddb.query(params, (err, res)=>{
          if(err)
            console.log(err)
          
          let _media
          let _i = res.Items[0]
          
          if(_i){
            _media = _i
            if(_media.lyrics) {
              if(_media.lyrics.text === "") {
                _media.lyrics.text = " "
              }
            }
          }
          if(body.lyrics) {
            if(body.lyrics.text === "") {
              body.lyrics.text = " "
            }
          }

          let params2 = {
            TableName: TABLE,
            Key: {
              'mediaId': parseInt(body.mediaId)
            },
            UpdateExpression: 'set creator  = :cr, artist = :ar, album = :al, atype = :ty,\
            \ modificationDate = :moD, publishDate = :puD, files = :files, publisher = :pu,\
            \ title = :ti, genre = :ge, secondaryGenre = :ge2, lyrics = :ly, isrc = :isrc, upc = :upc, iswc = :iswc,\
            \ msDuration = :dur, socialMediaLinks = :smL, streamingServiceLinks = :ssL, pressArticleLinks = :paL, playlistLinks = :plL, remixer = :rem,\
            \ rightHolders = :rHs, cover = :cov, jurisdiction = :jur, bpm = :bpm, influence = :inf, studio = :stu, studioAddress = :stuA,\
            \ label = :lbl, labelAddress = :lblA, distributor = :dist, distributorAddress = :distA',
            ExpressionAttributeValues: {
              ':cr' : body.creator ? body.creator : (_media.creator ? _media.creator : " "),
              ':ar' : body.artist ? body.artist : (_media.artist ? _media.artist : " "),
              ':al' : body.album ? body.album : (_media.album ? _media.album : " "),
              ':ty' : body.type ? body.type: (_media.type ? _media.type : " "),
              ':moD' : DATE_MODIFIED,
              ':puD' : body.publishDate ? body.publishDate : (_media.publishDate? _media.publishDate: " "),
              ':files' : body.files ? body.files : (_media.files ? _media.files : {}),
              ':pu' : body.publisher ? body.publisher : (_media.publisher ? _media.publisher : " "),
              ':ti' : body.title ? body.title : (_media.title ? _media.title : " "),
              ':ge' : body.genre ? body.genre : (_media.genre ? _media.genre : " "),
              ':ge2' : body.secondaryGenres ? body.secondaryGenres : (_media.secondaryGenres ? _media.secondaryGenres : [] ),
              ':ly' : body.lyrics ? body.lyrics : (_media.lyrics ? _media.lyrics : {text: " ", languages: [], access: "private"}),
              ':isrc' : body.isrc ? body.isrc : (_media.isrc ? _media.isrc : " "),
              ':iswc' : body.iswc ? body.iswc : (_media.iswc ? _media.iswc : " "),
              ':upc' : body.upc ? body.upc : (_media.upc ? _media.upc : " "),
              ':dur' : body.msDuration ? body.msDuration : " " ,
              ':smL' : body.socialMediaLinks ? body.socialMediaLinks : (_media.socialMediaLinks ? _media.socialMediaLinks : []),
              ':ssL' : body.streamingServiceLinks ? body.streamingServiceLinks : (_media.streamingServiceLinks ? _media.streamingServiceLinks : []),
              ':paL' : body.pressArticleLinks ? body.pressArticleLinks : (_media.pressArticleLinks ? _media.pressArticleLinks : []),
              ':plL' : body.playlistLinks ? body.playlistLinks : (_media.playlistLinks ? _media.playlistLinks : []),
              ':rem' : body.remixer ? body.remixer : (_media.remixer ? _media.remixer : " "),
              ':rHs' : body.rightHolders ? body.rightHolders : (_media.rightHolders ? _media.rightHolders : []),
              ':cov' : body.cover ? body.cover : (_media.cover ? _media.cover : "false"),
              ':jur' : body.jurisdiction ? body.jurisdiction : (_media.jurisdiction ? _media.jurisdiction : " "),
              ':bpm' : body.bpm ? body.bpm : (_media.bpm ? _media.bpm : " "),
              ':inf' : body.influence ? body.influence : (_media.influence ? _media.influence : " "),
              ':stu' : body.studio ? body.studio : (_media.studio ? _media.studio : " "),
              ':stuA' : body.studioAddress ? body.studioAddress : (_media.studioAddress ? _media.studioAddress : " "),
              ':lbl' : body.label ? body.label : (_media.label ? _media.label : " "),
              ':lblA' : body.labelA ? body.labelA : (_media.labelA ? _media.labelA : " "),
              ':dist' : body.distributor ? body.distributor : (_media.distributor ? _media.distributor : " "),
              ':distA' : body.distributorAddress ? body.distributorAddress : (_media.distributorAddress ? _media.distributorAddress : " "),
            },
            ReturnValues: 'UPDATED_NEW'
          };          
          try{
            ddb.update(params2, function(err, data) {
              if (err) {
                console.log("Error", err);
                reject();
              } else {
                resolve(data);
              }
            });
          } catch (err) {
            console.log(err)
          }

        })
      } catch (err) {
        console.log(err)
      }
      
      
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
      UpdateExpression: 'set title  = :t, genre = :g, album = :a, files = :s\
        \ artist = :y, creationDate = :c, modificationDate = :f, publishDate = :i, type = :v, publisher = :p, \
        \ lyrics = :l, isrc = :z, upc = :b, msDuration = :d, socialMediaLinks = :e, streamingServiceLinks = :k, pressArticleLinks = :x, playlistLinks = :q', 

      ExpressionAttributeValues: {
        ':t' : body.title,
        ':g' : body.genre,
        ':a' : body.album,
        ':y' : body.artist,
        ':c' : body.creationDate,
        ':f' : DATE_MODIFIED,
        ':i' : body.publishDate,
        ':v' : body.type,
        ':p' : body.publisher,
        ':l' : body.lyrics,
        ':s' : body.files,
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

