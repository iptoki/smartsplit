const mongoose = require("mongoose")
const localeSchema = require("./../locale")
const ProductCodes = require("../../constants/productCodes")

const ProductSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			alias: "code",
			enum: ProductCodes.list,
		},
		name: localeSchema,
		description: localeSchema,
		price: Number,
		isActive: { type: Boolean, default: true },
	},
	{ toJSON: { virtuals: true } }
)

ProductSchema.query.byActivity = function (isActive) {
	return this.where({ isActive })
}

module.exports = mongoose.model("Product", ProductSchema)
