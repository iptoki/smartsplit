const mongoose = require("mongoose")
const List = require("./list")
const LocaleSchema = require("./locale")

/**
 * Represents a generic modifiable list in the system
 */
const contentLanguagesList = new mongoose.Schema(
	{
		name: {
			type: LocaleSchema,
			api: {
				type: "object",
				properties: {
					fr: { type: "string" },
					en: { type: "string" },
				},
			},
		},

		altNames: {
			type: [String],
			api: {
				type: "array",
				items: {
					type: "string",
				},
			},
		},
	},
	{ discriminatorKey: "type" }
)

contentLanguagesList.methods.setFields = function (body) {
	for (let field in ["name", "altNames", ...List.getFields()]) {
		if (body[field]) this[field] = body[field]
	}
}

module.exports = List.discriminator("content-languages", contentLanguagesList)
