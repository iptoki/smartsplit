const mongoose = require("mongoose")
const Entity = require("./entity")
const LocaleSchema = require("./locale")
const EntityTypes = require("../../constants/entityTypes")
const { EntityNotFound } = require("../../routes/errors")

/**
 * Represents an instrument's entity in the system
 */
const InstrumentEntity = new mongoose.Schema(
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
	},
	{ discriminatorKey: "type" }
)

InstrumentEntity.methods.setFields = function (body) {
	for (let field in ["name", "uris", "parents", ...Entity.getFields()]) {
		if (body[field]) this[field] = body[field]
	}
}

InstrumentEntity.statics.ensureExist = function (id) {
	return this.exists({ _id: id }).then((exist) => {
		if (!exist) return Promise.reject(Errors.EntityNotFound)
		else return Promise.resolve()
	})
}

module.exports = Entity.discriminator(EntityTypes.INSTRUMENT, InstrumentEntity)
