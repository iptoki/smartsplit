const mongoose = require("mongoose")
const Entity = require("./entity")
const EntityTypes = require("../../constants/entityTypes")
const LocaleSchema = require("./locale")

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

InstrumentEntity.methods.getFields = function () {
	return [...Entity.getFields(), "name", "links", "langs"]
}
InstrumentEntity.methods.setFields = function (body) {
	for (let field of this.getFields()) {
		if (body[field] !== undefined) this[field] = body[field]
	}
}

module.exports = Entity.discriminator(EntityTypes.INSTRUMENT, InstrumentEntity)
