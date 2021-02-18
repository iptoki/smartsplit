const mongoose = require("mongoose")
const Entity = require("./entity")
const LocaleSchema = require("./locale")
const EntityTypes = require("../../constants/entityTypes")
const { EntityNotFound } = require("../../routes/errors")

/**
 * Represents a ContentLanguage's entity in the system
 */
const ContentLanguageSchema = new mongoose.Schema(
	{
		name: {
			type: LocaleSchema,
		},
		altNames: {
			type: [String],
		},
	},
	{ discriminatorKey: "type" }
)

ContentLanguageSchema.methods.setFields = function (body) {
	for (let field of ["name", "altNames", ...Entity.getFields()]) {
		if (body[field]) this[field] = body[field]
	}
}

ContentLanguageSchema.statics.ensureExist = function (id) {
	return this.exists({ _id: id }).then((exist) => {
		if (!exist) return Promise.reject(Errors.EntityNotFound)
		else return Promise.resolve()
	})
}

module.exports = Entity.discriminator(
	EntityTypes.CONTENT_LANGUAGE,
	ContentLanguageSchema
)
