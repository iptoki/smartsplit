const Address = require("../models/address")
const Purchase = require("../models/payments/purchase")
const AddressSchema = require("../schemas/addresses")
const Errors = require("../errors")
const JWTAuth = require("../../service/JWTAuth")
const { getUserWithAuthorization } = require("../users/users")

/**** routes ***/

async function routes(fastify, options) {
	fastify.route({
		method: "GET",
		url: "/users/:user_id/addresses/",
		schema: {
			tags: ["addresses"],
			description: "Get addresses by user",
			params: {
				user_id: {
					type: "string",
				},
			},
			response: {
				200: { type: "array", items: AddressSchema.serialization.Address },
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: getUserAddresses,
	})

	fastify.route({
		method: "GET",
		url: "/users/:user_id/addresses/:address_id",
		schema: {
			tags: ["addresses"],
			description: "Get address by id",
			params: {
				user_id: {
					type: "string",
				},
				address_id: {
					type: "string",
				},
			},
			response: {
				200: AddressSchema.serialization.Address,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: getAddress,
	})

	fastify.route({
		method: "POST",
		url: "/users/:user_id/addresses/",
		schema: {
			tags: ["addresses"],
			description: "Create new Address",
			params: {
				user_id: {
					type: "string",
				},
			},
			body: AddressSchema.validation.createAddress,
			response: {
				201: AddressSchema.serialization.Address,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: createAddress,
	})

	fastify.route({
		method: "PUT",
		url: "/users/:user_id/addresses/billing/:address_id",
		schema: {
			tags: ["addresses"],
			description: "Set the user's billing address",
			params: {
				user_id: {
					type: "string",
				},
				address_id: {
					type: "string",
				},
			},
			response: { 204: {} },
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: setBillingAddress,
	})

	fastify.route({
		method: "PATCH",
		url: "/users/:user_id/addresses/:address_id",
		schema: {
			tags: ["addresses"],
			description: "Edit an Address by ID",
			params: {
				user_id: {
					type: "string",
				},
				address_id: {
					type: "string",
				},
			},
			body: AddressSchema.validation.updateAddress,
			response: {
				200: AddressSchema.serialization.Address,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: updateAddress,
	})

	fastify.route({
		method: "DELETE",
		url: "/users/:user_id/addresses/:address_id",
		schema: {
			tags: ["addresses"],
			description: "delete (inactivate) a user's address",
			params: {
				user_id: {
					type: "string",
				},
				address_id: {
					type: "string",
				},
			},
			response: {
				200: AddressSchema.serialization.Address,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: deleteAddress,
	})
}

const getUserAddresses = async function (req, res) {
	const user = await getUserWithAuthorization(req)
	await user.populate("addresses").execPopulate()
	return user.addresses
}

const getAddress = async function (req, res) {
	const user = await getUserWithAuthorization(req)
	const address = await Address.findOne({
		_id: req.params.address_id,
		user: user._id,
	})
	if (!address) throw Errors.AddressNotFound
	return address
}

const createAddress = async function (req, res) {
	const user = await getUserWithAuthorization(req)
	const address = new Address(req.body)
	address.user = user._id
	if (!user.paymentInfo.billingAddress)
		user.paymentInfo.billingAddress = address._id
	await Promise.all([address.save(), user.save()])
	res.code(201)
	return address
}

const setBillingAddress = async function (req, res) {
	const user = await getUserWithAuthorization(req)
	if (!Address.exists({ _id: req.params.address_id, user: user._id }))
		throw Errors.AddressNotFound
	user.paymentInfo.billingAddress = req.params.address_id
	await user.save()
	res.code(204).send()
}

const updateAddress = async function (req, res) {
	const address = await getAddress(req, res)
	await address.update(req.body)
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

	if (result[1].deletedCount !== 1) throw Errors.AddressNotFound

	res.code(204).send()
}

module.exports = routes
