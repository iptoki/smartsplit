const mongoose = require("mongoose")
const Entity = require("./entity")
const LocaleSchema = require("../locale")
const EntityTypes = require("../../constants/entityTypes")
const { EntityNotFound } = require("../../errors")

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

DigitalDistributorEntity.methods.setFields = function (body) {
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
	EntityTypes.DIGITAL_DISTRIBUTOR,
	DigitalDistributorEntity
)
