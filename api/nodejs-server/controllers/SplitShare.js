const SplitShare = require('../models/split-share')

/** Ajoute un split de partage éditeur */
module.exports.addEditorSplitShare = async function(req, res) {
	const body = req.swagger.params["body"].value
	const splitShare = new SplitShare(body)
	await splitShare.save()
	res.json(splitShare)
}

/** Retourne un split de partage éditeur */
module.exports.getSplitShare = async function(req, res) {
	const proposalId = req.swagger.params["proposalId"].value
	const rightHolderId = req.swagger.params["rightHolderId"].value

	const splitShare = await SplitShare.findOne({proposalId, rightHolderId})
	res.json(splitShare ? [splitShare] : [])
}

/** Envoie le courriel d'invitation à l'éditeur */
module.exports.inviteEditeur = async function(req, res) {
	const body = req.swagger.params["body"].value 
	const {mediaId, proposalId, shareeId, rightHolder, version} = body
	const rightHolderId = rightHolder.uuid

	const proposal = await SplitShare
		.findOne({proposalId, rightHolderId})
		.populate("sharee")
		.populate("rightHolder")
		.populate("proposal")

	proposal.mediaId = mediaId
	await proposal.populate("media").execPopulate()

	proposal.etat = "VOTATION"
	await proposal.save()
	await proposal.emailInvite("7 days")
	res.json(proposal._id)
}

/** Vote pour une proposition de split d'éditeur */
module.exports.splitShareVote = async function(req, res) {
	const body = req.swagger.params["body"].value
	const data = (await SplitShare.decodeToken(body.token || body.jeton)).data

	console.log("DATA", data)
	console.log("QUERY", {
			proposalId:    data.proposalId,
			rightHolderId: data.donateur,
			shareeId:      data.beneficiaire,
			version:       data.version
		})

	const proposal = await SplitShare
		.findOne({
			proposalId:    data.proposalId,
			rightHolderId: data.donateur,
			shareeId:      data.beneficiaire,
			version:       data.version
		})
		.populate("media")
		.populate("rightHolder")
		.populate("sharee")

	proposal.etat = body.choix === "accept" ? "ACCEPTE": "REFUSE"
	
	await proposal.save()
	await proposal.emailStatusUpdate(proposal.etat)

	res.json(body.choix)
}