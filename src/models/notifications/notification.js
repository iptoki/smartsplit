const mongoose = require("mongoose")
const Config = require("../../config")

module.exports.GENERAL_INTERATIONS = "general_interations"
module.exports.ADMINISTRATIVE_MESSAGES = "administrative_messages"
module.exports.ACCOUNT_LOGIN = "account_login"
module.exports.SMARTSPLIT_BLOG = "smartsplit_blog"
module.exports.SMARTSPLIT_PROMOTIONS = "smartsplit_promotions"
module.exports.PARTNER_PROMOTIONS = "partner_promotions"

/**
 * Represents a user's notification preferences in the system
 */
module.exports.Schema = new mongoose.Schema(
	{
		[this.GENERAL_INTERATIONS]: {
			type: Array,
			default: ["email", "push"],
		},
		[this.ADMINISTRATIVE_MESSAGES]: {
			type: Array,
			default: ["email", "push"],
		},
		[this.ACCOUNT_LOGIN]: {
			type: Array,
			default: [],
		},
		[this.SMARTSPLIT_BLOG]: {
			type: Array,
			default: [],
		},
		[this.SMARTSPLIT_PROMOTIONS]: {
			type: Array,
			default: [],
		},
		[this.PARTNER_PROMOTIONS]: {
			type: Array,
			default: [],
		},
	},
	{ _id: false }
)
