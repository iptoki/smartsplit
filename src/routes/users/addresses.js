const Address = require('../../models/address')
const AddressSchema = require('../../schemas/addresses')
const { AddressNotFound } = require('../../errors')
const JWTAuth = require('../../service/JWTAuth')
const { getUserWithAuthorization } = require('./users')

async function routes(fastify, options) {
	fastify.route({
		method: 'GET',
		url: '/users/:user_id/addresses/',
		schema: {
			tags: ['addresses'],
			description: 'Get addresses by user',
			params: {
				user_id: {
					type: 'string',
				},
			},
			response: {
				200: { type: 'array', items: AddressSchema.serialization.address },
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: getUserAddresses,
	})

	fastify.route({
		method: 'GET',
		url: '/users/:user_id/addresses/:address_id',
		schema: {
			tags: ['addresses'],
			description: 'Get address by id',
			params: {
				user_id: {
					type: 'string',
				},
				address_id: {
					type: 'string',
				},
			},
			response: {
				200: AddressSchema.serialization.address,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: getAddress,
	})

	fastify.route({
		method: 'POST',
		url: '/users/:user_id/addresses/',
		schema: {
			tags: ['addresses'],
			description: 'Create new Address',
			params: {
				user_id: {
					type: 'string',
				},
			},
			body: {
				allOf: [AddressSchema.validation.createUpdateAddress],
				required: ['street1', 'city', 'province', 'postalCode', 'country'],
			},
			response: {
				201: AddressSchema.serialization.address,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: createAddress,
	})

	fastify.route({
		method: 'PUT',
		url: '/users/:user_id/addresses/billing/:address_id',
		schema: {
			tags: ['addresses'],
			description: "Set the user's billing address",
			params: {
				user_id: {
					type: 'string',
				},
				address_id: {
					type: 'string',
				},
			},
			response: { 204: {} },
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: setBillingAddress,
	})

	fastify.route({
		method: 'PATCH',
		url: '/users/:user_id/addresses/:address_id',
		schema: {
			tags: ['addresses'],
			description: 'Edit an Address by ID',
			params: {
				user_id: {
					type: 'string',
				},
				address_id: {
					type: 'string',
				},
			},
			body: AddressSchema.validation.createUpdateAddress,
			response: {
				200: AddressSchema.serialization.address,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: updateAddress,
	})

	fastify.route({
		method: 'DELETE',
		url: '/users/:user_id/addresses/:address_id',
		schema: {
			tags: ['addresses'],
			description: "delete (inactivate) a user's address",
			params: {
				user_id: {
					type: 'string',
				},
				address_id: {
					type: 'string',
				},
			},
			response: {
				200: AddressSchema.serialization.address,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: deleteAddress,
	})
}

const getUserAddresses = async function (req, res) {
	const user = await getUserWithAuthorization(req)
	await user.populate('addresses').execPopulate()
	return user.addresses
}

const getAddress = async function (req, res) {
	const user = await getUserWithAuthorization(req)
	return await Address.ensureExistsAndRetrieve({
		_id: req.params.address_id,
		user_id: user._id,
	})
}

const createAddress = async function (req, res) {
	const user = await getUserWithAuthorization(req)
	const address = new Address(req.body)
	address.user_id = user._id
	if (!user.paymentInfo.billingAddress)
		user.paymentInfo.billingAddress = address._id
	await Promise.all([address.save(), user.save()])
	res.code(201)
	return address
}

const setBillingAddress = async function (req, res) {
	const user = await getUserWithAuthorization(req)
	await Address.ensureExistsAndRetrieve({
		_id: req.params.address_id,
		user_id: user._id,
	})
	user.paymentInfo.billingAddress = req.params.address_id
	await user.save()
	res.code(204).send()
}

const updateAddress = async function (req, res) {
	const address = await Address.findOneAndUpdate(
		{ _id: req.params.address_id, user: req.params.user_id },
		req.body,
		{ new: true }
	)
	if (!address) throw AddressNotFound
	return address
}

const deleteAddress = async function (req, res) {
	const user = await getUserWithAuthorization(req)

	let saveUser
	if (user.paymentInfo.billingAddress === req.params.address_id) {
		user.paymentInfo.billingAddress = undefined
		saveUser = user.save()
	}

	const result = await Promise.all([
		saveUser,
		Address.deleteOne({ _id: req.params.address_id, user: user._id }),
	])

	if (result[1].deletedCount !== 1) throw AddressNotFound

	res.code(204).send()
}

module.exports = routes
