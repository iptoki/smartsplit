const mongoose = require('mongoose')
const Entity = require('./entity')
const LocaleSchema = require('../locale')
const EntityTypes = require('../../constants/entityTypes')
const { EntityNotFound } = require('../../errors')

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
	{ discriminatorKey: 'type' }
)

ContentLanguageSchema.methods.setFields = function (body) {
	for (let field of ['name', 'altNames', ...Entity.getFields()]) {
		if (body[field]) this[field] = body[field]
	}
}

module.exports = Entity.discriminator(
	EntityTypes.CONTENT_LANGUAGE,
	ContentLanguageSchema
)
