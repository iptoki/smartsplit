'use strict';


/**
 * Delete a right split proposal with the given ID
 *
 * uuid String The splits proposal's unique profile ID
 * no response value expected for this operation
 **/
exports.deleteProposal = function(uuid) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Get a list of all media split proposals
 *
 * returns listProposals
 **/
exports.getAllProposals = function() {
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
 * Get a split proposal with the given ID
 *
 * uuid String The split proposal's unique ID
 * returns proposal
 **/
exports.getProposal = function(uuid) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "uuid" : "45745c60-7b1a-11e8-9c9c-2d42b21b1a3e",
  "mediaId" : 1,
  "initiator" : {
    "id" : 1,
    "name" : "Jim Smith"
  },
  "rightsSplits" : {
    "workCopyrightSplit" : {
      "music" : [ {
        "contributorRole" : {
          "12345c60-7b1a-11e8-9c9c-2d42b21b1a3e" : "songwriter",
          "45745c60-7b1a-11e8-9c9c-2d42b21b1a3i" : "composer"
        },
        "rightHolder" : {
          "id" : "1",
          "name" : "Joe Smith"
        },
        "splitPct" : 50,
        "voteStatus" : "active",
        "_t" : "2019-07-08T16:45:51Z"
      }, {
        "contributorRole" : {
          "12345c60-7b1a-11e8-9c9c-2d42b21b1a3f" : "songwriter",
          "45745c60-7b1a-11e8-9c9c-2d42b21b1a3i" : "composer"
        },
        "rightHolder" : {
          "id" : "2",
          "name" : "Bob Andrews"
        },
        "splitPct" : 25,
        "voteStatus" : "active",
        "_t" : "2019-07-08T16:46:51Z"
      } ],
      "lyrics" : [ {
        "contributorRole" : {
          "12345c60-7b1a-11e8-9c9c-2d42b21b1a4g" : "arranger"
        },
        "id" : 3,
        "rightHolder" : {
          "uuid" : "3",
          "name" : "Joe Duchane"
        },
        "splitPct" : 25,
        "voteStatus" : "active",
        "_t" : "2019-07-08T16:47:51Z"
      } ]
    },
    "performanceNeighboringRightSplit" : {
      "principal" : [ {
        "contributorRole" : {
          "12345c60-7b1a-11e8-9c9c-2d42b21b1a3e" : "guitarist",
          "45745c60-7b1a-11e8-9c9c-2d42b21b1a3i" : "writer"
        },
        "id" : 4,
        "rightHolder" : {
          "uuid" : "1",
          "name" : "Joe Smith"
        },
        "splitPct" : 80,
        "voteStatus" : "active",
        "_t" : "2019-07-08T16:40:51Z"
      } ],
      "accompaniment" : [ {
        "contributorRole" : {
          "12345c60-7b1a-11e8-9c9c-2d42b21b1a3f" : "flutist",
          "45745c60-7b1a-11e8-9c9c-2d42b21b1a3i" : "writer"
        },
        "id" : 5,
        "rightHolder" : {
          "uuid" : "2",
          "name" : "Bob Andrews"
        },
        "splitPct" : 20,
        "voteStatus" : "active",
        "_t" : "2019-07-08T16:39:51Z"
      } ]
    },
    "masterNeighboringRightSplit" : [ {
      "contributorRole" : {
        "12345c60-7b1a-11e8-9c9c-2d42b21b1a3e" : "guitarist",
        "45745c60-7b1a-11e8-9c9c-2d42b21b1a3i" : "writer"
      },
      "rightHolder" : {
        "id" : "1",
        "name" : "Joe Smith"
      },
      "splitPct" : 50,
      "voteStatus" : "active",
      "_t" : "2019-07-08T16:45:51Z"
    }, {
      "contributorRole" : {
        "12345c60-7b1a-11e8-9c9c-2d42b21b1a3f" : "flutist",
        "45745c60-7b1a-11e8-9c9c-2d42b21b1a3i" : "writer"
      },
      "rightHolder" : {
        "id" : "2",
        "name" : "Bob Andrews"
      },
      "splitPct" : 25,
      "voteStatus" : "active",
      "_t" : "2019-07-08T16:46:51Z"
    }, {
      "contributorRole" : {
        "12345c60-7b1a-11e8-9c9c-2d42b21b1a4g" : "composer"
      },
      "id" : 3,
      "rightHolder" : {
        "uuid" : "3",
        "name" : "Joe Duchane"
      },
      "splitPct" : 25,
      "voteStatus" : "active",
      "_t" : "2019-07-08T16:47:51Z"
    } ]
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
 * Update initiator for a given split proposal
 *
 * uuid String The split's unique ID
 * initiator Initiator The initiator of the given split proposal
 * returns Object
 **/
exports.patchProposalInitiator = function(uuid,initiator) {
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
 * Update mediaId for given split proposal
 *
 * uuid String The split proposal's unique ID
 * mediaId MediaId The split proposal's media Id
 * returns Object
 **/
exports.patchProposalMediaId = function(uuid,mediaId) {
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
 * Update rights split object for given split proposal
 *
 * uuid String The split proposal's unique ID
 * rightsSplits RightsSplits The split proposal's rights splits object
 * returns proposal/properties/rightsSplits
 **/
exports.patchProposalRightsSplits = function(uuid,rightsSplits) {
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
 * This method creates a new split proposal for a given media
 *
 * body Proposal request
 * returns proposal
 **/
exports.postProposal = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "uuid" : "45745c60-7b1a-11e8-9c9c-2d42b21b1a3e",
  "mediaId" : 1,
  "initiator" : {
    "id" : 1,
    "name" : "Jim Smith"
  },
  "rightsSplits" : {
    "workCopyrightSplit" : {
      "music" : [ {
        "contributorRole" : {
          "12345c60-7b1a-11e8-9c9c-2d42b21b1a3e" : "songwriter",
          "45745c60-7b1a-11e8-9c9c-2d42b21b1a3i" : "composer"
        },
        "rightHolder" : {
          "id" : "1",
          "name" : "Joe Smith"
        },
        "splitPct" : 50,
        "voteStatus" : "active",
        "_t" : "2019-07-08T16:45:51Z"
      }, {
        "contributorRole" : {
          "12345c60-7b1a-11e8-9c9c-2d42b21b1a3f" : "songwriter",
          "45745c60-7b1a-11e8-9c9c-2d42b21b1a3i" : "composer"
        },
        "rightHolder" : {
          "id" : "2",
          "name" : "Bob Andrews"
        },
        "splitPct" : 25,
        "voteStatus" : "active",
        "_t" : "2019-07-08T16:46:51Z"
      } ],
      "lyrics" : [ {
        "contributorRole" : {
          "12345c60-7b1a-11e8-9c9c-2d42b21b1a4g" : "arranger"
        },
        "id" : 3,
        "rightHolder" : {
          "uuid" : "3",
          "name" : "Joe Duchane"
        },
        "splitPct" : 25,
        "voteStatus" : "active",
        "_t" : "2019-07-08T16:47:51Z"
      } ]
    },
    "performanceNeighboringRightSplit" : {
      "principal" : [ {
        "contributorRole" : {
          "12345c60-7b1a-11e8-9c9c-2d42b21b1a3e" : "guitarist",
          "45745c60-7b1a-11e8-9c9c-2d42b21b1a3i" : "writer"
        },
        "id" : 4,
        "rightHolder" : {
          "uuid" : "1",
          "name" : "Joe Smith"
        },
        "splitPct" : 80,
        "voteStatus" : "active",
        "_t" : "2019-07-08T16:40:51Z"
      } ],
      "accompaniment" : [ {
        "contributorRole" : {
          "12345c60-7b1a-11e8-9c9c-2d42b21b1a3f" : "flutist",
          "45745c60-7b1a-11e8-9c9c-2d42b21b1a3i" : "writer"
        },
        "id" : 5,
        "rightHolder" : {
          "uuid" : "2",
          "name" : "Bob Andrews"
        },
        "splitPct" : 20,
        "voteStatus" : "active",
        "_t" : "2019-07-08T16:39:51Z"
      } ]
    },
    "masterNeighboringRightSplit" : [ {
      "contributorRole" : {
        "12345c60-7b1a-11e8-9c9c-2d42b21b1a3e" : "guitarist",
        "45745c60-7b1a-11e8-9c9c-2d42b21b1a3i" : "writer"
      },
      "rightHolder" : {
        "id" : "1",
        "name" : "Joe Smith"
      },
      "splitPct" : 50,
      "voteStatus" : "active",
      "_t" : "2019-07-08T16:45:51Z"
    }, {
      "contributorRole" : {
        "12345c60-7b1a-11e8-9c9c-2d42b21b1a3f" : "flutist",
        "45745c60-7b1a-11e8-9c9c-2d42b21b1a3i" : "writer"
      },
      "rightHolder" : {
        "id" : "2",
        "name" : "Bob Andrews"
      },
      "splitPct" : 25,
      "voteStatus" : "active",
      "_t" : "2019-07-08T16:46:51Z"
    }, {
      "contributorRole" : {
        "12345c60-7b1a-11e8-9c9c-2d42b21b1a4g" : "composer"
      },
      "id" : 3,
      "rightHolder" : {
        "uuid" : "3",
        "name" : "Joe Duchane"
      },
      "splitPct" : 25,
      "voteStatus" : "active",
      "_t" : "2019-07-08T16:47:51Z"
    } ]
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
 * This method updates a split proposal
 *
 * uuid String The split proposal's unique profile ID
 * body Proposal request
 * returns proposal
 **/
exports.updateProposal = function(uuid,body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "uuid" : "45745c60-7b1a-11e8-9c9c-2d42b21b1a3e",
  "mediaId" : 1,
  "initiator" : {
    "id" : 1,
    "name" : "Jim Smith"
  },
  "rightsSplits" : {
    "workCopyrightSplit" : {
      "music" : [ {
        "contributorRole" : {
          "12345c60-7b1a-11e8-9c9c-2d42b21b1a3e" : "songwriter",
          "45745c60-7b1a-11e8-9c9c-2d42b21b1a3i" : "composer"
        },
        "rightHolder" : {
          "id" : "1",
          "name" : "Joe Smith"
        },
        "splitPct" : 50,
        "voteStatus" : "active",
        "_t" : "2019-07-08T16:45:51Z"
      }, {
        "contributorRole" : {
          "12345c60-7b1a-11e8-9c9c-2d42b21b1a3f" : "songwriter",
          "45745c60-7b1a-11e8-9c9c-2d42b21b1a3i" : "composer"
        },
        "rightHolder" : {
          "id" : "2",
          "name" : "Bob Andrews"
        },
        "splitPct" : 25,
        "voteStatus" : "active",
        "_t" : "2019-07-08T16:46:51Z"
      } ],
      "lyrics" : [ {
        "contributorRole" : {
          "12345c60-7b1a-11e8-9c9c-2d42b21b1a4g" : "arranger"
        },
        "id" : 3,
        "rightHolder" : {
          "uuid" : "3",
          "name" : "Joe Duchane"
        },
        "splitPct" : 25,
        "voteStatus" : "active",
        "_t" : "2019-07-08T16:47:51Z"
      } ]
    },
    "performanceNeighboringRightSplit" : {
      "principal" : [ {
        "contributorRole" : {
          "12345c60-7b1a-11e8-9c9c-2d42b21b1a3e" : "guitarist",
          "45745c60-7b1a-11e8-9c9c-2d42b21b1a3i" : "writer"
        },
        "id" : 4,
        "rightHolder" : {
          "uuid" : "1",
          "name" : "Joe Smith"
        },
        "splitPct" : 80,
        "voteStatus" : "active",
        "_t" : "2019-07-08T16:40:51Z"
      } ],
      "accompaniment" : [ {
        "contributorRole" : {
          "12345c60-7b1a-11e8-9c9c-2d42b21b1a3f" : "flutist",
          "45745c60-7b1a-11e8-9c9c-2d42b21b1a3i" : "writer"
        },
        "id" : 5,
        "rightHolder" : {
          "uuid" : "2",
          "name" : "Bob Andrews"
        },
        "splitPct" : 20,
        "voteStatus" : "active",
        "_t" : "2019-07-08T16:39:51Z"
      } ]
    },
    "masterNeighboringRightSplit" : [ {
      "contributorRole" : {
        "12345c60-7b1a-11e8-9c9c-2d42b21b1a3e" : "guitarist",
        "45745c60-7b1a-11e8-9c9c-2d42b21b1a3i" : "writer"
      },
      "rightHolder" : {
        "id" : "1",
        "name" : "Joe Smith"
      },
      "splitPct" : 50,
      "voteStatus" : "active",
      "_t" : "2019-07-08T16:45:51Z"
    }, {
      "contributorRole" : {
        "12345c60-7b1a-11e8-9c9c-2d42b21b1a3f" : "flutist",
        "45745c60-7b1a-11e8-9c9c-2d42b21b1a3i" : "writer"
      },
      "rightHolder" : {
        "id" : "2",
        "name" : "Bob Andrews"
      },
      "splitPct" : 25,
      "voteStatus" : "active",
      "_t" : "2019-07-08T16:46:51Z"
    }, {
      "contributorRole" : {
        "12345c60-7b1a-11e8-9c9c-2d42b21b1a4g" : "composer"
      },
      "id" : 3,
      "rightHolder" : {
        "uuid" : "3",
        "name" : "Joe Duchane"
      },
      "splitPct" : 25,
      "voteStatus" : "active",
      "_t" : "2019-07-08T16:47:51Z"
    } ]
  }
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

