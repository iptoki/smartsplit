const mongoose = require("mongoose")
const uuid = require("uuid").v4
const Errors = require("../errors")
const Product = require("../../models/payments/product")
const Address = require("../../models/payments/address")
const PromoCode = require("../../models/payments/promoCode")
const Workpiece = require("../../models/workpiece/workpiece")

const PurchaseSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			alias: "purchase_id",
			default: uuid,
		},
		workpiece_id: { type: String, alias: workpiece, ref: "Workpiece" },
		user_id: { type: String, ref: "User" },
		product: { type: String, ref: "Product" },
		promoCode: { type: String, ref: "PromoCode" },
		billingAddress: { type: String, ref: "Address" },
		creditsUsed: { type: Number, default: 0 },
		subtotal: { type: Number, default: 0 },
		gst: { type: Number, default: TaxRates.GST },
		pst: { type: Number, default: TaxRates.PST("QC") },
		payment_id: String,
		status: {
			type: String,
			enum: ["pending", "succeeded", "failed"],
			default: "pending",
		},
		purchaseDate: Date,
	},
	{ toJSON: { virtuals: true } }
)

PurchaseSchema.virtual("total").get(function () {
	return subtotal + subtotal * (this.gst + this.pst)
})

PurchaseSchema.methods.populateAll = async function () {
	await this.populate(["product", "promoCode", "billingAddress"]).execPopulate()
}

PurchaseSchema.methods.calculateSubtotal = async function () {
	if (
		[typeof product, typeof promoCode, typeof billingAddress].includes("string")
	)
		await this.populateAll()

	this.subtotal = Math.max(
		0,
		this.product.price -
			this.creditsUsed -
			(this.promoCode ? this.promoCode.value : 0)
	)
}

PurchaseSchema.statics.create = async function (data) {
	if (
		await Purchase.exists({
			workpiece_id: data.workpiece_id,
			product: data.productCode,
		})
	)
		throw Errors.ProductAlreadyPurchasedForWorkpiece

	const purchase = new Purchase(data)

	await purchase
		.populate(["product", "promoCode", "billingAddress", "workpiece"])
		.execPopulate()

	if (!purchase.product) throw Errors.ProductNotFound
	if (data.promoCode && !purchase.promoCode) throw Errors.PromoCodeNotFound
	if (!purchase.workpiece || purchase.workpiece.owner !== data.user_id)
		throw Errors.WorkpieceNotFound
	if (!purchase.billingAddress || purchase.billingAddress.user !== data.user_id)
		throw Errors.BillingAddressNotFound

	purchase.pst = TaxRates.PST(billingAddress.province)
	purchase.calculateSubtotal()

	return purchase
}

const Purchase = mongoose.model("Purchase", PurchaseSchema)
module.exports = Purchase
