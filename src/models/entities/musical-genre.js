const mongoose = require("mongoose")
const Entity = require("./entity")
const EntityTypes = require("../../constants/entityTypes")
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
				ref: EntityTypes.MUSICAL_GENRE,
			},
		],
	},
	{ discriminatorKey: "type" }
)

MusicalGenreEntity.methods.getFields = function () {
	return [...Entity.getFields(), "name", "links", "langs", "parents"]
}
MusicalGenreEntity.methods.setFields = function (body) {
	for (let field of this.getFields()) {
		if (body[field] !== undefined) this[field] = body[field]
	}
}

module.exports = Entity.discriminator(
	EntityTypes.MUSICAL_GENRE,
	MusicalGenreEntity
)
