const mongoose = require("mongoose")
const uuid = require("uuid").v4
const Errors = require("../errors")
const TaxRates = require("../constants/taxRates")
const Address = require("./address")
const Product = require("./product")
const Promo = require("./promo")
const Workpiece = require("./workpiece")

const PurchaseSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			alias: "purchase_id",
			default: uuid,
		},
		workpiece: { type: String, alias: "workpiece_id", ref: "Workpiece" },
		user: { type: String, alias: "user_id", ref: "User" },
		product: Product.schema,
		promo: Promo.schema,
		billingAddress: Address.schema,
		creditsUsed: { type: Number, default: 0 },
		subtotal: { type: Number, default: 0 },
		gst: { type: Number, default: TaxRates.GST },
		pst: { type: Number, default: TaxRates.PST("QC") },
		payment_id: String,
		status: {
			type: String,
			enum: ["pending", "succeeded", "failed", "canceled"],
			default: "pending",
		},
		purchaseDate: Date,
	},
	{ toJSON: { virtuals: true } }
)

PurchaseSchema.virtual("total").get(function () {
	return this.subtotal + this.subtotal * (this.gst + this.pst)
})

PurchaseSchema.methods.calculateSubtotal = async function () {
	this.subtotal = Math.max(
		0,
		this.product.price - this.creditsUsed - (this.promo ? this.promo.value : 0)
	)
}

PurchaseSchema.statics.create = async function (data) {
	const [
		isProductAlreadyPurchased,
		product,
		promo,
		billingAddress,
	] = await Promise.all([
		Purchase.exists({
			workpiece_id: data.workpiece_id,
			"product.code": data.productCode,
		}),
		Product.ensureExistsAndRetrieve(data.productCode),
		data.promoCode ? Promo.ensureExistsAndRetrieve(data.promoCode) : undefined,
		Address.ensureExistsAndRetrieve({
			_id: data.billingAddress_id,
			user_id: user._id,
		}),
		User.ensureExistsAndRetrieve({ _id: data.user_id }),
		Workpiece.ensureExistsAndRetrieve({
			_id: data.workpiece_id,
			owner: data.user_id,
		}),
	])

	if (isProductAlreadyPurchased)
		throw Errors.ProductAlreadyPurchasedForWorkpiece

	promo = promo.toObject()
	product = product.toObject()
	billingAddress = billingAddress.toObject()

	const purchase = new Purchase({ ...data, promo, product, billingAddress })
	purchase.pst = TaxRates.PST(billingAddress.province)
	purchase.calculateSubtotal()

	return purchase
}

const Purchase = mongoose.model("Purchase", PurchaseSchema)
module.exports = Purchase
