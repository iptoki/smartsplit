const mongoose = require("mongoose")
const uuid = require("uuid").v4
const AddressSchema = new mongoose.Schema({
	_id: {
		type: String,
		alias: "address_id",
		default: uuid,
	},
	user_id: {
		type: String,
		ref: "User",
	},
	street1: String,
	street2: String,
	city: String,
	province: String,
	country: String,
})
AddressSchema.query.byOwner = function (user_id) {
	return this.where({ user_id: user_id })
}
module.exports.Address = mongoose.model("Address", AddressSchema)
module.exports.Schema = AddressSchema
