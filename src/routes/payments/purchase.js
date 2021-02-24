const Purchase = require("../../models/payments/purchase")
const PurchaseSchema = require("../../schemas/payments/purchase")
const Errors = require("../errors")
const JWTAuth = require("../../service/JWTAuth")

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
				201: PurchaseSchema.serialization.Purchase,
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

const createPurchase = async function (req, res) {
	req.body.user_id = req.authUser._id
	const purchase = new Purchase(req.body)
	await purchase.save()
	res.code(201)
	return purchase
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
