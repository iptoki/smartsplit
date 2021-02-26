const mongoose = require("mongoose")
const Config = require("../../config")
const Notification = require("../../constants/notificationTypes")

/**
 * Represents a user's notification preferences in the system
 */
module.exports.Schema = new mongoose.Schema(
	{
		[Notification.GENERAL_INTERACTIONS]: {
			type: Array,
			default: ["email", "push"],
		},
		[Notification.ADMINISTRATIVE_MESSAGES]: {
			type: Array,
			default: ["email", "push"],
		},
		[Notification.ACCOUNT_LOGIN]: Array,
		[Notification.SMARTSPLIT_BLOG]: Array,
		[Notification.SMARTSPLIT_PROMOTIONS]: Array,
		[Notification.PARTNER_PROMOTIONS]: Array,
	},
	{ _id: false }
)
