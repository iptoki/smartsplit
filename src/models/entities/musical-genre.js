const mongoose = require("mongoose")
const Entity = require("./entity")
const LocaleSchema = require("./locale")

/**
 * Represents a musical genre entity in the system
 */
const MusicalGenreEntity = new mongoose.Schema(
	{
		name: String,
		links: [
			new mongoose.Schema(
				{
					name: String,
					id: String,
					uri: String,
				},
				{ _id: false }
			),
		],
		langs: LocaleSchema,
		parents: [
			{
				type: String,
				ref: "musical-genre",
			},
		],
	},
	{ discriminatorKey: "type" }
)

MusicalGenreEntity.methods.setFields = function (body) {
	for (let field in ["name", "uris", "parents", ...Entity.getFields()]) {
		if (body[field]) this[field] = body[field]
	}
}

module.exports = Entity.discriminator("musical-genre", MusicalGenreEntity)
