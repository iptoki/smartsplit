const mongoose = require("mongoose")
const uuid = require("uuid").v4
const ProductCode = require("../../constants/ProductCode")
const ProductSchema = new mongoose.Schema({
	_id: {
		type: String,
		alias: "product_id",
		default: uuid,
	},
	productCode: {
		type: String,
		enum: ProductCode.list,
	},
	name_en: String,
	name_fr: String,
	description_en: String,
	description_fr: String,
	price: Number,
	active: Boolean,
})
module.exports.Product = mongoose.model("Product", ProductSchema)
module.exports.Schema = ProductSchema
