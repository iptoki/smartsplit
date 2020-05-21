const mongoose = require("mongoose")
const uuid = require("uuid").v4

const LISTE_TYPES = [

]


/**
 * Represents a generic modifiable list in the system
 */
const ListSchema = new mongoose.Schema({
	_id: {
		type: String,
		default: uuid,
		api: {
			type: "string",
			format: "uuid",
			example: "e87b56fe-1ce0-4ec7-8393-e18dc7415041",
			readOnly: true
		}
	},

	users: {
		type: [{
			type: String,
			ref: "User",
			select: false
		}],
		api: {
			oneOf: [
				{ const: "false" },
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
		select: false,
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
	return this.where({users: user_id})
}


ListSchema.statics.getListModel = async function(type) {
	if(!LISTE_TYPES.includes(type))
		throw new Error("Type `" + type + "` is not a valid list type")

	return LISTE_TYPES[type]
}


ListSchema.methods.setFields = async function(body) {
	for(let field in ["users", "adminReview"]) {
		if(body[field])
			this[field] = body[field]
	}
}

module.exports = mongoose.model("List", ListSchema)
