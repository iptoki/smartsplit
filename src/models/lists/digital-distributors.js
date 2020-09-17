const mongoose = require("mongoose")
const List = require("./list")
const LocaleSchema = require("./locale")

/**
 * Represents a list of distribution service providers in the system
 */
const DigitalDistributorsList = new mongoose.Schema(
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

DigitalDistributorsList.methods.setFields = function (body) {
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
	for (let field in fields.concat(List.getFields())) {
		if (body[field]) this[field] = body[field]
	}
}

module.exports = List.discriminator(
	"digital-distributors",
	DigitalDistributorsList
)
