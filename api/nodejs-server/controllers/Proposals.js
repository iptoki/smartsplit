const Proposal = require("../models/proposal")
const APIError = require("./error")

/** Obtiens une proposition par son ID */
async function getProposalById(proposalId, withMedia = false) {
	let proposal = Proposal.findById(proposalId)

	if(withMedia)
		proposal.populate("media")

	proposal = await proposal

	if(!proposal) throw new APIError(404, {
		error: "This proposal does not exist in database",
		proposalId
	})

	return proposal
}

/** Obtiens une proposition depuis la requête Express */
async function getProposalFromRequest(req, res, withMedia = false) {
	const proposal = await getProposalById(
		req.swagger.params["uuid"].value, withMedia
	)
	
	// if(proposal)
	// 	req.auth.requireRightHolder(...proposal.rightHolders)
	
	return proposal
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
	const mediaId = req.swagger.params["mediaId"].value
	res.json(await Proposal.findOne({_id: mediaId}).sort({_d: -1}))
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

	const data = await Proposal.decodeToken(token)

	res.json(data && data.data)
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

/** Ajoute un vote à une proposition */
module.exports.voteProposal = async function(req, res) {
	const body = req.swagger.params["body"].value
	const token  = body.token  || body.jeton
	const rights = body.rights || body.droits
	const userId = body.userId

	let tdata = (await Proposal.decodeToken(token)).data

	const proposal = await getProposalById(tdata.proposalId, true)

	for(let rightType in rights) {
		let {vote, raison} = rights[rightType]

		proposal.setVote(userId, rightType, vote)
		proposal.comments.push({
			rightHolderId: userId,
			comment: raison
		})
	}

	await proposal.updateStateAndSave()
	res.json({
		proposalId: proposal._id,
		rightHolderId: userId
	})
}

// Pas utilisé?
module.exports.justifierRefus = async function(req, res) {
	res.status(501).json({
		error: "Cet API n'est pas implémenté."
	})
}

// Pas utilisé?
module.exports.listeVotes = function listeVotes (req, res, next) {
	res.status(501).json({
		error: "Cet API n'est pas implémenté."
	})
}
