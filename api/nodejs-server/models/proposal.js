const mongoose = require("mongoose")
const BaseModel = require("./base")
const uuidv1 = require('uuid/v1')

const ProposalCommentSchema = new mongoose.Schema({
	rightHolderId: {type: String, ref: "RightHolder"},
	comment: String,
})

const ProposalSplitSchema = new mongoose.Schema({
	contributorRole: {type: Map, of: String},
	rightHolder: {
		color: String,
		name: String,
		rightHolderId: String,
	},
	splitPct: Number,
	voteStatus: String, // TODO: enum
})

const RightTypes = [
	"masterNeighboringRightSplit",
	"performanceNeighboringRightSplit",
	"workCopyrightSplit",
]

const ProposalSchema = new mongoose.Schema({
	_id: {
		type: String,
		alias: "uuid",
		default: () => uuidv1()
	},
	comments: [ProposalCommentSchema],
	creationDate: {type: Number, default: Date.now}, // TODO: Date
	etat: String, // TODO: enum
	initiatorName: String,
	initiatorUuid: {type: String, ref: "RightHolder"},
	mediaId: {type: Number, ref: "Media"},
	rightHolders: [{type: String, ref: "RightHolder"}],
	rightsSplits: {
		masterNeighboringRightSplit: {type: Map, of: [ProposalSplitSchema]},
		performanceNeighboringRightSplit: {type: Map, of: [ProposalSplitSchema]},
		workCopyrightSplit: {type: Map, of: [ProposalSplitSchema]},
	},
	_d: {type: Number, default: Date.now},
}, BaseModel.defaultOptions)

ProposalSchema.virtual("media", {
	ref: "Media",
	localField: "mediaId",
	foreignField: "_id",
	justOne: true
})

ProposalSchema.methods.ensureMediaPopulated = async function() {
	if(!this.populated("media"))
		await this.populate("media").execPopulate()
}

ProposalSchema.query.byBody = function(body) {
	return this.where({_id: body.uuid})
}

ProposalSchema.query.byRightHolderId = function(id) {
	return this.where({$or: [
		{initiatorUuid: id},
		{rightHolders: id}
	]})
}

/** Décode un jeton d'accès à une proposition */
ProposalSchema.statics.decodeToken = async function(token) {
	const jwt = require('jsonwebtoken')
	const {getParameterA} = require("../utils/utils")
	const secret = await getParameterA("SECRET_JWS_INVITE")
	return jwt.verify(token, secret)
}

/**
 * Méthode de style "forEach" pour tous les splits
 *   function callback(split, rightSubType, rightType)
 */
ProposalSchema.methods.forEachSplit = function(callback) {
	// Parcours des types de droits
	for(let rightType of RightTypes) {
		console.log("LOOP SUB", rightType, this.rightsSplits[rightType])
		// Parcours des sous-types de droits
		if(this.rightsSplits[rightType])
		for(let [rightSubType, splits] of this.rightsSplits[rightType]) {
			console.log("LOOP SUB SUB", rightSubType, splits)
			// Parcours de chaque split
			if(splits)
			for(split of splits) {
				callback(split, rightSubType, rightType)
			}
		}
	}
}

/** Retourne une version applatie de tous les splits */
ProposalSchema.methods.flattenSplits = function() {
	const splits = []
	this.forEachSplit(split => splits.push(split))
	return splits
} 

/** Hook pour mettre à jours le _id ainsi que les ayant-droits présents dans la proposition */
ProposalSchema.pre("save", async function() {
	if(this._id === "") // Le client envoie des UUID vides
		this._id = uuidv1()

	if(!this.rightsSplits)
		return // on mets pas à jours si on a pas les splits

	this.rightHolders = this.initiatorUuid ? [this.initiatorUuid] : []

	this.forEachSplit(split => {
		let {rightHolderId} = split.rightHolder

		if(!this.rightHolders.includes(rightHolderId))
			this.rightHolders.push(rightHolderId)
	})
})

/** Initialize la proposition en état de votation */
ProposalSchema.methods.initiateVote = function() {
	this.etat = "VOTATION"
	this.setVote(this.initiatorUuid, "accept")
}

/** Définis le vote d'un ayant-droit dans les splits de la proposition */
ProposalSchema.methods.setVote = function(rightHolderId, voteState) {
	this.forEachSplit(split => {
		if(split.rightHolder.rightHolderId == rightHolderId)
			split.voteStatus = voteState
	})

	this.rightsSplits = this.rightsSplits // force comme "modifié"
}

