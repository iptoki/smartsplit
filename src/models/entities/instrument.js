const mongoose = require("mongoose")
const Entity = require("./entity")
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

InstrumentEntity.methods.setFields = function (body) {
	for (let field in ["name", "uris", "parents", ...Entity.getFields()]) {
		if (body[field]) this[field] = body[field]
	}
}

module.exports = Entity.discriminator("instrument", InstrumentEntity)
