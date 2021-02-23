const mongoose = require("mongoose")
const uuid = require("uuid").v4
const ProductSchema = require("./product").Schema
const AddressSchema = require("./address").Schema
const PromoCodeSchema = require("./promoCode").Schema
const PurchaseSchema = mongoose.Schema({
	_id: {
		type: String,
		alias: "purchase_id",
		default: uuid,
	},
	workpiece_id: {
		type: String,
		ref: "Workpiece",
	},
	user_id: {
		type: String,
		ref: "User",
	},
	product: ProductSchema,
	promoCode: PromoCodeSchema,
	billingAddress: AddressSchema,
	creditsUsed: Number,
	creditsValue: Number,
	subtotal: Number,
	gst: Number,
	pst: Number,
	total: Number,
	payment_id: String,
	status: {
		type: String,
		enum: ["pending" | "succeeded" | "failed"],
	},
	purchaseDate: Date,
})
module.exports = mongoose.model("Purchase", PurchaseSchema)
