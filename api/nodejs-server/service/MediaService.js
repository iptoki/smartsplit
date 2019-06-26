'use strict';
const TABLE = 'media';
const utils = require('../utils/utils.js');
const uuidv1 = require('uuid/v1');

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
 * Get split for media with the given ID
 *
 * mediaId Integer The artwork agreement's unique ID
 * returns media
 **/
exports.getMediaSplit = function(mediaId) {
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
        // console.log("Success, MEDIA: ", data);
        let ALL_DATA = {}
        // let MEDIA_DATA = data;
        let MEDIA_ID = data.Item.mediaId;
        let MEDIA_TITLE = data.Item.title;
        Object.assign(ALL_DATA, {media: {id: MEDIA_ID, title: MEDIA_TITLE}});
        // console.log("MEDIA ID IS: ", MEDIA_DATA.Item.mediaId)
        // console.log("TITLE IS: ", MEDIA_DATA.Item.title)
        console.log("ALL DATA OBJECT: ", ALL_DATA);
        let splitParams = {
            TableName: "splits",
            FilterExpression: "mediaId = :mediaId",
            ExpressionAttributeValues: {
                ":mediaId": MEDIA_ID
            }
        }
        ddb.scan(splitParams, function(err, data) {
          if (err) {
            console.log("Error", err);
            resolve();
          } else {
            let SPLIT_DATA = data;
            // let SPLIT_TYPE = data.Items[0].splitType;
            // console.log("SPLIT TYPE IS: ", data.Items[0].splitType)
            // console.log("SPLIT UUID IS: ", data.Items[0].uuid)
            // Object.assign(ALL_DATA, {SPLIT_TYPE: data.Items[0]});
            // ALL_DATA = {...ALL_DATA, ...{split1: data.Items[0]}, ...{split2: data.Items[1]}, ...{split3: data.Items[2]} }
            // resolve(data)
            let rightsSplitParams = {
              TableName: "rightsSplit",
              FilterExpression: "splitUuid = :splitUuid",
              ExpressionAttributeValues: {
                ":splitUuid": SPLIT_DATA.Items[0].uuid
              }
            }
            ddb.scan(rightsSplitParams, function(err, data) {
              if (err) {
                console.log("Error", err);
                resolve();
              } else {
                const RIGHTS_SPLIT_DATA = data;
                // resolve(data);
                let MINI_DATA_1 = {...SPLIT_DATA.Items[0], ...{rightsSplit: RIGHTS_SPLIT_DATA.Items}};
                // ALL_DATA = {...ALL_DATA, ...{split1: MINI_DATA_1}, ...{split2: MINI_DATA_1}, ...{split3: MINI_DATA_1}}
                ALL_DATA = {...ALL_DATA, ...{split1: MINI_DATA_1}}
                // ALL_DATA = {...ALL_DATA, ...{rightsSplit: data.Items}}
                console.log("RIGHT HOLDER ID IS: ", data.Count === 1 ? data.Items.rightHolderId : data.Items[0].rightHolderId)
                let rightHolderParams = {
                  TableName: "rightHolder",
                  FilterExpression: "rightHolderId = :rightHolderId",
                  ExpressionAttributeValues: {
                    ":rightHolderId": data.Items[0].rightHolderId
                  }
                }
                ddb.scan(rightHolderParams, function(err, data) {
                  if (err) {
                    console.log("Error", err);
                    resolve();
                  } else {
                    let RIGHT_HOLDER_DATA = data;
                    let RIGHT_HOLDER_NAME = RIGHT_HOLDER_DATA.Items[0].firstName + " " + RIGHT_HOLDER_DATA.Items[0].lastName;
                    let RIGHT_HOLDER_D1 = {...{id: RIGHT_HOLDER_DATA.Items[0].rightHolderId}, ...{email: RIGHT_HOLDER_DATA.Items[0].email}, ...{name: RIGHT_HOLDER_NAME}}
                    ALL_DATA.split1.rightsSplit[0].rightHolder = RIGHT_HOLDER_D1
                  }
                });
                let rightHolderParams2 = {
                  TableName: "rightHolder",
                  FilterExpression: "rightHolderId = :rightHolderId",
                  ExpressionAttributeValues: {
                    ":rightHolderId": data.Items[1].rightHolderId
                  }
                }
                ddb.scan(rightHolderParams2, function(err, data) {
                  if (err) {
                    console.log("Error", err);
                    resolve();
                  } else {
                    let RIGHT_HOLDER_DATA = data;
                    let RIGHT_HOLDER_NAME_2 = RIGHT_HOLDER_DATA.Items[0].firstName + " " + RIGHT_HOLDER_DATA.Items[0].lastName;
                    let RIGHT_HOLDER_D2 = {...{id: RIGHT_HOLDER_DATA.Items[0].rightHolderId}, ...{email: RIGHT_HOLDER_DATA.Items[0].email}, ...{name: RIGHT_HOLDER_NAME_2}}
                    ALL_DATA.split1.rightsSplit[1].rightHolder = RIGHT_HOLDER_D2
                    ALL_DATA = {...ALL_DATA, ...{initiator: {id: RIGHT_HOLDER_DATA.Items[0].rightHolderId, name: RIGHT_HOLDER_NAME_2}}}
                    resolve(ALL_DATA);
                    console.log("ALL_DATA object is: ", ALL_DATA)
                  }
                });
              }
            });
          }
        });
        // resolve(data);
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
 * Update the AWS s3 Etag for given media
 *
 * mediaId Integer The artwork agreement's unique ID
 * s3Etag S3Etag The AWS s3 Etag string for the given media
 * returns media
 **/
exports.patchMediaS3Etag = function(mediaId,s3Etag) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'mediaId': mediaId
      },
      UpdateExpression: 'set s3Etag  = :s',
      ExpressionAttributeValues: {
        ':s' : s3Etag.s3Etag
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
        let params = {
          TableName: TABLE,
          Item: {
            'mediaId': ID_VALUE,
            'artist': body[0].artist,
            'album': body[0].album,
            'cover': body[0].cover,
            'creationDate': DATE_CREATED,
            'modificationDate': body[0].modificationDate,
            's3Etag': body[0].s3Etag,
            'publishDate': body[0].publishDate,
            'publisher': body[0].publisher,
            'title': body[0].title,
            'genre': body[0].genre,
            'secondaryGenre': body[0].secondaryGenre,
            'lyrics': body[0].lyrics,
            'inLanguages': body[0].inLanguages,
            'isrc': body[0].isrc,
            'upc': body[0].upc,
            'msDuration': body[0].msDuration,       
            'socialMediaLinks': body[0].socialMediaLinks,
            'streamingServiceLinks': body[0].streamingServiceLinks,
            'pressArticleLinks': body[0].pressArticleLinks,
            'playlistLinks': body[0].playlistLinks
          }
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
      UpdateExpression: 'set title  = :t, genre = :g, secondaryGenre = :y, album = :a, s3Etag = :s\
        \ artist = :y, creationDate = :c, modificationDate = :f, publishDate = :i, cover = :v, publisher = :p, \
        \ lyrics = :l, inLanguages = :u, isrc = :z, upc = :b, msDuration = :d, socialMediaLinks = :e, streamingServiceLinks = :k, pressArticleLinks = :x, playlistLinks = :q', 

      ExpressionAttributeValues: {
        ':t' : body[0].title,
        ':g' : body[0].genre,
        ':y' : body[0].secondaryGenre,
        ':a' : body[0].album,
        ':y' : body[0].artist,
        ':c' : body[0].creationDate,
        ':f' : DATE_MODIFIED,
        ':i' : body[0].publishDate,
        ':v' : body[0].cover,
        ':p' : body[0].publisher,
        ':l' : body[0].lyrics,
        ':u' : body[0].inLanguages,
        ':s' : body[0].s3Etag,
        ':z' : body[0].isrc,
        ':b' : body[0].upc,
        ':d' : body[0].msDuration,       
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

