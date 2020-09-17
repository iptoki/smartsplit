const mongoose = require("mongoose")
const Entity = require("./entity")
const LocaleSchema = require("./locale")

/**
 * Represents an entity of distribution service providers in the system
 */
const DigitalDistributorsEntity = new mongoose.Schema(
	{
		name: {
			type: String,
		},

		icon: {
			type: String,
		},

		localizedName: {
			type: LocaleSchema,
		},

		domains: {
			type: [String],
		},

		markets: {
			type: [String],
		},

		streaming: {
			type: Boolean,
		},

		download: {
			type: Boolean,
		},

		other: {
			type: Boolean,
		},

		blockchain: {
			type: Boolean,
		},
	},
	{ discriminatorKey: "type" }
)

DigitalDistributorsEntity.methods.setFields = function (body) {
	const fields = [
		"name",
		"icon",
		"localizedName",
		"domains",
		"markets",
		"streaming",
		"download",
		"other",
		"blockchain",
	]
	for (let field in fields.concat(Entity.getFields())) {
		if (body[field]) this[field] = body[field]
	}
}

module.exports = Entity.discriminator(
	"digital-distributors",
	DigitalDistributorsEntity
)
