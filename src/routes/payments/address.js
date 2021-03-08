const Address = require("../../models/payments/address").Address
const Purchase = require("../../models/payments/purchase")
const AddressSchema = require("../../schemas/payments/address")
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
		method: "PATCH",
		url: "/users/:user_id/addresses/set-billing/:address_id",
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
			response: {
				200: AddressSchema.serialization.Address,
			},
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
			description: "Edit Address",
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
				202: AddressSchema.serialization.Address,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: deleteAddress,
	})
}

const getUserAddresses = async function (req, res) {
	// if user is admin -- return ALL addresses in the collection (with paging)
	// else just return user's addresses
	const user = await getUserWithAuthorization(req, res)
	await user.populate("addresses").execPopulate()
	return user.addresses // addresses
}

const getAddress = async function (req, res) {
	const user = await getUserWithAuthorization(req, res)
	await user.populate("addresses").execPopulate()
	const address = user.addresses[req.params.address_id]
	if (!address) throw Errors.AddressNotFound
	return address
}

const createAddress = async function (req, res) {
	const user = await getUserWithAuthorization(req, res)
	req.body.user_id = user._id
	const address = new Address(req.body)
	await address.save()
	res.code(201)
	user.paymentInfo.billingAddress = address._id
	await user.save()
	return address
}
const setBillingAddress = async function (req, res) {
	const user = await getUserWithAuthorization(req, res)
	await user.populate("addresses").execPopulate()
	const address = user.addresses.find((a) => a._id === req.params.address_id)
	if (!address) throw Errors.AddressNotFound
	user.paymentInfo.billingAddress = address._id
	await user.save()
	return address
}
const updateAddress = async function (req, res) {
	let addressToModify = await getAddress(req, res)
	// check and see if address occurs in any purchase
	// if purchase with address exists
	// throw Errors.AddressNotModifiable
	// else modify address
	for (let field of [
		"street1",
		"street2",
		"city",
		"province",
		"postalCode",
		"country",
		"active",
	])
		if (req.body[field]) addressToModify[field] = req.body[field]
	await addressToModify.save()
	// if address marked as active:false remove address from user.paymentInfo.billingAddress
	return addressToModify
}

const deleteAddress = async function (req, res) {
	let addressToModify = await getAddress(req, res)
	addressToModify["active"] = false
	await addressToModify.save()
	return addressToModify
	// if address is currently set in user.paymentInfo.billingAddress, set billing address to empty
}

module.exports = routes
