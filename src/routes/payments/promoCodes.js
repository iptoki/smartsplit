const PromoCode = require("../../models/payments/promoCode").PromoCode
const Purchase = require("../../models/payments/purchase")
const PromoCodeSchema = require("../../schemas/payments/promoCode")
const Errors = require("../errors")
const JWTAuth = require("../../service/JWTAuth")

async function routes(fastify, options) {
	fastify.route({
		method: "GET",
		url: "/promoCodes/",
		schema: {
			tags: ["promoCodes"],
			description: "Get PromoCodes",
			response: {
				200: { type: "array", items: PromoCodeSchema.serialization.PromoCode },
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthAdmin,
		handler: getPromoCodes,
	})

	fastify.route({
		method: "GET",
		url: "/promoCodes/:promoCode_id",
		schema: {
			tags: ["promoCodes"],
			description: "Get PromoCode by id",
			params: {
				promoCode_id: { type: "string" },
			},
			response: {
				200: PromoCodeSchema.serialization.PromoCode,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthAdmin,
		handler: getPromoCode,
	})

	fastify.route({
		method: "GET",
		url: "/promoCodes/byCode/:code",
		schema: {
			tags: ["promoCodes"],
			description: "Get PromoCode by id",
			params: {
				code: { type: "string" },
			},
			response: {
				200: PromoCodeSchema.serialization.PromoCode,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthAdmin,
		handler: getPromoByCode,
	})

	fastify.route({
		method: "POST",
		url: "/promoCodes/",
		schema: {
			tags: ["promoCodes"],
			description: "Create new PromoCode",
			body: PromoCodeSchema.validation.createUpdatePromoCode,
			response: {
				201: PromoCodeSchema.serialization.PromoCode,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthAdmin,
		handler: createPromoCode,
	})

	fastify.route({
		method: "PATCH",
		url: "/promoCodes/:promoCode_id",
		schema: {
			tags: ["promoCodes"],
			description: "Edit PromoCode",
			params: {
				promoCode_id: { type: "string" },
			},
			body: PromoCodeSchema.validation.createUpdatePromoCode,
			response: {
				201: PromoCodeSchema.serialization.PromoCode,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthAdmin,
		handler: updatePromoCode,
	})

	fastify.route({
		method: "DELETE",
		url: "/promoCodes/:promoCode_id",
		schema: {
			tags: ["promoCodes"],
			description: "delete (inactivate) a user's PromoCode",
			params: {
				promoCode_id: { type: "string" },
			},
			response: {
				204: {},
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthAdmin,
		handler: deletePromoCode,
	})
}

const getPromoCodes = async function (req, res) {
	let PromoCodes

	if (req.query.active === true) {
		PromoCodes = await PromoCode.find()
			.getActive()
			.skip(parseInt(req.query.skip))
			.limit(parseInt(req.query.limit))
	} else if (req.query.active === false) {
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
	const promoCode = await PromoCode.findOne({ code: req.params.code })

	if (!promoCode) throw Errors.PromoCodeNotFound

	return promoCode
}

const createPromoCode = async function (req, res) {
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
		if (req.body[field] !== undefined)
			promoCodeToModify[field] = req.body[field]
	await promoCodeToModify.save()

	return promoCodeToModify
}

const deletePromoCode = async function (req, res) {
	let promoCode = await getPromoCode(req, res)
	if (promoCode.purchase_id) throw Errors.PromoCodeImmutable
	await promoCode.remove()
	res.code(204).send()
}

module.exports = routes
