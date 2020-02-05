const mongoose = require("mongoose")
const BaseModel = require("./base")
const uuidv1 = require('uuid/v1')

const RightHolderSchema = new mongoose.Schema({
	_id: {
		type: String,
		alias: "rightHolderId",
		default: () => uuidv1()
	},
	accountCreationType: String,
	artistName: String,
	avatarImage: String,
	defaultRoles: [String],
	email: String,
	firstName: String,
	groups: [String],
	instruments: [String],
	lastName: String,
	locale: String,
	socialMediaLinks: {type: Map, of: String},
	editeur: Boolean,
}, BaseModel.defaultOptions)

/**
 * Filtre les résulats d'une recherche par email
 */
RightHolderSchema.query.byEmail = function(email) {
	return this.where({email: email.toLowerCase()})
}

/**
 * Filtre les résultats de recherche par ayant-droits qui correspondent à l'identifiant unique ou l'adresse courriel
 */
RightHolderSchema.query.byBody = function(body) {
	return this.where({$or: [
		{_id: body.rightHolderId},
		{email: body.email}
	]})
}

module.exports = mongoose.model('RightHolder', RightHolderSchema)
