const Purchase = require("../../models/payments/purchase")
const PurchaseSchema = require("../../schemas/payments/purchase")
const Errors = require("../errors")
const JWTAuth = require("../../service/JWTAuth")
const Stripe = require("../../service/stripe")
const TaxRates = require("../../constants/taxRates")
const { PaymentTemplates } = require("../models/notificationTemplates")
const { getUserWithAuthorization } = require("../users/users")

async function routes(fastify, options) {
	fastify.route({
		method: "GET",
		url: "/users/:user_id/purchases/",
		schema: {
			tags: ["purchases"],
			description: "Get user purchases",
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
			description: "Get a user purchase by id",
			params: {
				user_id: { type: "string" },
				purchase_id: { type: "string" },
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
			description: "Create a new Purchase",
			params: {
				user_id: { type: "string" },
			},
			body: {
				allOf: [PurchaseSchema.validation.createUpdatePurchase],
				required: ["workpiece_id", "productCode", "billingAddress_id"],
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
		url: "/users/:user_id/purchases/:purchase_id",
		schema: {
			tags: ["purchases"],
			description: "Edit Purchase",
			params: {
				user_id: { type: "string" },
				purchase_id: { type: "string" },
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
			description: "delete a user's purchase",
			params: {
				user_id: { type: "string" },
				purchase_id: { type: "string" },
			},
			response: {
				204: {},
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: deletePurchase,
	})

	fastify.route({
		method: "POST",
		url: "/purchases/stripe/event",
		schema: {
			tags: ["purchases"],
			description: "Stripe's webhook to receive event such as payment success",
			response: {
				200: {},
			},
		},
		handler: stripeEventHandler,
	})
}

const getPurchases = async function (req, res) {
	const user = await getUserWithAuthorization(req)
	return await Purchase.find({ user_id: user._id }).populate([
		"product",
		"promoCode",
		"billingAddress",
	])
}

const getPurchase = async function (req, res) {
	const user = await getUserWithAuthorization(req)
	const purchase = await Purchase.findOne({
		_id: req.params.purchase_id,
		user_id: user._id,
	}).populate(["product", "promoCode", "billingAddress"])
	if (!purchase) throw Errors.PurchaseNotFound
	return purchase
}

const createPurchase = async function (req, res) {
	const user = await getUserWithAuthorization(req)
	const purchase = await Purchase.create({ ...req.body, user_id: user._id })

	// does user have a stripe customer id ? if not create one
	if (!user.paymentInfo.stripe_id)
		user.paymentInfo.stripe_id = await Stripe.createCustomer(user._id)

	// now we call stripe to get a payment intent object
	const paymentIntent = await Stripe.createPaymentIntent(
		purchase.total,
		user.paymentInfo.stripe_id
	)

	purchase.payment_id = paymentIntent.id

	await Promise.all([purchase.save(), user.save()])

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
	const HTTPErrors = require("http-errors")
	throw new HTTPErrors.NotImplemented("Endpoint not implemented")
}

const deletePurchase = async function (req, res) {
	const HTTPErrors = require("http-errors")
	throw new HTTPErrors.NotImplemented("Endpoint not implemented")
}

const stripeEventHandler = async function (req, res) {
	Stripe.verifyEventSignature(
		req.body,
		req.headers["stripe-signature"],
		"whsec_txRlWnytXeWKViCRZnFLTJH7I5wMxtN1"
	)

	const event = req.body
	const paymentIntent = event.data.object
	const purchase = await Purchase.findOne({
		payment_id: paymentIntent.id,
	}).populateAll()

	if (event.type === "payment_intent.succeeded") {
		purchase.status = "succeeded"
		purchase.purchaseDate = Date.now()
		purchase.user.sendNotification(PaymentTemplates.PRODUCT_PURCHASE_INVOICE, {
			purchase,
		})
	} else if (event.type === "payment_intent.payment_failed")
		purchase.status = "failed"
	else if (event.type === "payment_intent.canceled")
		purchase.status = "canceled"

	await purchase.save()
	res.code(200).send()
}

module.exports = routes
