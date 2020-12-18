const mongoose = require("mongoose")
const Entity = require("./entity")
const LocaleSchema = require("./locale")

/**
 * Represents a generic modifiable list in the system
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

// ContentLanguageSchema.virtual("entity_id").get(function () {
// 	return this._id
// })

ContentLanguageSchema.methods.setFields = function (body) {
	for (let field of ["name", "altNames", ...Entity.getFields()]) {
		if (body[field]) this[field] = body[field]
	}
}

module.exports = Entity.discriminator(
	"content-language",
	ContentLanguageSchema
)
