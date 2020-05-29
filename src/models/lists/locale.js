const mongoose = require("mongoose")

const LocaleSchema = new mongoose.Schema(
	{
		fr: {
			type: String,
			api: {
				type: "string",
			},
		},
		en: {
			type: String,
			api: {
				type: "string",
			},
		},
	},
	{ _id: false }
)

module.exports = LocaleSchema
