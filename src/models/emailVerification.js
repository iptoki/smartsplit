const mongoose = require("mongoose")
const JWT      = require("../utils/jwt")

const JWT_ACTIVATE_TYPE = "user:activate"
/**
 * Represents an email with pending verification in the system
 */
const EmailVerificationSchema = new mongoose.Schema({
	_id: {
		type: String,
		alias: "email",
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
		default: Date.now		
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
 * Looks up the database for an existing email with the email address and the user ID
 */
EmailVerificationSchema.query.byParams = function(params) {
	if(!params.email || !params.user_id)
		throw new Error("Can't query by params without an email address and a user ID")

	return this.where({
		_id: params.email.toLowerCase(),
		user: params.user_id
	})
}


/**
 * 
 */
EmailVerificationSchema.methods.verifyActivationToken = function(token) {
	const data = JWT.decode(JWT_ACTIVATE_TYPE, token)
	
	if(!data)
		return false
	else if(!this.populated("user"))
		throw new Error("Can't verify ActivationToken when field `user` is not populated")

	return (
		data.activate_email === this.email &&
		data.user_id        === this.user._id &&
		data.user_password  === this.user.password
	)
}

module.exports = mongoose.model("EmailVerification", EmailVerificationSchema)