/** Vérifie si les votes sont unanimes pour un certain type de vote */
ProposalSchema.methods.voteIsUnanimous = function(voteState = "accept") {
	let isUnanimous = true

	this.forEachSplit(split => {
		if(split.voteStatus != voteState)
			isUnanimous = false
	})

	return isUnanimous
}

/** Génère un jeton pour un ayant-droit pour donner accès à la proposition */
ProposalSchema.methods.createToken = async function(rightHolderId, expire = "7 days") {
	const jwt = require('jsonwebtoken')
	const {getParameterA} = require("../utils/utils")

	return jwt.sign(
		{data: {proposalId: this.uuid, rightHolderId}},
		await getParameterA("SECRET_JWS_INVITE"),
		{expiresIn: expire}
	)
}

/** Envoie une invitation a un ayant-droit par courriel */
ProposalSchema.methods.emailInvite = async function(rightHolder, expire = "7 days") {
	await this.ensureMediaPopulated()

	const {rightHolderId} = rightHolder
	const isInitiator = rightHolderId === this.initiatorUuid
	const token = await this.createToken(rightHolderId, expire)

	const email = {
		toEmail: rightHolder.email,
		firstName: rightHolder.name,
		workTitle: this.media.title,
		callbackURL: `http://dev.smartsplit.org/proposition/vote/${token}`,
		splitInitiator: this.initiatorName,
		template: isInitiator ? "splitSent" : "splitCreated"
	}

	await require("../utils/email").sendEmail(email)
	return true
}

/** Envoie une invitation aux ayant-droits par courriel */
ProposalSchema.methods.emailInvites = async function(rightHolders, expire = "7 days") {
	return await Promise.all(
		Object.keys(rightHolders).map(async (rhId) => {
			return await this.emailInvite(rightHolders[rhId], expire)
		})
	)
}

/**
 * Mets à jours l'état interne de la proposition, enregistre, et si applicable, envoie un courriel d'information si le vote est terminé
 *
 * Cette fonction *doit* enregistrer lors du changement d'état, car sinon on pourrait possiblement envoyer des courriels et ne pas enregistrer l'objet mis à jours qui a déclenché le courriel.
 */
ProposalSchema.methods.updateStateAndSave = async function() {
	const initialState = this.etat
	const votes = {
		accept: 0,
		reject: 0,
		active: 0
	}

	this.forEachSplit(split => {
		votes[split.voteStatus || "active"]++
	})

	if(this.etat == "BROUILLON") {
		// no-op
	}
	else if(votes.active > 0) {
		this.etat = "VOTATION"
	}
	else if(votes.reject > 0) {
		this.etat = "REFUSE"
	}
	else if(votes.accept > 0) {
		this.etat = "ACCEPTE"
	}
	else {
		this.etat = "ERREUR"
	}

	await this.save()

	if(this.etat === initialState)
		return

	// TOOD: envoie courriels
}

/**
 * Mets à jours les ayant-droits du média relié
 * FIXME: Implémenté ainsi pour rester compatible/identique au comportement DynamoDB durant la migration. Cette façon de faire comporte certains problèmes lié au fait que la mise à jours de n'importe quelle proposition va modifier les ayant droits attribués au média. Il ferait du sens d'au moins attendre que la proposition soit finalisée avant de faire ce changement.
 */
ProposalSchema.methods.updateMediaRightHolders = function() {
	let rightHolders = {}

	this.forEachSplit(split => {
		let {rightHolderId} = split.rightHolder

		if(!(rightHolderId in rightHolders))
			rightHolders[rightHolderId] = {
				id: rightHolderId,
				roles: []
			}

		let roles = rightHolders[rightHolderId].roles
		
		for(let [_, contributorRole] of split.contributorRole]) {
			if(!roles.includes(contributorRole))
				roles.push(contributorRole)
		}
	})

	rightHolders = Object.values(rightHolders)

	if(this.populated("media")) {
		this.media.rightHolders = rightHolders
		await this.media.rightHolders.save()
	} else {
		await Media.update({_id: this.mediaId}, {rightHolders})
	}

	return rightHolders
}

module.exports = mongoose.model('Proposal', ProposalSchema)
module.exports.RightTypes = RightTypes