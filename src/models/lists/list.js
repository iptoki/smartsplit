const mongoose = require("mongoose")
const uuid = require("uuid").v4

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
			ref: "User"
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
		api: {
			type: "string",
			default: null,
			example: "this is an admin review"
		}
	}
})

module.exports = mongoose.model("List", ListSchema)
