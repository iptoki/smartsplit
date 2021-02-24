const mongoose = require("mongoose")
const localeSchema = require("../entities/locale")
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
	name: localeSchema,
	description: localeSchema,
	price: Number,
	active: Boolean,
})
ProductSchema.query.getActive = function () {
	const now = new Date()

	return this.where({ active: true })
}
ProductSchema.query.getInactive = function () {
	const now = new Date()

	return this.where({ active: false })
}
module.exports.Product = mongoose.model("Product", ProductSchema)
module.exports.Schema = ProductSchema
