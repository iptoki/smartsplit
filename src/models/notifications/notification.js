const mongoose = require("mongoose")
const Config = require("../../config")

module.exports.GENERAL_INTERACTIONS = "generalInteractions"
module.exports.ADMINISTRATIVE_MESSAGES = "administrativeMessages"
module.exports.ACCOUNT_LOGIN = "accountLogin"
module.exports.SMARTSPLIT_BLOG = "smartsplitBlog"
module.exports.SMARTSPLIT_PROMOTIONS = "smartsplitPromotions"
module.exports.PARTNER_PROMOTIONS = "partnerPromotions"

/**
 * Represents a user's notification preferences in the system
 */
module.exports.Schema = new mongoose.Schema(
	{
		[this.GENERAL_INTERACTIONS]: {
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
