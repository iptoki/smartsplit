const mongoose = require("mongoose")
const uuid = require("uuid").v4
const Products = require("./product").Product
const Addresses = require("./address").Address
const PromoCodes = require("./promoCode").PromoCode
const PurchaseSchema = mongoose.Schema(
	{
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
		product: { type: String, ref: "Product" },
		promoCode: { type: String, ref: "PromoCode" },
		billingAddress: { type: String, ref: "Address" },
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
	},
	{ toJSON: { virtuals: true } }
)
PurchaseSchema.methods.validate(workpiece_id, promoCode_id, product_id)
{
	Products.findById()
}

module.exports = mongoose.model("Purchase", PurchaseSchema)
