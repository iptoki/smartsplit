const Promo = require('../models/promo')
const PromoSchema = require('../schemas/promos')
const { PromoNotFound } = require('../errors')
const JWTAuth = require('../service/JWTAuth')

async function routes(fastify, options) {
	fastify.route({
		method: 'GET',
		url: '/promos/',
		schema: {
			tags: ['promos'],
			description: 'Get all Promos',
			response: {
				200: { type: 'array', items: PromoSchema.serialization.promo },
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthAdmin,
		handler: getPromos,
	})

	fastify.route({
		method: 'GET',
		url: '/promos/:code',
		schema: {
			tags: ['promos'],
			description: 'Get Promo by ID',
			params: {
				code: { type: 'string' },
			},
			response: {
				200: PromoSchema.serialization.promo,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthAdmin,
		handler: getPromo,
	})

	fastify.route({
		method: 'GET',
		url: '/promos/code/:code',
		schema: {
			tags: ['promos'],
			description: 'Get Promo by code',
			params: {
				code: { type: 'string' },
			},
			response: {
				200: PromoSchema.serialization.promo,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthAdmin,
		handler: getPromoByCode,
	})

	fastify.route({
		method: 'POST',
		url: '/promos/',
		schema: {
			tags: ['promos'],
			description: 'Create new Promo',
			body: PromoSchema.validation.createUpdatePromo,
			response: {
				201: PromoSchema.serialization.promo,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthAdmin,
		handler: createPromo,
	})

	fastify.route({
		method: 'PATCH',
		url: '/promos/:code',
		schema: {
			tags: ['promos'],
			description: 'Update a Promo by ID',
			params: {
				code: { type: 'string' },
			},
			body: PromoSchema.validation.createUpdatePromo,
			response: {
				200: PromoSchema.serialization.promo,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthAdmin,
		handler: updatePromo,
	})

	fastify.route({
		method: 'DELETE',
		url: '/promos/:code',
		schema: {
			tags: ['promos'],
			description: 'delete a Promo by ID',
			params: {
				code: { type: 'string' },
			},
			response: {
				204: {},
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthAdmin,
		handler: deletePromo,
	})
}

const getPromos = async function (req, res) {
	return await Promo.find()
}

const getPromo = async function (req, res) {
	return await Promo.ensureExistsAndRetrieve(req.params.code)
}

const getPromoByCode = async function (req, res) {
	return await Promo.ensureExistsAndRetrieve({ code: req.params.code })
}

const createPromo = async function (req, res) {
	const promo = new Promo(req.body)
	await promo.save()
	res.code(201)
	return promo
}

const updatePromo = async function (req, res) {
	const promo = await findOneAndUpdate({ _id: req.params.code }, req.body, {
		new: true,
	})
	if (!promo) throw PromoNotFound
	return promo
}

const deletePromo = async function (req, res) {
	const { deletedCount } = await Promo.deleteOne({
		_id: req.params.code,
	})
	if (deletedCount !== 1) throw PromoNotFound
	res.code(204).send()
}

module.exports = routes
