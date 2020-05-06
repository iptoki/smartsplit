const mongoose = require("mongoose")
const uuid = require("uuid").v4
const Config = require("../config")
const PasswordUtil = require("../utils/password")
const JWT = require("../utils/jwt")
const sendTemplateTo = require("../utils/email").sendTemplateTo
const { generateRandomCode } = require("../utils/random")
const { sendSMSTo } = require("../service/twilio")

const JWT_RESET_TYPE = "user:password-reset"
const JWT_ACTIVATE_TYPE = "user:activate"


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
	
	accountStatus: {
		type: String,
		default: "email-verification-pending",
		enum: [
			"invalid",
			"email-verification-pending",
			"split-invited",
			"active",
			"deleted"
		],
		api: {
			type: "string",
			readOnly: true,
			example: "active",
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

	artistName: {
		type: String,
		api: {
			type: "string",
			example: "Johnny"
		}
	},

	avatar: Buffer,

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
	
	mobilePhone: {
		number: String,
		status: {
			type: String,
			enum: ["verified", "unverified"],
		},
		verificationCode: {
			code: Number,
			createdAt: Date
		},
		api: {
			type: "object",
			properties: {
				number: {
					type: "string",
					example: "+15555555555"
				},
				status: {
					type: "string",
					enum: ["verified", "unverified"],
					example: "verified",
				}
			}
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
 * Returns the user's avatarUrl
 */
UserSchema.virtual("avatarUrl").get(function() {
	if(!this.avatar)
		return null
	return Config.apiUrl + "/users/" + this._id + "/avatar"
})


/**
 * Returns whether the current account status is active
 */
UserSchema.virtual("isActive").get(function() {
	return this.accountStatus === "active"
})


/**
 * Returns whether the current account status is deleted
 */
UserSchema.virtual("isDeleted").get(function() {
	return this.accountStatus === "deleted"
})


/**
 * Returns whether this account can be activated with an account activation token
 */
UserSchema.virtual("canActivate").get(function() {
	return [
		undefined,
		null,
		"email-verification-pending",
		"split-invited",
	].includes(this.accountStatus)
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
 * Filters account that are considered active
 */
UserSchema.query.byActive = function() {
	this.where({
		accountStatus: "active"
	})
}


/**
 * Looks up the database for a user by email address
 */
UserSchema.query.byEmail = function(email) {
	return this.where({email: email.toLowerCase()})
}


/**
 * Looks up the database for a user by mobile phone
 */
UserSchema.query.byMobilePhone = function(number) {
	return this.where({"mobilePhone.number": number})
}


/**
 * Looks up a user by a password reset token.
 */
UserSchema.query.byPasswordResetToken = function(token) {
	const data = JWT.decode(JWT_RESET_TYPE, token)
	
	if(!data) // no way to easily make it just return `null`
		return this.where({_id: null}).skip(1).limit(0)
	else
		return this.where({
			_id: data.user_id,
			password: data.user_password
		})
}


/**
 * Looks up a user by an account activation token.
 */
UserSchema.query.byActivationToken = function(token) {
	const data = JWT.decode(JWT_ACTIVATE_TYPE, token)
	
	if(!data)
		return this.where({_id: false}).skip(1).limit(0)
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
 * Sets the user's mobile phone
 */
UserSchema.methods.setMobilePhone = async function(number, verified = false) {
	const user = await this.model("User").findOne().byMobilePhone(number)

	if(user && (user._id !== this._id || this.mobilePhone.status === "verified"))
		throw new Error("This phone number is already used")

	const verificationCode = !verified
	                       ? {code: generateRandomCode(), createdAt: new Date()}
	                       : null

	this.mobilePhone = {
		number: number,
		status: verified ? "verified" : "unverified",
		verificationCode: verificationCode
	}
	if(!verified)
		await this.sendSMS(true, "Your activation code is " + this.mobilePhone.verificationCode.code)
			.catch(e => console.error(e, "Error sending verification code SMS"))
}


/**
 * Delete the user's account 
 */
UserSchema.methods.deleteAccount = async function() {
	this.accountStatus = "deleted"
	this.password      = undefined
	this.email         = undefined
	this.firstName     = undefined
	this.lastName      = undefined
	this.artistName    = undefined
	this.avatar        = undefined
	this.locale        = "en"
	await this.save()
}


/*
 * Sets the user's avatar
 */
UserSchema.methods.setAvatar = async function(avatar) {
	if(avatar.length > 1024*1024*4 /* 4 MB */)
		throw new Error("Maximum file size is 4 MB")

	this.avatar = avatar
}


/**
 * Verifies the password of the current user
 */
UserSchema.methods.verifyPassword = async function(password) {
	return await PasswordUtil.verify(password, this.password)
}


/**
 * Verifies the verification code of the user's mobile phone
 */
UserSchema.methods.verifyMobilePhone = async function(code) {
	if(!this.mobilePhone.verificationCode)
		return false

	const expireDate = new Date(
		this.mobilePhone.verificationCode.createdAt.getTime() + 24*60*60*1000 /* 24h */ 
	)

	if(expireDate < new Date() || this.mobilePhone.verificationCode.code != code)
		return false

	this.mobilePhone.status = "verified"
	this.mobilePhone.verificationCode = null
	await this.save()

	return true
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
 * Creates an activation token to verify the user's email address
 */
UserSchema.methods.createActivationToken = function(email, expires = "2 weeks") {
	return JWT.create(JWT_ACTIVATE_TYPE, {
		user_id: this.user_id,
		user_password: this.password,
		activate_email: email,
	}, expires)
}


/**
 * Sends the welcome email to the user
 */
UserSchema.methods.emailWelcome = async function(expires = "2 weeks") {
	const token = this.createActivationToken(this.email, expires)
	
	return await sendTemplateTo("user:activate-account", this, {}, {
		activateAccountUrl: Config.clientUrl + "/user/activate/" + token
	})
}


/**
 * Sends the password reset email to the user
 */
UserSchema.methods.emailPasswordReset = async function(expires = "2 hours") {
	const token = this.createPasswordResetToken(expires)

	return await sendTemplateTo("user:password-reset", this, {}, {
		resetPasswordUrl: Config.clientUrl + "/user/change-password/" + token
	})
}


/**
 * Sends the password changed notification to the user
 */
UserSchema.methods.emailPasswordChanged = async function() {
	return await sendTemplateTo("user:password-changed", this, {}, {})
}


/**
 * Sends an SMS to the user
 */
UserSchema.methods.sendSMS = async function(notificationType, message) {
	if(notificationType === true)
		return await sendSMSTo(this, message, false)
	else
		throw new Error("notificationType not implemented yet")
}


module.exports = mongoose.model("User", UserSchema)
