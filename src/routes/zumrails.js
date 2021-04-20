const User = require('../models/user')
const zumrails = require('../service/zumrails')
const JWTAuth = require('../service/JWTAuth')

async function routes(fastify, options) {
	fastify.route({
		method: 'POST',
		url: '/zumrails/link-user',
		schema: {
			tags: ['zumrails'],
			description: 'Link a zumrails user to a smartsplit user',
			body: {
				type: 'object',
				required: ['user_id', 'zumId'],
				properties: {
					user_id: { type: 'string' },
					zumId: { type: 'string' },
				},
				additionalProperties: false,
			},
			response: {
				200: {},
			},
			security: [{ bearerAuth: [] }],
		},
		//preValidation: JWTAuth.requireAuthAdmin,
		handler: async function linkUserToZumId(req, res) {
			const user = await User.ensureExistsAndRetrieve(req.body.user_id)
			user.zumId = req.body.zumId
			await user.save()
			res.send()
		},
	})

	fastify.route({
		method: 'POST',
		url: '/zumrails/withdraw-zum-wallet',
		schema: {
			description: 'Withdraw money from zum wallet to funding source',
			body: {
				type: 'object',
				required: ['amount'],
				properties: {
					amount: { type: 'number' },
				},
			},
			response: {
				200: { type: 'object', additionalProperties: true },
			},
			security: [{ bearerAuth: [] }],
		},
		//preValidation: JWTAuth.requireAuthAdmin,
		handler: async function withdrawZumWallet(req, res) {
			const response = await zumrails.withdrawZumWallet(req.body.amount)
		},
	})

	fastify.route({
		method: 'POST',
		url: '/zumrails/fund-zum-wallet',
		schema: {
			description: 'Fund money to zum wallet from funding source',
			body: {
				type: 'object',
				required: ['amount'],
				properties: {
					amount: { type: 'number' },
				},
			},
			response: {
				200: { type: 'object', additionalProperties: true },
			},
			security: [{ bearerAuth: [] }],
		},
		//preValidation: JWTAuth.requireAuthAdmin,
		handler: async function fundZumWallet(req, res) {
			const response = await zumrails.fundZumWallet(req.body.amount)
			return response.body
		},
	})

	fastify.route({
		method: 'POST',
		url: '/zumrails/withdraw-user',
		schema: {
			description: 'Withdraw money from user to zum wallet',
			body: {
				type: 'object',
				required: ['amount', 'user_id'],
				properties: {
					user_id: { type: 'string' },
					amount: { type: 'number' },
				},
			},
			response: {
				200: { type: 'object', additionalProperties: true },
			},
			security: [{ bearerAuth: [] }],
		},
		//preValidation: JWTAuth.requireAuthAdmin,
		handler: async function withdrawUser(req, res) {
			const user = await User.ensureExistsAndRetrieve(req.body.user_id)
			const response = await zumrails.withdrawUser(req.body.amount, user.zumId)
			return response.body
		},
	})

	fastify.route({
		method: 'POST',
		url: '/zumrails/fund-user',
		schema: {
			description: 'fund money to user from zum wallet',
			body: {
				type: 'object',
				required: ['amount', 'user_id'],
				properties: {
					user_id: { type: 'string' },
					amount: { type: 'number' },
				},
			},
			response: {
				200: { type: 'object', additionalProperties: true },
			},
			security: [{ bearerAuth: [] }],
		},
		//preValidation: JWTAuth.requireAuthAdmin,
		handler: async function fundUser(req, res) {
			const user = await User.ensureExistsAndRetrieve(req.body.user_id)
			const response = await zumrails.fundUser(req.body.amount, user.zumId)
			return response.body
		},
	})

	fastify.route({
		method: 'POST',
		url: '/zumrails/user-transfer',
		schema: {
			description: 'Transfer money from user to an other user',
			body: {
				type: 'object',
				required: ['amount', 'user_id', 'targetUser_id'],
				properties: {
					user_id: { type: 'string' },
					targetUser_id: { type: 'string' },
					amount: { type: 'number' },
				},
			},
			response: {
				200: { type: 'object', additionalProperties: true },
			},
			security: [{ bearerAuth: [] }],
		},
		//preValidation: JWTAuth.requireAuthAdmin,
		handler: async function userTransfer(req, res) {
			const userFrom = await User.ensureExistsAndRetrieve(req.body.user_id)
			const userTo = await User.ensureExistsAndRetrieve(req.body.targetUser_id)
			const response = await zumrails.userTransfer(
				req.body.amount,
				userFrom.zumId,
				userTo.zumId
			)
			return response.body
		},
	})
}

module.exports = routes
