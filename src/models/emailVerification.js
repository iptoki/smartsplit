const mongoose = require("mongoose")
const JWT      = require("../utils/jwt")
const { normalizeEmailAddress } = require("../utils/email")

const JWT_ACTIVATE_TYPE = "user:activate"
/**
 * Represents an email with pending verification in the system
 */
const EmailVerificationSchema = new mongoose.Schema({
	_id: {
		type: String,
		alias: "email",
		lowercase: true,
		trim: true,
		api: {
			type: "string",
			format: "email",
			example: "example@smartsplit.org",
			readOnly: true
		}
	},
	
	user: {
		type: String,
		ref: 'User',
		api: {
			type: "string",
			format: "uuid",
			example: "e87b56fe-1ce0-4ec7-8393-e18dc7415041",
			readOnly: true
		}
	},

	createdAt: {
		type: Date,
		expires: "2w", // Two weeks
		default: new Date()		
	},
})

/**
 * Looks up the database for emails by user_id
 */
EmailVerificationSchema.query.byUserId = function(user_id) {
	return this.where({
		user_id: user_id
	})
}


/**
 * Looks up the database for emails by email
 */
EmailVerificationSchema.query.byEmail = function(email) {
	return this.where({
		_id: normalizeEmailAddress(email)
	})
}


/**
 * Looks up an email by activation token.
 */
EmailVerificationSchema.query.byActivationToken = async function(token) {
	const data = JWT.decode(JWT_ACTIVATE_TYPE, token)
	
	if(!data)
		return this.where({_id: false}).skip(1).limit(0)

	const email = await this.where({
		_id: data.activate_email,
		user: data.user_id,
	}).populate("user")

	if(!email || email.user.password !== data.user_password)
		return this.where({_id: false}).skip(1).limit(0)

	return email
}


/**
 * Verify that an activation token is valid against the current instance of EmailVerification
 */
EmailVerificationSchema.methods.verifyActivationToken = async function(token) {
	const data = JWT.decode(JWT_ACTIVATE_TYPE, token)
	
	if(!data)
		return false

	if(!this.populated("user"))
		await this.populate("user").execPopulate()

	return (
		data.activate_email === this.email &&
		data.user_id        === this.user._id &&
		data.user_password  === this.user.password
	)
}

module.exports = mongoose.model("EmailVerification", EmailVerificationSchema)
