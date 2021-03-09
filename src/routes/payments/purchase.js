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
const { getUserWithAuthorization } = require("../users/users")


/**** routes ***/

async function routes(fastify, options) {
	fastify.route({
		method: "GET",
		url: "/users/:user_id/purchases/",
		schema: {
			tags: ["purchases"],
			description: "Get Purchases by logged in user",
			params: {
				user_id: { type: "string" },
			},
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
		url: "/users/:user_id/purchases/:purchase_id",
		schema: {
			tags: ["purchases"],
			description: "Get Purchase by id",
			params: {
				user_id: { type: "string" },
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
		url: "/users/:user_id/purchases/",
		schema: {
			tags: ["purchases"],
			description: "Create new Purchase",
			params: {
				user_id: { type: "string" },
			},
			body: PurchaseSchema.validation.createUpdatePurchase,
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
		url: "/users/:user_id/purchases/:purchase_id",
		schema: {
			tags: ["purchases"],
			description: "Edit Purchase",
			params: {
				user_id: {
					type: "string",
				},
				purchase_id: {
					type: "string",
				},
			},
			body: PurchaseSchema.validation.createUpdatePurchase,
			response: {
				200: PurchaseSchema.serialization.Purchase,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: updatePurchase,
	})
	fastify.route({
		method: "DELETE",
		url: "/users/:user_id/purchases/:purchase_id",
		schema: {
			tags: ["purchases"],
			description: "delete a user's Purchase",
			params: {
				user_id: { type: "string" },
				purchase_id: {
					type: "string",
				},
			},
			response: {
				204: {},
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: deletePurchase,
	})
}

const getPurchases = async function (req, res) {
	const user = await getUserWithAuthorization(req, res)
	const purchases = await Purchase.find({ user_id: user._id })
	let promises = purchases.map((purchase) =>
		purchase.populate(["product", "promoCode", "billingAddress"]).execPopulate()
	)
	await Promise.all(promises)
	return purchases
}

const getPurchase = async function (req, res) {
	const user = await getUserWithAuthorization(req, res)
	const purchase = await Purchase.findById(req.params.purchase_id).populate([
		"product",
		"promoCode",
		"billingAddress",
	])

	if (!purchase) throw Errors.PurchaseNotFound
	if (purchase.user_id !== user._id) throw Errors.UnauthorizedUserAccess
	return purchase
}

const validatePurchase = async function (req, res) {
	// does the user have a billing address ?
	const user = await getUserWithAuthorization(req, res)
	await user.populate("paymentInfo.billingAddress").execPopulate()
	if (!user.paymentInfo.billingAddress) throw Errors.BillingAddressRequired

	// does product exist ?
	const product = await Product.findById(req.body.product)
	if (!product) throw Errors.ProductNotFound

	// promoCode is not required
	let promoCode = false
	if (req.body.promoCode) {
		// does promo code exist ?
		promoCode = await PromoCode.findById(req.body.promoCode)
		console.log(promoCode)
		if (!promoCode) throw Errors.PromoCodeNotFound
	}

	// does workpiece exist
	const workpiece = await Workpiece.findById(req.body.workpiece_id)
	if (!workpiece) throw Errors.WorkpieceNotFound
	// check to make sure product's product_code has not already been purchased
	else if (workpiece.purchases) {
		if (workpiece.purchases[product.productCode]) {
			throw Errors.ProductAlreadyPurchasedForWorkpiece
		}
	}

	//return our objects for processing
	return {
		user,
		product,
		promoCode,
	}
}

const createStripeCustomerForUser = async function (user) {
	const stripe = new Stripe(Config.stripe.apiKey)
	try {
		const customer = await stripe.customers.create()
		console.log(customer)
		user.paymentInfo.stripe_id = customer.id
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
	console.log(purchase)
	let subtotal =
		product.price -
		(promoCode ? promoCode.value : 0) -
		(creditsValue ? creditsValue : 0)
	if (subtotal < 0) subtotal = 0
	purchase.subtotal = subtotal
	purchase.gst = 0
	purchase.pst = 0
	if (subtotal > 0) {
		if (user.paymentInfo.billingAddress.country.toUpperCase() === "CA")
			purchase.gst = Math.round(purchase.subtotal * TaxRates.GST)
		if (user.paymentInfo.billingAddress.province.toUpperCase() === "PQ")
			purchase.pst = Math.round(purchase.subtotal * TaxRates.QST)
	}
	purchase.total = purchase.subtotal + purchase.gst + purchase.pst
	return purchase
}

const createPurchase = async function (req, res) {
	// check if request is valid (will throw exceptions)
	let { user, promoCode, product } = await validatePurchase(req, res)

	// does user have a stripe customer id ? if not create one and save user

	if (!user.paymentInfo.stripe_id)
		user = await createStripeCustomerForUser(user)
	//ok we are all good let's calculate the subtotal

	req.body.user_id = user._id

	let purchase = new Purchase(req.body)

	// calculate subtotal, gst, pst, and total
	purchase = calculateSubtotalAndTaxes({
		purchase,
		product,
		promoCode,
		creditsValue: req.body.creditsValue,
		user,
	})
	console.log(purchase)
	// now we call stripe to get a payment intent object
	const stripe = new Stripe(Config.stripe.apiKey)
	const paymentIntent = await stripe.paymentIntents.create({
		amount: purchase.total,
		currency: "cad",
		customer: user.paymentInfo.stripe_id,
	})
	purchase.payment_id = paymentIntent.id
	await purchase.save()
	if (promoCode) {
		promoCode.purchase_id = purchase.purchase_id
		await promoCode.save()
	}

	await purchase
		.populate(["product", "promoCode", "billingAddress"])
		.execPopulate()
	//	await purchase.populate("promoCode").execPopulate()
	//	await purchase.populate("billingAddress").execPopulate()

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
	for (let field of ["status"])
		if (req.body[field]) purchaseToModify[field] = req.body[field]
	if (req.body["status"] === "succeeded")
		purchaseToModify["datePurchased"] = new Date().toISOString()
	await purchaseToModify.save()

	return purchaseToModify
}

const deletePurchase = async function (req, res) {
	/* delete only sets the active prop to inactive */
	let purchaseToDelete = await getPurchase(req, res)
	if (purchaseToDelete.promoCode && purchaseToDelete.promoCode.promo_id) {
		const promoCode = await PromoCode.findById(
			purchaseToDelete.promoCode.promo_id
		)
		promoCode.purchase_id = ""
		promoCode.save()
	}
	await Purchase.deleteOne({ promo_id: purchaseToDelete.promo_id })
	return { deleted: true }
}

module.exports = routes
