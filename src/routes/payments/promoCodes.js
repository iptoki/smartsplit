const PromoCode = require("../../models/payments/promoCode")
const PromoCodeSchema = require("../../schemas/payments/promoCodes")
const { PromoCodeNotFound } = require("../errors")
const JWTAuth = require("../../service/JWTAuth")

async function routes(fastify, options) {
	fastify.route({
		method: "GET",
		url: "/promoCodes/",
		schema: {
			tags: ["promoCodes"],
			description: "Get all PromoCodes",
			response: {
				200: { type: "array", items: PromoCodeSchema.serialization.promoCode },
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
			description: "Get PromoCode by ID",
			params: {
				promoCode_id: { type: "string" },
			},
			response: {
				200: PromoCodeSchema.serialization.promoCode,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthAdmin,
		handler: getPromoCode,
	})

	fastify.route({
		method: "GET",
		url: "/promoCodes/code/:code",
		schema: {
			tags: ["promoCodes"],
			description: "Get PromoCode by code",
			params: {
				code: { type: "string" },
			},
			response: {
				200: PromoCodeSchema.serialization.promoCode,
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
				201: PromoCodeSchema.serialization.promoCode,
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
			description: "Update a PromoCode by ID",
			params: {
				promoCode_id: { type: "string" },
			},
			body: PromoCodeSchema.validation.createUpdatePromoCode,
			response: {
				200: PromoCodeSchema.serialization.promoCode,
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
			description: "delete a PromoCode by ID",
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
	return await PromoCode.find()
}

const getPromoCode = async function (req, res) {
	const promoCode = await PromoCode.findById(req.params.promoCode_id)
	if (!promoCode) throw PromoCodeNotFound
	return promoCode
}

const getPromoByCode = async function (req, res) {
	const promoCode = await PromoCode.findOne({ code: req.params.code })
	if (!promoCode) throw PromoCodeNotFound
	return promoCode
}

const createPromoCode = async function (req, res) {
	const promoCode = new PromoCode(req.body)
	await promoCode.save()
	res.code(201)
	return promoCode
}

const updatePromoCode = async function (req, res) {
	const promoCode = await getPromoCode(req, res)
	if (!promoCode) throw PromoCodeNotFound
	await promoCode.update(req.body)
	return promoCode
}

const deletePromoCode = async function (req, res) {
	const { deletedCount } = await PromoCode.deleteOne({
		_id: req.params.promoCode_id,
	})
	if (deletedCount !== 1) throw PromoCodeNotFound
	res.code(204).send()
}

module.exports = routes
