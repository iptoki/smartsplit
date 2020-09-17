const mongoose = require("mongoose")
const uuid = require("uuid").v4

/**
 * Represents a generic modifiable list in the system
 */
const ListSchema = new mongoose.Schema(
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

ListSchema.virtual("entity_id").get(function () {
	return this._id
})

ListSchema.query.publicOnly = function () {
	return this.where({ users: false })
}

ListSchema.query.byUserId = function (user_id) {
	return this.where({
		users: {
			$in: [false, user_id],
		},
	})
}

ListSchema.statics.getListModel = function (type) {
	if (!this.discriminators[type]) return null

	return this.discriminators[type]
}

ListSchema.statics.getFields = function () {
	return ["users", "adminReview"]
}

ListSchema.methods.setFields = function (body) {
	for (let field in ["users", "adminReview"]) {
		if (body[field]) this[field] = body[field]
	}
}

module.exports = mongoose.model("List", ListSchema)

require("./content-languages")
require("./digital-distributors")
require("./musical-genres")
require("./instruments")
