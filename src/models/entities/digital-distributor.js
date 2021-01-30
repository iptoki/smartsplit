const mongoose = require("mongoose")
const Entity = require("./entity")
const EntityTypes = require("../../constants/entityTypes")
const LocaleSchema = require("./locale")

/**
 * Represents an entity of distribution service provider in the system
 */
const DigitalDistributorEntity = new mongoose.Schema(
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

DigitalDistributorEntity.methods.getFields = function () {
	return [
		...Entity.getFields(),
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
}
DigitalDistributorEntity.methods.setFields = function (body) {
	for (let field of this.getFields()) {
		if (body[field] !== undefined) this[field] = body[field]
	}
}

module.exports = Entity.discriminator(
	EntityTypes.DIGITAL_DISTRIBUTOR,
	DigitalDistributorEntity
)
