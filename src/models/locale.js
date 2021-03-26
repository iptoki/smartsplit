const mongoose = require('mongoose')

const LocaleSchema = new mongoose.Schema(
	{
		fr: {
			type: String,
		},
		en: {
			type: String,
		},
	},
	{ _id: false }
)

module.exports = LocaleSchema
