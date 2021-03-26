const mongoose = require('mongoose')
const uuid = require('uuid').v4

const AddressSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			alias: 'address_id',
			default: uuid,
		},
		user: {
			type: String,
			alias: 'user_id',
			ref: 'User',
		},
		street1: String,
		street2: String,
		city: String,
		province: String,
		postalCode: String,
		country: String,
	},
	{ toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

module.exports = mongoose.model('Address', AddressSchema)
