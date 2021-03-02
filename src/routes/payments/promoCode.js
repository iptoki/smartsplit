const PromoCode = require("../../models/payments/promoCode").PromoCode
const Purchase = require("../../models/payments/purchase")
const PromoCodeSchema = require("../../schemas/payments/promoCode")
const Errors = require("../errors")
const JWTAuth = require("../../service/JWTAuth")

/**** routes ***/

async function routes(fastify, options) {
	fastify.route({
		method: "GET",
		url: "/promoCodes/",
		schema: {
			tags: ["promoCodes"],
			description: "Get PromoCodes by logged in user",
			response: {
				200: { type: "array", items: PromoCodeSchema.serialization.PromoCode },
			},
			security: [{ bearerAuth: [] }],
		},
		params: {},
		querystring: {
			filter: { type: "string" },
			limit: {
				type: "integer",
				default: 50,
				minimum: 1,
				maximum: 250,
			},
			skip: {
				type: "integer",
				default: 0,
				minimum: 0,
			},
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: getPromoCodes,
	})
	fastify.route({
		method: "GET",
		url: "/promoCodes/:promoCode_id",
		schema: {
			tags: ["promoCodes"],
			description: "Get PromoCode by id",
			params: {
				promoCode_id: {
					type: "string",
				},
			},
			response: {
				200: PromoCodeSchema.serialization.PromoCode,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: getPromoCode,
	})
	fastify.route({
		method: "GET",
		url: "/promoCodes/byCode/:code",
		schema: {
			tags: ["promoCodes"],
			description: "Get PromoCode by id",
			params: {
				code: {
					type: "string",
				},
			},
			response: {
				200: PromoCodeSchema.serialization.PromoCode,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: getPromoByCode,
	})
	fastify.route({
		method: "POST",
		url: "/promoCodes/",
		schema: {
			tags: ["promoCodes"],
			description: "Create new PromoCode",
			body: {
				allOf: [PromoCodeSchema.validation.createUpdatePromoCode],
				required: PromoCodeSchema.validation.createUpdatePromoCode.required,
			},
			response: {
				201: PromoCodeSchema.serialization.PromoCode,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: createPromoCode,
	})
	fastify.route({
		method: "PATCH",
		url: "/promoCodes/:promoCode_id",
		schema: {
			tags: ["promoCodes"],
			description: "Edit PromoCode",
			params: {
				promoCode_id: {
					type: "string",
				},
			},
			body: {
				anyOf: [PromoCodeSchema.validation.createUpdatePromoCode],
				required: PromoCodeSchema.validation.createUpdatePromoCode.required,
			},
			response: {
				201: PromoCodeSchema.serialization.PromoCode,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: updatePromoCode,
	})
	fastify.route({
		method: "DELETE",
		url: "/promoCodes/:promoCode_id",
		schema: {
			tags: ["promoCodes"],
			description: "delete (inactivate) a user's PromoCode",
			params: {
				promoCode_id: {
					type: "string",
				},
			},
			response: {
				202: PromoCodeSchema.serialization.PromoCode,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: deletePromoCode,
	})
}

const getPromoCodes = async function (req, res) {
	let PromoCodes

	if (req.query.filter === "active") {
		PromoCodes = await PromoCode.find()
			.getActive()
			.skip(parseInt(req.query.skip))
			.limit(parseInt(req.query.limit))
	} else if (req.query.filter === "inactive") {
		PromoCodes = await PromoCode.find()
			.getInactive()
			.skip(parseInt(req.query.skip))
			.limit(parseInt(req.query.limit))
	} else {
		PromoCodes = await PromoCode.find()
			.skip(parseInt(req.query.skip))
			.limit(parseInt(req.query.limit))
	}
	return PromoCodes
}

const getPromoCode = async function (req, res) {
	const promoCode = await PromoCode.findById(req.params.promoCode_id)

	if (!promoCode) throw Errors.PromoCodeNotFound

	return promoCode
}

const getPromoByCode = async function (req, res) {
	console.log(req.params.code)
	const promoCode = await PromoCode.where({ code: req.params.code }).findOne()
	console.log(promoCode)
	if (!promoCode) throw Errors.PromoCodeNotFound
	console.log(promoCode)
	return promoCode
}

const createPromoCode = async function (req, res) {
	req.body.user_id = req.authUser._id
	const promoCode = new PromoCode(req.body)
	await promoCode.save()
	res.code(201)
	return promoCode
}

const updatePromoCode = async function (req, res) {
	let promoCodeToModify = await getPromoCode(req, res)
	if (promoCodeToModify.purchase_id) throw Errors.PromoCodeImmutable
	// check and see if PromoCode occurs in any purchase
	// if purchase with PromoCode exists
	// throw Errors.PromoCodeNotModifiable
	// else modify PromoCode
	for (let field of [
		"organization",
		"description",
		"value",
		"expires",
		"purchase_id",
	])
		if (req.body[field]) promoCodeToModify[field] = req.body[field]
	await promoCodeToModify.save()
	// if PromoCode marked as active:false remove PromoCode from user.payments.billingPromoCode
	return promoCodeToModify
}

const deletePromoCode = async function (req, res) {
	let promoCode = await getPromoCode(req, res)
	if (promoCode.purchase_id) throw Errors.PromoCodeImmutable
	await promoCode.remove()
	res.code(204).send()
	// if PromoCode is currently set in user.payment.billingPromoCode, set billing PromoCode to empty
}

module.exports = routes
