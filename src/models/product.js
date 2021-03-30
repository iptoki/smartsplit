const mongoose = require('mongoose')
const localeSchema = require('./locale')
const ProductCodes = require('../constants/productCodes')

const ProductSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			alias: 'product_id',
		},
		name: localeSchema,
		description: localeSchema,
		price: Number,
	},
	{ toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

module.exports = mongoose.model('Product', ProductSchema)
