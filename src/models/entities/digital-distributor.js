const mongoose = require("mongoose")
const Entity = require("./entity")
const LocaleSchema = require("./locale")
const { EntityNotFound } = require("../../routes/errors")

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

DigitalDistributorEntity.statics.ensureExist = function (id) {
	return this.exists({ _id: id }).then((exist) => {
		if (!exist) return Promise.reject(Errors.EntityNotFound)
		else return Promise.resolve()
	})
}

module.exports = Entity.discriminator(
	"digital-distributor",
	DigitalDistributorEntity
)
