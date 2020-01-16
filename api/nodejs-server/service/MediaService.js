'use strict';
const TABLE = 'media';
const utils = require('../utils/utils.js');
const jwt = require('jsonwebtoken');
const axios = require('axios')

const moment = require('moment')
moment.defaultFormat = "DD-MM-YYYY HH:mm"

// AWS
const AWS = require('aws-sdk');
const REGION = 'us-east-2';
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

exports.setMediaProposalInitiator = function(mediaId, rightHolderId) {
  return new Promise(function(resolve, reject) {

    try {
      // Récupérer le média
      let params = {
        TableName: TABLE,
        Key: {
          'mediaId': mediaId
        }
      }
      ddb.get(params, function(err, data) {
        if (err) {
          console.log("Error", err);
          resolve();
        } else {

          try {
            // Assigner l'ayant-droit qui initie le partage
            let params = {
              TableName: TABLE,
              Key: {
                'mediaId': mediaId
              },
              UpdateExpression: 'set initiateurPropositionEnCours = :a',
              ExpressionAttributeValues: {
                ':a' : rightHolderId
              },
              ReturnValues: 'UPDATED_NEW'
            };
            // Call DynamoDB to update the item from the table
            ddb.update(params, function(err, data) {
              if (err) {
                console.log("Error", err);
                resolve();
              } else {
                resolve(data.Attributes);
              }
            });
          } catch (err) {
            console.log(err)
          }

          resolve(data);
        }
      });
    } catch (err) {
      console.log(err)
    }
   
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

function mediasDontEstInitiateurDeProposition(initiatorUuid) {
  return new Promise( (res, rej) => {
    // Récupérer les propositions par l'index initiatorUuid-index
    let params = {
      "TableName": 'proposal',
      "IndexName": "initiatorUuid-index",
      "ConsistentRead": false,
      "KeyConditionExpression": "initiatorUuid = :u",
      "ExpressionAttributeValues": {
          ":u": initiatorUuid
      }
    }
    ddb.query(params, function(err, data) {
      if (err) {
        console.log(err, err.stack)
        rej()
      }
      else {
        let medias = []
        data.Items.forEach(_p=>{
          if(!medias.includes(_p.mediaId)) { medias.push(_p.mediaId) }          
        })        
        // Récupérer chaque média (complet)
        let mediasRetour = []
        if(medias.length > 0) {
          medias.forEach(_m=>{
            let paramsMedia = {
              "TableName": 'media',
              Key: {
                "mediaId": _m
              }
            }
            ddb.get(paramsMedia, (err,data)=>{
              if(err) { console.log(err.stack) }
              else {
                let media = data.Item
                // Récupérer la dernière proposition du média
                propositionsParMedia(media.mediaId)
                .then(__p=>{
                  media.propositions = __p
                  mediasRetour.push(media)
                  // Fin lorsque tous les médias sont chargés
                  if(medias.length === mediasRetour.length) {
                    res(mediasRetour)
                  }
                })
              }
            })
          })
        } else {
          res(mediasRetour)
        }
      }     
    })
  })

}

function propositionsParMedia(mediaId) {
  
  // Récupérer les médias par l'index mediaId-index
  //  * La plus récente est à l'index 0

  return new Promise( (res, rej) => {
    let params = {
      "TableName": 'proposal',
      "IndexName": "mediaId-index",      
      "ConsistentRead": false,
      "KeyConditionExpression": "mediaId = :m",
      "ExpressionAttributeValues": {
          ":m": mediaId
      }
    }
    ddb.query(params, function(err, data) {
      if (err) {
        console.log(err, err.stack)
        rej()
      }
      else {
        data.Items.sort( (a, b)=> b._d - a._d )
        res(data.Items)
      }
    })
  })
}

function mediasParCreateur(rightHolderId) {
  return new Promise((res, rej)=>{
    // Récupérer les médias par l'index creator-index
    let params = {    
      "IndexName": "creator-index",      
      "ExpressionAttributeValues": {
          ":c": rightHolderId
      },
      "KeyConditionExpression": "creator = :c",
      "TableName": TABLE
    }
    ddb.query(params, function(err, data) {      
      if (err) {
        rej()
      }
      else {        
        res(data.Items)
      }     
    })
  })
}

exports.listeCreateur = function(rightHolderId) {
  /**
   * Deux structures à assembler de manière asynchrones et en chaîne.
   *  * Pour chaque média récupéré, on associe la dernière proposition
   * A : Médias créés par l'ayant-droit
   * B : Médias dont l'ayant-droit a initié une proposition
   */
  return new Promise( (res, rej)=>{        

    // (A) 1. Récupérer la liste des médias dont l'ayant-droit est le créateur
    mediasParCreateur(rightHolderId)
    .then(medias=>{

      function b(rightHolderId) {
        // (B) 4. Découvrir les propositions dont l'usager est l'initiateur
        //        et qui ne sont pas des médias créés par l'usager
        mediasDontEstInitiateurDeProposition(rightHolderId)
        .then(_medias=>{
            // (A + B) 5. Construire la structure finale
            //            Ajoute aux médias déjà récupérés si non existant
            _medias.forEach(__m=>{
              if(!medias.find(___m=>___m.mediaId === __m.mediaId)) { medias.push(_m) }
            })
            // (B) 6. Trier la liste de médias restant en ordre d'identifiant séquentiel croissant
            medias.sort( (a, b)=> a.mediaId - b.mediaId )
            res( medias )
          }
        )
      }

      // Si n'a pas de médias, tester si est initiateur de proposition
      if(medias.length === 0) {
        b(rightHolderId)
      } else {
        // (A) 2. Associer la proposition la plus récente pour chaque media
        let cpt = 0 // Compteur pour suivre le nombre 
        medias.forEach( (m, idx) =>{
          // (A) 3. Trouver la proposition la plus récente du média
          propositionsParMedia(m.mediaId)
          .then(p=>{
            medias[idx].propositions = p
            cpt++ 
            // (A -> B) 3.1 Détecte que toutes les réponses sont revenues
            if(cpt == medias.length) {
              b(rightHolderId)
            }
          })
        })
      }        
    })
  })  
}

exports.listeCollaborations = function(rightHolderId) {
  return new Promise(function(resolve, reject) {
    let params = {
      "TableName": TABLE,
    }
    // 1. Récupérer liste des propositions 
    // 2. Extraire des propositions les mediaId uniques qui ont l'ayant-droit dans leurs collaborateurs
    // 3. Pour tous les médias extraits, enlever ceux dont l'ayant-droit est le créateur
    // 4. Trier la liste de médias restant en ordre d'identifiant séquentiel
    // 5. Retourner la liste des médias ainsi épurée, et associer la proposition la plus récente au média
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
exports.getMedia = function getMedia(mediaId) {
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
        let DATE_CREATED = Date.getTime()
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
        let d = Date.getTime()
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
          let _i
          
          if(res.Items.length > 0) {
            _i = res.Items[0]
          }
          
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
          
          try{
            let params2 = {
              TableName: TABLE,
              Key: {
                'mediaId': parseInt(body.mediaId)
              },
              UpdateExpression: 'set creator  = :cr, creationDate = :c, artist = :ar, album = :al, atype = :ty,\
              \ modificationDate = :moD, publishDate = :puD, files = :files, publisher = :pu,\
              \ title = :ti, genre = :ge, secondaryGenre = :ge2, lyrics = :ly, isrc = :isrc, upc = :upc, iswc = :iswc,\
              \ msDuration = :dur, socialMediaLinks = :smL, streamingServiceLinks = :ssL, pressArticleLinks = :paL, playlistLinks = :plL, remixer = :rem,\
              \ rightHolders = :rHs, cover = :cov, jurisdiction = :jur, bpm = :bpm, influence = :inf, studio = :stu, studioAddress = :stuA,\
              \ label = :lbl, labelAddress = :lblA, distributor = :dist, distributorAddress = :distA',
              ExpressionAttributeValues: {
                ':c' : body.creationDate || Date.getTime(),
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

exports.decodeMedia = function(token) {
  return new Promise(function(resolve, reject) {
    utils.getParameter('SECRET_JWS_MEDIA', (secret)=>{
      try {
          let content = jwt.verify(token, secret)
          resolve(content.data)
      } catch(err) {
          console.log(err)
      }
    })
  })
}

exports.shareMedia = function(body) {   

  let mediaId = body.mediaId,
      prenom = body.prenom,
      nom = body.nom,
      courriel = body.courriel,
      acces = body.acces,
      contexte = body.contexte

  return new Promise(function(resolve, reject) {
    // Get the media 
    let params = {
      TableName: TABLE,
      Key: {
        'mediaId': mediaId
      }
    };
    ddb.get(params, function(err, data) {
      if (err) {
        console.log("Error", err)
      }
            
      utils.getParameter('SECRET_JWS_MEDIA', (secret)=>{
  
        try {
          const EXPIRATION = "365 days"
          let jeton = jwt.sign(          
            {
                data: {mediaId: mediaId, acces: acces}
            },
            secret,
            {expiresIn: EXPIRATION}
          )        
          
          let template = ""
          switch(acces) {
            case 1:
              template = "sharePublicAccessLink"
              break;
            case 2:
              template = "sharePrivateAccessLink"
              break;
            case 3:
              template = "shareAdminAccessLink"
              break;
            default:
          }

          let body = [
            {
                "toEmail": courriel,
                "firstName": `${prenom} ${nom}`,
                "workTitle": data.Item.title,
                "template": template,
                "callbackURL": `http://proto.${contexte}/oeuvre/resume/${jeton}`
            }
          ]
        
          axios.post('http://messaging.smartsplit.org:3034/sendEmail', body)
          .catch(err=>{
            console.log(err)
          })
        } catch (err) {
          console.log(err)
        } finally {
          resolve("OK")
        }
               
      })                
    })
  })
}

