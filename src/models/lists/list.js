const mongoose = require("mongoose")
const uuid     = require("uuid").v4


/**
 * Represents a generic modifiable list in the system
 */
const ListSchema = new mongoose.Schema({
	_id: {
		type: String,
		default: uuid,
		api: {
			type: "string",
			example: "e87b56fe-1ce0-4ec7-8393-e18dc7415041",
		}
	},

	users: {
		type: mongoose.Mixed,
		api: {
			oneOf: [
				{ const: false },
				{
					type: "array",
					items: {
						type: "string",
						format: "uuid",
						example: ["e87b56fe-1ce0-4ec7-8393-e18dc7415041", "e90b56dc-1fe0-4ef7-2354-f18dc7415948"],
					}
				}
			]
		}
	},

	adminReview: {
		type: String,
		default: null,
		api: {
			type: "string",
			default: null,
			example: "this is an admin review"
		}
	}
}, {discriminatorKey: "type"})


ListSchema.query.publicOnly = function() {
	return this.where({users: false})
}


ListSchema.query.byUserId = function(user_id) {
	return this.where({users: {
		$in: [false, user_id]
	}})
}

ListSchema.statics.getListModel = function(type) {
	if(!this.discriminators[type])
		return null

	return this.discriminators[type]
}

ListSchema.statics.getFields = function() {
	return ["users", "adminReview"]
}


ListSchema.methods.setFields = function(body) {
	for(let field in ["users", "adminReview"]) {
		if(body[field])
			this[field] = body[field]
	}
}

module.exports = mongoose.model("List", ListSchema)

require("./content-languages")
require("./digital-distributors")
