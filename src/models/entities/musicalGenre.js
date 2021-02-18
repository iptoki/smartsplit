const mongoose = require("mongoose")
const Entity = require("./entity")
const LocaleSchema = require("./locale")
const EntityTypes = require("../../constants/entityTypes")
const { EntityNotFound } = require("../../routes/errors")

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

MusicalGenreEntity.methods.setFields = function (body) {
	for (let field in ["name", "uris", "parents", ...Entity.getFields()]) {
		if (body[field]) this[field] = body[field]
	}
}

MusicalGenreEntity.statics.ensureExist = function (id) {
	return this.exists({ _id: id }).then((exist) => {
		if (!exist) return Promise.reject(Errors.EntityNotFound)
		else return Promise.resolve()
	})
}

module.exports = Entity.discriminator(
	EntityTypes.MUSICAL_GENRE,
	MusicalGenreEntity
)
