const mongoose = require("mongoose")
const Entity = require("./entity")
const LocaleSchema = require("./locale")

/**
 * Represents an entity of musical genres list in the system
 */
const MusicalGenresEntity = new mongoose.Schema(
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
					ref: "musical-genre",
				},
			],
		},
	},
	{ discriminatorKey: "type" }
)

MusicalGenresEntity.methods.setFields = function (body) {
	for (let field in ["name", "uris", "parents", ...Entity.getFields()]) {
		if (body[field]) this[field] = body[field]
	}
}

module.exports = Entity.discriminator("musical-genre", MusicalGenresEntity)
