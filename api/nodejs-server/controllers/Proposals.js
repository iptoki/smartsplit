const Proposal = require("../models/proposal")

/** Obtiens une proposition par son ID */
async function getProposalById(proposalId, withMedia = false) {
	let proposal = Proposal.findById(proposalId)

	if(withMedia)
		proposal.populate("media")

	proposal = await proposal

	// TODO: Ajouter la vérification des permissions ici

	if(!proposal) throw new APIError(404, {
		error: "This proposal does not exist in database",
		proposalId
	})

	return proposal
}

/** Obtiens une proposition depuis la requête Express */
function getProposalFromRequest(req, res, withMedia = false) {
	return getProposalById(req.swagger.params["uuid"].value, withMedia)
}

/** Liste toutes les propositions pour un média */
module.exports.getMediaProposals = async function(req, res) {
	const mediaId = req.swagger.params['mediaId'].value
	res.json(await Proposal.find({mediaId}))
}

/** Liste toutes les propositions en base de données */
module.exports.getAllProposals = async function(req, res) {
	res.json(await Proposal.find())
}

/** Retourne une proposition */
module.exports.getProposal = async function(req, res) {
	// FIXME: le client s'attends à un {Item: ...}, résidus de DynamoDB
	res.json({Item: await getProposalFromRequest(req, res)})
}

/** Retourne la dernière proposition ouverte pour un média */
module.exports.getDernierePropositionPourMedia = async function(req, res) {
	res.json(await Proposal.findOne().sort({_d: -1}))
}

/** Retourne les propositions impliquant un ayant-droit */
module.exports.getProposalsRightHolder = async function(req, res) {
	const rightHolderId = req.swagger.params['rightHolderId'].value
	res.json(await Proposal.find().byRightHolderId(rightHolderId))
}

/** Ajoute une proposition */
module.exports.postProposal = async function(req, res) {
	const body = req.swagger.params["body"].value

	if(await Proposal.findOne().byBody(body))
		return res.status(409).json({
			error: "Can't add this proposal because it already exists",
			proposalId: body.uuid
		})

	const proposal = new Proposal(body)
	await proposal.save()
	await proposal.updateMediaRightHolders()
	res.json(proposal)
};

/** Ajoute une proposition (dans la blockchain?) */
module.exports.postProposalRightsSplits = async function(req, res) {
	console.warn("NON IMPLÉMENTÉ", "controllers/Proposals.postProposalRightsSplits",
		"Cette fonction fait la même chose que postProposal pour le moment")

	const body = req.swagger.params["body"].value

	if(await Proposal.findOne().byBody(body))
		return res.status(409).json({
			error: "Can't add this proposal because it already exists",
			proposalId: body.uuid
		})

	const proposal = new Proposal(body)
	await proposal.save()
	await proposal.updateMediaRightHolders()
	res.json(proposal)
}

/** Mets à jours une proposition */
module.exports.updateProposal = async function(req, res) {
	const proposal = await getProposalFromRequest(req, res)
	Object.assign(proposal, req.swagger.params["body"].value)
	await proposal.save()
	await proposal.updateMediaRightHolders()
	res.json(proposal)
}

/** Supprime une proposition */
module.exports.deleteProposal = async function(req, res) {
	const proposal = await getProposalFromRequest(req, res)
	await proposal.remove()
	res.json(proposal)
}

/** Modifie l'initiateur d'une proposition */
module.exports.patchProposalInitiator = async function(req, res) {
	const proposal = await getProposalFromRequest(req, res)
	proposal.initiatorUuid = req.swagger.params['initiatorUuid'].value
	proposal.initiatorName = req.swagger.params['initiatorName'].value
	await proposal.save()
	res.json(proposal)
}

/** Motifie la distribution des droits dans la proposition */
module.exports.patchProposalRightsSplits = async function(req, res) {
	const proposal = await getProposalFromRequest(req, res, true)
	proposal.rightsSplits = req.swagger.params["rightsSplits"].value
	await proposal.save()
	await proposal.updateMediaRightHolders()
	res.json(proposal)
}

// Génère le reste des méthodes PATCH
const patch = require("./utils")(module.exports, getProposalFromRequest)
patch.replace("patchProposalMediaId", "mediaId")
patch.replace("patchProposalComments", "comments")


/** Décode un jeton d'accès à une proposition */
module.exports.decodeProposal = async function(req, res) {
	const body = req.swagger.params["body"].value
	const token = body.token || body.jeton

	res.json(await Proposal.decodeToken(token))
}

/** Mets la proposition en votation et envoie les couriels d'invitation à voter */
module.exports.inviteProposal = async function(req, res) {  
	const body = req.swagger.params["body"].value
	const {proposalId, rightHolders} = body

	const proposal = await getProposalById(proposalId, true)
	proposal.initiateVote()
	await proposal.updateStateAndSave()

	// Si la proposition est toujours en votation, envoyer l'email d'invitation (si l'utilisateur était le seul seul à voter, alors l'état sera "ACCEPTE", et il n'est pas pertinent d'envoyer un couriel d'invitation)
	if(proposal.etat === "VOTATION")
		res.json(
			await proposal.emailInvites(rightHolders, "7 days")
		)
	else
		res.json([true])
}

module.exports.justifierRefus = async function(req, res) {
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