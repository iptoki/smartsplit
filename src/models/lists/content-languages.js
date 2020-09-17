const mongoose = require("mongoose")
const Entity = require("./entity")
const LocaleSchema = require("./locale")

/**
 * Represents a generic modifiable list in the system
 */
const contentLanguagesEntity = new mongoose.Schema(
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

contentLanguagesEntity.methods.setFields = function (body) {
	for (let field of ["name", "altNames", ...Entity.getFields()]) {
		if (body[field]) this[field] = body[field]
	}
}

module.exports = Entity.discriminator(
	"content-languages",
	contentLanguagesEntity
)
