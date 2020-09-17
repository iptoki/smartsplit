const mongoose = require("mongoose")
const List = require("./list")
const LocaleSchema = require("./locale")

/**
 * Represents an entity of musical genres list in the system
 */
const MusicalGenresList = new mongoose.Schema(
	{
		name: {
			type: LocaleSchema,
		},

		uris: {
			type: [String],
		},

		parents: {
			type: [
				{
					type: String,
					ref: "musical-genres",
				},
			],
		},
	},
	{ discriminatorKey: "type" }
)

MusicalGenresList.methods.setFields = function (body) {
	for (let field in ["name", "uris", "parents", ...List.getFields()]) {
		if (body[field]) this[field] = body[field]
	}
}

module.exports = List.discriminator("musical-genres", MusicalGenresList)
