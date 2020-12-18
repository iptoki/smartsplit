const mongoose = require("mongoose")
const uuid = require("uuid").v4

/**
 * Represents a generic modifiable entity in the system
 */
const EntitySchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			alias: "entity_id",
			default: uuid,
		},

		users: {
			type: mongoose.Mixed,
		},

		adminReview: {
			type: String,
			default: null,
		},
	},
	{ discriminatorKey: "type", toJSON: { virtuals: true } }
)

EntitySchema.query.publicOnly = function () {
	return this.where({ users: false })
}

EntitySchema.query.byUserId = function (user_id) {
	return this.where({
		users: {
			$in: [false, user_id],
		},
	})
}

EntitySchema.statics.getEntityModel = function (type) {
	if (!this.discriminators[type]) return null

	return this.discriminators[type]
}

EntitySchema.statics.getFields = function () {
	return ["users", "adminReview"]
}

EntitySchema.methods.setFields = function (body) {
	for (let field in ["users", "adminReview"]) {
		if (body[field]) this[field] = body[field]
	}
}

module.exports = mongoose.model("Entity", EntitySchema)

require("./content-language")
require("./digital-distributor")
require("./musical-genre")
require("./instrument")
