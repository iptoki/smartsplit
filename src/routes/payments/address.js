const Address = require("../../models/payments/address").Address
const Purchase = require("../../models/payments/purchase")
const AddressSchema = require("../../schemas/payments/address")
const Errors = require("../errors")
const JWTAuth = require("../../service/JWTAuth")

/**** routes ***/

async function routes(fastify, options) {
	fastify.route({
		method: "GET",
		url: "/addresses/",
		schema: {
			tags: ["addresses"],
			description: "Get addresses by logged in user",
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
		url: "/addresses/:address_id",
		schema: {
			tags: ["addresses"],
			description: "Get address by id",
			params: {
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
		url: "/addresses/",
		schema: {
			tags: ["addresses"],
			description: "Create new Address",
			body: {
				allOf: [AddressSchema.validation.createAddress],
				required: AddressSchema.validation.createAddress.required,
			},
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
		url: "/addresses/:address_id",
		schema: {
			tags: ["addresses"],
			description: "Edit Address",
			params: {
				address_id: {
					type: "string",
				},
			},
			body: {
				anyOf: [AddressSchema.validation.updateAddress],
				required: AddressSchema.validation.updateAddress.required,
			},
			response: {
				201: AddressSchema.serialization.Address,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: updateAddress,
	})
	
	fastify.route({
		method: "DELETE",
		url: "/addresses/:address_id",
		schema: {
			tags: ["addresses"],
			description: "delete (inactivate) a user's address",
			params: {
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
	const addresses = await Address.find().byOwner(req.authUser.user_id)
	return addresses
}

const getAddress = async function (req, res) {
	const address = await Address.findById(req.params.address_id)
	if (address.user_id !== req.authUser._id /*|| !req.authUser.isAdmin*/)
		throw Errors.UserForbidden
	if (!address) throw Errors.AddressNotFound

	return address
}

const createAddress = async function (req, res) {
	req.body.user_id = req.authUser._id
	const address = new Address(req.body)
	await address.save()
	res.code(201)
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
	// if address marked as active:false remove address from user.payments.billingAddress
	return addressToModify
}

const deleteAddress = async function (req, res) {
	let addressToModify = await getAddress(req, res)
	addressToModify["active"] = false
	await addressToModify.save()
	return addressToModify
	// if address is currently set in user.payment.billingAddress, set billing address to empty
}

module.exports = routes
