const mongoose = require("mongoose")
const BaseModel = require("./base")
const uuidv1 = require('uuid/v1')

const MediaFileFileSchema = new mongoose.Schema({
	access: String, // TODO: restreindre les options
	file: String, // TODO: Pointer vers un fichier dans MongoDB, ou URL?
	md5: String
}, {_id: false})

const MediaFileSchema = new mongoose.Schema({
	files: [MediaFileFileSchema]
}, {_id: false})

const MediaRightHolderSchema = new mongoose.Schema({
	id: String, // TODO: ObjectID
	roles: [String] // TODO: utiliser un set de valeurs
}, {_id: false})

const LinkSchema = new mongoose.Schema({
	name: String,
	url: String
}, {_id: false})

const MediaSchema = new mongoose.Schema({
	_id: {type: Number, alias: "mediaId", default: Date.now}, // TODO: Utiliser un vrai ID
	type: String, // TODO: ???
	title: String,
	artist: String,
	album: String,
	genre: String,
	atype: String, // TODO: C'est quoi exactement? Nombre?
	bpm: Number,
	cover: Boolean,
	creationDate: Date,
	creator: {type: mongoose.ObjectId, ref: "RightHolder"},
	distributor: String,
	distributorAddress: String, // TODO: object distributor avec nom et addresse?
	files: {type: Map, of: MediaFileSchema},
	influence: String,
	upc: String,
	isrc: String,
	iswc: String,
	jurisdiction: String,
	label: String, // TODO: object "label"
	labelAddress: String,
	lyrics: {
		access: String,
		languages: [String],
		text: String
	},
	modificationDate: Date,
	msDuration: String, // TODO: Number
	playlistLinks: [LinkSchema],
	playlistLinksJoined: [String],
	publishDate: String, // TODO: Date
	publisher: String,
	remixer: String,
	rightHolders: [MediaRightHolderSchema],
	secondaryGenre: [String],
	socialMediaLinks: [LinkSchema],
	streamingServiceLinks: [LinkSchema],
	studio: String, // TODO: Object "Studio"
	studioAddress: String,
	
	initiateurPropositionEnCours: String, // TODO: Anglais, ObjectId
	pressArticleLinks: [LinkSchema],
	socialMediaLinks: [LinkSchema]
}, BaseModel.defaultOptions)

MediaSchema.query.byBody = function(body) {
	return this.where({_id: body.mediaId})
}

MediaSchema.statics.decodeToken = async function(token) {
	const jwt = require('jsonwebtoken')
	const {getParameterA} = require("../utils/utils")
	const secret = await getParameterA("SECRET_JWS_MEDIA")
	return jwt.verify(token, secret)
}

MediaSchema.methods.createToken = async function(access, expires) {
	const jwt = require('jsonwebtoken')
	const {getParameterA} = require("../utils/utils")

	return jwt.sign(
		{data: {mediaId: this.mediaId, acces: access}},
		await getParameterA("SECRET_JWS_MEDIA"),
		{expiresIn: expires}
	)
}

MediaSchema.methods.test = function() {
	return "test successful"
}

MediaSchema.methods.shareByEmail = async function(
	name,
	email,
	access = 1,
	expires = "365 days",
	context = "smartsplit.org" // TODO: Config/ENV
) {
	const axios = require('axios')
	
	const token = await this.createToken(access, expires)

	const template = {
		1: "sharePublicAccessLink",
		2: "sharePrivateAccessLink",
		3: "shareAdminAccessLink",
	}[access] || "sharePublicAccessLink"
	
	const body = [{
		toEmail: email,
		firstName: name,
		workTitle: this.title,
		template: template,
		callbackURL: `http://proto.${context}/oeuvre/resume/${token}`
	}]
	
	await axios.post('http://messaging.smartsplit.org:3034/sendEmail', body)
}

module.exports = mongoose.model("Media", MediaSchema)
