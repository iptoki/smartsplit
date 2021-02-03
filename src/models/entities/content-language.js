const mongoose = require("mongoose")
const Entity = require("./entity")
const EntityTypes = require("../../constants/entityTypes")
const LocaleSchema = require("./locale")

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

ContentLanguageSchema.methods.getFields = function () {
	return [...Entity.getFields(), "name", "altNames"]
}

ContentLanguageSchema.methods.setFields = function (body) {
	for (let field of this.getFields()) {
		if (body[field] !== undefined) this[field] = body[field]
	}
}

module.exports = Entity.discriminator(
	EntityTypes.CONTENT_LANGUAGE,
	ContentLanguageSchema
)
