const mongoose = require("mongoose")
const BaseModel = require("./base")
const uuidv1 = require("uuid/v1")
const PasswordUtil = require("../utils/password")

const UserSchema = new mongoose.Schema({
	_id: {type: String, alias: "userId", default: uuidv1},
	email: String, // UNIQUE INDEX
	password: String, // bcrypt
	requestSource: { // TODO: enlever
		type: String, // smartsplit/pochette 
		default: "smartsplit"
	},
	accountCreationType: { // TODO: enlever car utilisé qu'une seule fois? 
		type: String, // Options: [registeredUser,  initiatorCreatedUser]
		default: "registeredUser"
	},
	firstName: String,
	lastName: String,
	locale: String,
	rightHolders: [{type: String, ref: "RightHolder", default: []}],
}, {
	toJSON: {
		virtuals: true,
		aliases: true,
		transform: function(doc, ret, options) {
			BaseModel.defaultOptions.toJSON.transform(doc, ret, options)
			delete ret.password
		}
	}
})

/** Recherche un utilisateur qui correspond à un object utilisateur (courriel ou ID) */
UserSchema.query.byBody = function(body) {
	if(!body.email)
		throw new Error("Can't query by body without an email address")

	return this.where({$or: [
		{_id: body.userId},
		{email: body.email.toLowerCase()}
	]})
}

/** Recherche un utilisateur par adresse courriel */
UserSchema.query.byEmail = function(email) {
	return this.where({email: email.toLowerCase()})
}

/** Définis l'adresse courriel de l'utilisateur, en vérifiant qu'elle n'est pas utilisée */
UserSchema.methods.setEmail = async function(email, check = true) {
	if(check && await this.model("User").findOne({email: email.toLowercase()}))
		throw new Error("Another user is already using this email address")

	this.email = email.toLowerCase()
}

/** Définis le mot de passe de l'utilisateur en utilisant l'utilitaire de mot de passes */
UserSchema.methods.setPassword = async function(password) {
	this.password = await PasswordUtil.hash(password)
}

/** Vérifie si le mot de passe fournis correspond au mot de passe hashé */
UserSchema.methods.verifyPassword = async function(password) {
	return await PasswordUtil.verify(password, this.password)
}

/** Crée un token autorisant la réinitialisation du mot de passe de cet utilisateur */
UserSchema.methods.createPasswordResetToken = async function(expires) {
	console.log("EXPIRE", arguments)
	const jwt = require('jsonwebtoken')
	const {getParameterA} = require("../utils/utils")

	return jwt.sign(
		{userId: this._id},
		await getParameterA("SECRET_JWS_API"),
		{expiresIn: expires}
	)
}

/** Vérifie un token de réinitialisation de mot de passe */
UserSchema.methods.verifyPasswordResetToken = async function(token) {
	const jwt = require('jsonwebtoken')
	const {getParameterA} = require("../utils/utils")
	const secret = await getParameterA("SECRET_JWS_MEDIA")

	try {
		return jwt.verify(token, secret).userId == this._id
	} catch(e) {
		return false
	}
}

/** Envoie le courriel de bienvenue à l'utilisateur */
UserSchema.methods.emailWelcome = async function() {
	let template = "compteCree"
	
	if(this.accountCreationType === "initiatorCreatedUser")
		template = "initiateurCompteCree"
	
	if(this.requestSource === "pochette")
		template += "Pochette"
	
	return await require("../utils/email").sendEmail({
		toEmail: this.email,
		firstName: this.firstName,
		lastName: this.lastName,
		callbackURL: "https://www-dev.smartsplit.org/",
		template: template
	})
}

/** Envoie un courriel de réinitialisation de mot de passe à l'utilisateur */
UserSchema.methods.emailPasswordReset = async function(expires = "2 hours") {
	const token = await this.createPasswordResetToken(expires)
	let template = "réinitialisationMotDePasse"

	if(this.requestSource === "pochette")
		template += "Pochette"

	return await require("../utils/email").sendEmail({
		toEmail: this.email,
		email: this.email,
		firstName: this.firstName,
		lastName: this.lastName,
		template: template,
		resetToken: token,
		userId: this._id
	})
}

module.exports = mongoose.model("User", UserSchema)
