const mongoose     = require("mongoose")
const List         = require("./list")
const LocaleSchema = require("./locale")

/**
 * Represents a generic modifiable list in the system
 */
const contentLangsListSchema = new mongoose.Schema({
	name: LocaleSchema,
	altNames: {
		type: [String],
		api: {
			type: "array",
			items: {
				type: "string"
			}
		}
	}
}, {discriminatorKey: "type"})


contentLangsListSchema.methods.setFields = function(body) {
	for(let field in ["name", "altNames", ...List.getFields()]) {
		if(body[field])
			this[field] = body[field]
	}
}

module.exports = List.discriminator("contentLangs", contentLangsListSchema)
