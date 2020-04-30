const mongoose = require("mongoose")
const BaseModel = require("./base")
const uuidv1 = require("uuid/v1")

const SplitShareSchema = new mongoose.Schema({
	_id: {
		type: String,
		alias: "uuid",
		default: uuidv1
	},
	mediaId: {type: Number, ref: "Media"},
	rightHolderId: {type: String, ref: "RightHolder"},
	shareeId: {type: String, ref: "RightHolder"},
	proposalId: {type: String, ref: "Proposal"},
	rightHolderPct: Number,
	shareePct: Number,
	version: String,
	etat: String, // TODO: enum
	_d: {type: Number, default: Date.now},
	type: String,
})

SplitShareSchema.virtual("media", {
	ref: "Media",
	localField: "mediaId",
	foreignField: "_id",
	justOne: true
})

SplitShareSchema.virtual("rightHolder", {
	ref: "RightHolder",
	localField: "rightHolderId",
	foreignField: "_id",
	justOne: true
})

SplitShareSchema.virtual("sharee", {
	ref: "RightHolder",
	localField: "shareeId",
	foreignField: "_id",
	justOne: true
})

SplitShareSchema.virtual("proposal", {
	ref: "Proposal",
	localField: "proposalId",
	foreignField: "_id",
	justOne: true
})

SplitShareSchema.statics.decodeToken = async function(token) {
	const jwt = require('jsonwebtoken')
	const {getParameterA} = require("../utils/utils")
	const secret = await getParameterA("SECRET_JWS_INVITE")
	return jwt.verify(token, secret)
}

SplitShareSchema.methods.createToken = async function(expires = "7 days") {
	const jwt = require('jsonwebtoken')
	const {getParameterA} = require("../utils/utils")

	return jwt.sign(
		{data: {
			proposalId: this.proposalId, 
			donateur: this.rightHolderId, 
			beneficiaire: this.shareeId,
			version: this.version
		}},
		await getParameterA("SECRET_JWS_INVITE"),
		{expiresIn: expires}
	)
}

SplitShareSchema.methods.emailInvite = async function(expires = "7 days") {
	const {sendEmail} = require("../utils/email")
	// TODO: Check populated

	const token = await this.createToken(expires)
	
	await Promise.all([
		sendEmail({
			toEmail: this.sharee.email,
			firstName: this.sharee.firstName,
			workTitle: this.media.title,
			callbackURL: `https://www-proto.smartsplit.org/partage/editeur/vote/${token}`,
			template: "partageEditeur",
			ayantDroit: this.rightHolder.firstName
		}),
		sendEmail({
			toEmail: this.rightHolder.email,
			firstName: this.rightHolder.firstName,
			workTitle: this.media.title,
			callbackURL: `https://www-proto.smartsplit.org/partager/${this.mediaId}`,
			template: "partageEditeurEnvoye",
		})
	])

	return true
}

SplitShareSchema.methods.emailStatusUpdate = async function(state) {
	const {sendEmail} = require("../utils/email")
	// TODO: Check populated

	const template = {
		ACCEPTE: "partageEditeurAccepte",
		REFUSE:  "partageEditeurRefuse"
	}[state] || "partageEditeurRefuse"
	const token = await this.createToken()

	await Promise.all([
		sendEmail({
			toEmail: this.sharee.email,
			firstName: this.sharee.firstName,
			workTitle: this.media.title,
			callbackURL: `https://www-proto.smartsplit.org/partage/editeur/vote/${token}`,
			template
		}),
		sendEmail({
			toEmail: this.rightHolder.email,
			firstName: this.rightHolder.firstName,
			workTitle: this.media.title,
			callbackURL: `https://www-proto.smartsplit.org/partage/editeur/vote/${token}`,
			template
		})
	])

	return true
}

module.exports = mongoose.model("SplitShare", SplitShareSchema)