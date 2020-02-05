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

/** Envoie le courriel de bienvenue à l'utilisateur */
UserSchema.methods.emailWelcome = async function() {
	let template = "compteCree"
	
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

module.exports = mongoose.model("User", UserSchema)
