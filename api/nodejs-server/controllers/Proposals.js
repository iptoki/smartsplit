'use strict';

var utils = require('../utils/writer.js');
var Proposals = require('../service/ProposalsService');

module.exports.deleteProposal = function deleteProposal (req, res, next) {
  var uuid = req.swagger.params['uuid'].value;
  Proposals.deleteProposal(uuid)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getMediaProposals = function getMediaProposals (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  Proposals.getMediaProposals(mediaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getAllProposals = function getAllProposals (req, res, next) {
  Proposals.getAllProposals()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getProposal = function getProposal (req, res, next) {
  var uuid = req.swagger.params['uuid'].value;
  Proposals.getProposal(uuid)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getProposalsRightHolder = function getProposalsRightHolder (req, res, next) {
  var rightHolderId = req.swagger.params['rightHolderId'].value;
  Proposals.getProposalsRightHolder(rightHolderId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchProposalInitiator = function patchProposalInitiator (req, res, next) {
  var uuid = req.swagger.params['uuid'].value;
  var initiator = req.swagger.params['initiator'].value;
  Proposals.patchProposalInitiator(uuid,initiator)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchProposalMediaId = function patchProposalMediaId (req, res, next) {
  var uuid = req.swagger.params['uuid'].value;
  var mediaId = req.swagger.params['mediaId'].value;
  Proposals.patchProposalMediaId(uuid,mediaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchProposalRightsSplits = function patchProposalRightsSplits (req, res, next) {
  var uuid = req.swagger.params['uuid'].value;
  var rightsSplits = req.swagger.params['rightsSplits'].value;
  Proposals.patchProposalRightsSplits(uuid,rightsSplits)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchProposalComments = function patchProposalComments (req, res, next) {
  var uuid = req.swagger.params['uuid'].value;
  var comments = req.swagger.params['comments'].value;
  Proposals.patchProposalComments(uuid,comments)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.postProposal = function postProposal (req, res, next) {
  var body = req.swagger.params['body'].value;
  Proposals.postProposal(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateProposal = function updateProposal (req, res, next) {
  var uuid = req.swagger.params['uuid'].value;
  var body = req.swagger.params['body'].value;
  Proposals.updateProposal(uuid,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.decodeProposal = function decodeProposal (req, res, next) {
  let _body = req.swagger.params['body'].value
  let jeton = _body.jeton

  Proposals.decode(jeton)
  .then(function (response) {
    utils.writeJson(res, response)
  })
  .catch(function (response) {
    utils.writeJson(res, response)
  });  

};

module.exports.justifierRefus = function justifierRefus (req, res, next) {
  let _body = req.swagger.params['body'].value
  let jeton = _body.jeton, 
      userId = _body.userId,
      raison = _body.raison

  Proposals.justifierRefus(userId,  jeton, raison)  
  .then(function (response) {
    utils.writeJson(res, response)
  })
  .catch(function (response) {
    utils.writeJson(res, response)
  });  

};

module.exports.voteProposal = function voteProposal (req, res, next) {
  let _body = req.swagger.params['body'].value
  let jeton = _body.jeton, 
      droits = _body.droits, 
      userId = _body.userId

  Proposals.voteProposal(userId, jeton, droits)

  .then(function (response) {
    utils.writeJson(res, response)
  })
  .catch(function (response) {
    utils.writeJson(res, response)
  });  

};

module.exports.listeVotes = function listeVotes (req, res, next) {
  let _body = req.swagger.params['body'].value
  let proposalId = _body.proposalId

  Proposals.listeVotes(proposalId)
  .then(function (response) {
    utils.writeJson(res, response)
  })
  .catch(function (response) {
    utils.writeJson(res, response)
  });  

};

module.exports.inviteProposal = function inviteProposal (req, res, next) {  

  let _body = req.swagger.params['body'].value
  let proposalId = _body.proposalId
  let rightHolders = _body.rightHolders

  Proposals.invite(proposalId, rightHolders)
  .then(function (response) {
    utils.writeJson(res, response)
  })
  .catch(function (response) {
    utils.writeJson(res, response)
  });  

};
