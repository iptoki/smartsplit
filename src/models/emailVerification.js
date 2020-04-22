const mongoose = require("mongoose")

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
	
	user_id: {
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

module.exports = mongoose.model("EmailVerification", EmailVerificationSchema)
