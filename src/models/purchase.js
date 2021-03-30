const mongoose = require('mongoose')
const uuid = require('uuid').v4
const Errors = require('../errors')
const TaxRates = require('../constants/taxRates')
const Address = require('./address')
const Product = require('./product')
const User = require('./user')
const Promo = require('./promo')
const Workpiece = require('./workpiece')

const PurchaseSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			alias: 'purchase_id',
			default: uuid,
		},
		workpiece: { type: String, alias: 'workpiece_id', ref: 'Workpiece' },
		user: { type: String, alias: 'user_id', ref: 'User' },
		product: Product.schema,
		promo: Promo.schema,
		billingAddress: Address.schema,
		creditsUsed: { type: Number, default: 0 },
		subtotal: { type: Number, default: 0 },
		gst: { type: Number, default: 0 },
		pst: { type: Number, default: 0 },
		payment_id: String,
		status: {
			type: String,
			enum: ['pending', 'succeeded', 'failed', 'canceled'],
			default: 'pending',
		},
		purchaseDate: Date,
	},
	{ toJSON: { virtuals: true } }
)

PurchaseSchema.virtual('total').get(function () {
	return this.subtotal + this.subtotal * (this.gst + this.pst)
})

PurchaseSchema.virtual('totalGST').get(function () {
	return this.subtotal * this.gst
})

PurchaseSchema.virtual('totalPST').get(function () {
	return this.subtotal * this.pst
})

PurchaseSchema.virtual('totalTaxes').get(function () {
	return this.subtotal * (this.gst + this.pst)
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
			'product.code': data.productCode,
		}),
		Product.ensureExistsAndRetrieve({
			productCode: data.productCode,
			active: true,
		}),
		data.promoCode ? Promo.ensureExistsAndRetrieve(data.promoCode) : undefined,
		Address.ensureExistsAndRetrieve({
			_id: data.billingAddress_id,
			user_id: data.user_id,
		}),
		User.ensureExistsAndRetrieve(data.user_id),
		Workpiece.ensureExistsAndRetrieve({
			_id: data.workpiece_id,
			owner: data.user_id,
		}),
	])

	if (isProductAlreadyPurchased)
		throw Errors.ProductAlreadyPurchasedForWorkpiece

	const purchase = new Purchase(data)

	purchase.promo = promo ? promo.toObject() : undefined
	purchase.product = product.toObject()
	purchase.billingAddress = billingAddress.toObject()

	if (billingAddress.country === 'CA') {
		purchase.gst = TaxRates.GST
		purchase.pst = TaxRates.PST(billingAddress.province)
	}
	purchase.calculateSubtotal()

	return purchase
}

const Purchase = mongoose.model('Purchase', PurchaseSchema)
module.exports = Purchase
