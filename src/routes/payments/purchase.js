const Purchase = require("../../models/payments/purchase")
const PurchaseSchema = require("../../schemas/payments/purchase")
const Product = require("../../models/payments/product").Product
const Address = require("../../models/payments/address").Address
const PromoCode = require("../../models/payments/promoCode").PromoCode
const Workpiece = require("../../models/workpiece/workpiece")
const User = require("../../models/user")
const Errors = require("../errors")
const JWTAuth = require("../../service/JWTAuth")
const Stripe = require("stripe")
const Config = require("../../../config")
const TaxRates = require("../../constants/TaxRates")
/**** routes ***/

async function routes(fastify, options) {
	fastify.route({
		method: "GET",
		url: "/purchases/",
		schema: {
			tags: ["purchases"],
			description: "Get Purchases by logged in user",
			response: {
				200: { type: "array", items: PurchaseSchema.serialization.Purchase },
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: getPurchases,
	})
	fastify.route({
		method: "GET",
		url: "/purchases/:purchase_id",
		schema: {
			tags: ["purchases"],
			description: "Get Purchase by id",
			params: {
				purchase_id: {
					type: "string",
				},
			},
			response: {
				200: PurchaseSchema.serialization.Purchase,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: getPurchase,
	})
	fastify.route({
		method: "POST",
		url: "/purchases/",
		schema: {
			tags: ["purchases"],
			description: "Create new Purchase",
			params: {
				purchase_id: {
					type: "string",
				},
			},
			body: {
				allOf: [PurchaseSchema.validation.createUpdatePurchase],
				required: PurchaseSchema.validation.createUpdatePurchase.required,
			},
			response: {
				201: PurchaseSchema.serialization.PurchaseIntent,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: createPurchase,
	})
	fastify.route({
		method: "PATCH",
		url: "/purchases/:purchase_id",
		schema: {
			tags: ["purchases"],
			description: "Edit Purchase",
			params: {
				purchase_id: {
					type: "string",
				},
			},
			body: {
				anyOf: [PurchaseSchema.validation.createUpdatePurchase],
				required: PurchaseSchema.validation.createUpdatePurchase.required,
			},
			response: {
				201: PurchaseSchema.serialization.Purchase,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: updatePurchase,
	})
	fastify.route({
		method: "DELETE",
		url: "/purchases/:purchase_id",
		schema: {
			tags: ["purchases"],
			description: "delete (inactivate) a user's Purchase",
			params: {
				purchase_id: {
					type: "string",
				},
			},
			response: {
				202: PurchaseSchema.serialization.Purchase,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: deletePurchase,
	})
}

const getPurchases = async function (req, res) {
	const purchases = await Purchase.find().where({ user_id: req.authUser._id })
	return purchases
}

const getPurchase = async function (req, res) {
	const purchase = await Purchase.findById(req.params.purchase_id)

	if (!purchase) throw Errors.PurchaseNotFound
	if (purchase.user_id !== req.authUser._id) throw Errors.UnauthorizedUserAccess

	return purchase
}

const validatePurchase = async function (req, res) {
	// does the user have a billing address ?
	if (!req.authUser.payments.billingAddress) throw Errors.BillingAddressRequired

	// does product exist ?
	const product = await Product.findById(req.body.product_id)
	if (!product) throw Errors.ProductNotFound

	// promoCode is not required
	if (req.body.promoCode) {
		// does promo code exist ?
		const promoCode = await PromoCode.find({ code: req.body.promoCode })
		if (!promoCode) throw Errors.PromoCodeNotFound
	}

	// does workpiece exist
	const workpiece = await Workpiece.findById(req.body.workpiece_id)
	if (!workpiece) throw Errors.WorkpieceNotFound
	// check to make sure product's product_code has not already been purchased
	else if (workpiece.purchases) {
		if (workpiece.pruchases[product.productCode]) {
			throw Errors.ProductAlreadyPurchasedForWorkpiece
		}
	}

	//return our objects for processing
	return {
		product,
		promoCode,
	}
}

const createStripeCustomerForUser = async function (user) {
	const stripe = new Stripe(Config.stripe.apiKey)
	try {
		const customer = await stripe.customers.create()
		user.payments.stripe_id = customer.id
		await user.save()
		return user
	} catch (e) {
		//console.error(e)
		throw Errors.StripeCustomerCreateError
	}
}

const calculateSubtotalAndTaxes = function ({
	purchase,
	product,
	promoCode,
	creditsValue,
	user,
}) {
	let subtotal = product.price - promoCode.value - creditsValue
	if (subtotal < 0) subtotal = 0
	purchase.subtotal = subtotal
	if (subtotal > 0) {
		if (user.payments.billingAddress.country.toLowerCase() === "ca")
			purchase.gst = Math.round(purchase.subtotal * TaxRates.GST)
		if (user.payments.billingAddress.province.toLowerCase() === "qc")
			purchase.pst = Math.round(purchase.subtotal * TaxRates.QST)
	}
	purchase.total = purchase.subtotal + purchase.gst + purchase.pst
	return purchase
}

const createPurchase = async function (req, res) {
	// check if request is valid (will throw exceptions)
	const { promoCode, product } = await validatePurchase(req, res)

	// does user have a stripe customer id ? if not create one and save user
	let user
	if (!req.authUser.payments.stripe_id)
		user = await createStripeCustomerForUser(req.authUser)
	else user = req.authUser
	//ok we are all good let's calculate the subtotal

	req.body.user_id = user.id

	let purchase = new Purchase(req.body)

	// calculate subtotal, gst, pst, and total
	purchase = calculateSubtotalAndTaxes(
		purchase,
		product,
		promoCode,
		req.body.creditsValue,
		req.authUser
	)

	// now we call stripe to get a payment intent object
	const stripe = new Stripe(Config.stripe.apiKey)
	const paymentIntent = await stripe.paymentIntents.create({
		amount: purchase.total,
		currency: "cad",
		customer: user.payments.stripe_id,
	})
	purchase.payment_id = paymentIntent.id
	await purchase.save()

	res.code(201)

	/*
	   we return our own "PurchaseIntent" object, which will contain
	   the clientSecret necessary to use the card widget from the front end
	 */
	return {
		purchase,
		clientSecret: paymentIntent.client_secret,
	}
}

const updatePurchase = async function (req, res) {
	let purchaseToModify = await getPurchase(req, res)
	for (let field of ["name", "description", "price", "active", "purchaseCode"])
		if (req.body[field]) purchaseToModify[field] = req.body[field]
	await purchaseToModify.save()
	// if Purchase marked as active:false remove Purchase from user.payments.billingPurchase
	return purchaseToModify
}

const deletePurchase = async function (req, res) {
	/* delete only sets the active prop to inactive */
	let purchaseToModify = await getPurchase(req, res)
	purchaseToModify["active"] = false
	await purchaseToModify.save()
	return purchaseToModify
	// if Purchase is currently set in user.payment.billingPurchase, set billing Purchase to empty
}

module.exports = routes
