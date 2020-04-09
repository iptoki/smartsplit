const mongoose = require("mongoose")
const uuid = require("uuid").v4
const PasswordUtil = require("../utils/password")
const JWT = require("../utils/jwt")

const EMAIL_ACCOUNT_CREATED  = "d-3f2ce3bd2e2c4c54831e880443f58fc3" // TODO
const EMAIL_ACCOUNT_INVITED  = "d-a3ea16f9136643788de1da46b064a824" // TODO
const EMAIL_PASSWORD_RESET   = "d-594e21a344ec41ad9d5747e332cc26ae" // TODO
const EMAIL_PASSWORD_CHANGED = "d-d9cebb97bf734005a636be49401d2b71" // TODO

const JWT_RESET_TYPE = "user:password-reset"


/**
 * Represents a user / login in the system
 */
const UserSchema = new mongoose.Schema({
	_id: {
		type: String,
		alias: "user_id",
		default: uuid,
		api: {
			type: "string",
			format: "uuid",
			example: "e87b56fe-1ce0-4ec7-8393-e18dc7415041",
			readOnly: true
		}
	},
	
	email: {
		type: String, // UNIQUE INDEX
		api: {
			type: "string",
			example: "example@smartsplit.org",
			format: "email"
		}
	},
	
	password: {
		type: String, // bcrypt
		api: {
			type: "string",
			writeOnly: true,
			format: "password",
			example: "Biquette#1!"
		}
	},
	
	firstName: {
		type: String,
		api: {
			type: "string",
			example: "John"
		}
	},
	
	lastName: {
		type: String,
		api: {
			type: "string",
			example: "Doe"
		}
	},
	
	locale: {
		type: String,
		default: "en",
		enum: ["fr", "en"],
		api: {
			type: "string",
			enum: ["en", "fr"],
			example: "fr",
			default: "en"
		}
	},
	
	//rightHolders: [{type: String, ref: "RightHolder", default: []}],
})


/**
 * Returns the full name of the user (Firstname + Lastname)
 */
UserSchema.virtual("fullName").get(function() {
	if(this.firstName && this.lastName)
		return this.firstName + " " + this.lastName
	
	if(this.firstName)
		return this.firstName
	
	return null
})


/**
 * Returns an email object of {name, email} to send email to/from this user
 */
UserSchema.virtual("$email").get(function() {
	return {
		name: this.fullName || this.email,
		email: this.email
	}
})


/**
 * Looks up the database for an existing user with either the ID or email address
 */
UserSchema.query.byBody = function(body) {
	if(!body.email)
		throw new Error("Can't query by body without an email address")

	return this.where({$or: [
		{_id: body.user_id},
		{email: body.email.toLowerCase()}
	]})
}


/**
 * Looks up the database for a user by email address
 */
UserSchema.query.byEmail = function(email) {
	return this.where({email: email.toLowerCase()})
}


/**
 * Looks up a user by a password reset token.
 */
UserSchema.query.byPasswordResetToken = function(token) {
	const data = JWT.decode(JWT_RESET_TYPE, token)
	
	if(!data)
		return this.limit(0)
	else
		return this.where({
			_id: data.user_id,
			password: data.user_password
		})
}


/**
 * Sets the primary email address of a user, checking for duplicates
 */
UserSchema.methods.setEmail = async function(email, check = true) {
	if(email.toLowerCase() === this.email)
		return
	
	if(check && await this.model("User").findOne({email: email.toLowerCase()}))
		throw new Error("Another user is already using this email address")

	this.email = email.toLowerCase()
}


/**
 * Sets the user's password
 */
UserSchema.methods.setPassword = async function(password, force = false) {
	if(!force && await this.verifyPassword(password))
		return false
	
	this.password = await PasswordUtil.hash(password)
	return true
}


/**
 * Verifies the password of the current user
 */
UserSchema.methods.verifyPassword = async function(password) {
	return await PasswordUtil.verify(password, this.password)
}


/**
 * Creates a password reset token for the user
 */
UserSchema.methods.createPasswordResetToken = function(expires) {
	return JWT.create(JWT_RESET_TYPE, {
		user_id: this._id,
		user_password: this.password
	}, expires)
}


/**
 * Verifies a password reset token for the user
 */
UserSchema.methods.verifyPasswordResetToken = function(token) {
	const data = JWT.decode(JWT_RESET_TYPE, token)
	return data && data.user_id == this._id
}


/**
 * Sends the welcome email to the user
 */
UserSchema.methods.emailWelcome = async function() {
	return await require("../utils/email")({
		to: this.$email,
		template: EMAIL_ACCOUNT_CREATED,
	},
	{
		toEmail: this.email,
		firstName: this.firstName,
		lastName: this.lastName,
		callbackURL: "https://www-dev.smartsplit.org/",
	})
}


/**
 * Sends the password reset email to the user
 */
UserSchema.methods.emailPasswordReset = async function(expires = "2 hours") {
	const token = this.createPasswordResetToken(expires)
	console.log("token", token)

	return await require("../utils/email")({
		to: this.$email,
		template: EMAIL_PASSWORD_RESET,
	}, {
		toEmail: this.email,
		email: this.email,
		firstName: this.firstName,
		lastName: this.lastName,
		resetToken: token,
		userId: this._id
	})
}


/**
 * Sends the password changed notification to the user
 */
UserSchema.methods.emailPasswordChanged = async function() {
	return await require("../utils/email")({
		to: this.$email,
		template: EMAIL_PASSWORD_CHANGED,
	}, {
		toEmail: this.email,
		email: this.email,
		firstName: this.firstName,
		lastName: this.lastName,
	})
}

module.exports = mongoose.model("User", UserSchema)
