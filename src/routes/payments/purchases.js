const Purchase = require("../../models/payments/purchase")
const PurchaseSchema = require("../../schemas/payments/purchase")
const Errors = require("../errors")
const JWTAuth = require("../../service/JWTAuth")
const Stripe = require("../../service/stripe")
const Config = require("../../config")
const TaxRates = require("../../constants/taxRates")
const { getUserWithAuthorization } = require("../users/users")
const { sendTemplateTo } = require("../../utils/email")

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
		user.paymentInfo.stripe_id = await Stripe.getNewStripeCustomerId()

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
	const user = await getUserWithAuthorization(req)
	let purchaseToModify = await getPurchase(req, res)
	let success = req.body["status"] === "succeeded"
	for (let field of ["status"])
		if (req.body[field]) purchaseToModify[field] = req.body[field]
	if (success) purchaseToModify["datePurchased"] = new Date().toISOString()
	await purchaseToModify.save()
	if (success) {
		await sendInvoice(user, purchaseToModify)
	}

	return purchaseToModify
}

const sendInvoice = async function (user, purchaseModel) {
	const purchase = purchaseModel.toObject()
	// function to
	const convertToMoney = function (intMoney) {
		return (parseInt(intMoney) / 100).toFixed(2)
	}
	const templateId =
		user.locale === "fr"
			? "d-e69abd3436c2420aa3270f27150a3b8f"
			: "d-1ed3ad6394ca44cb9c42152f8bc29fa0"
	const workpiece = await Workpiece.findById(purchase.workpiece_id)
	let data = {
		purchase: {
			purchase_id: purchase._id,
			subtotal: convertToMoney(purchase.subtotal),
			total: convertToMoney(purchase.total),
			gst: convertToMoney(purchase.gst),
			pst: convertToMoney(purchase.pst),
			creditsUsed: purchase.creditsUsed,
			creditsValue: convertToMoney(purchase.creditsValue),
		},
		workpiece: {
			title: workpiece.title,
		},
		product: {
			...purchase.product,
			price: convertToMoney(purchase.product.price),
		},
		promoCode: purchase.promoCode
			? {
					...purchase.promoCode,
					value: convertToMoney(purchase.promoCode.value),
			  }
			: null,
		billingAddress: { ...purchase.billingAddress },
		subscriptionUrl: "{{{subscribtion_preferences}}}",
	}
	await sendTemplateTo(templateId, user, {}, data)
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
