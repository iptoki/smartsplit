const Errors = require('../errors')
const Product = require('../models/product')
const Purchase = require('../models/purchase')
const ProductSchema = require('../schemas/products')
const JWTAuth = require('../service/JWTAuth')

async function routes(fastify, options) {
	fastify.route({
		method: 'GET',
		url: '/products/',
		schema: {
			tags: ['products'],
			description: 'Get Products',
			response: {
				200: { type: 'array', items: ProductSchema.serialization.product },
			},
		},
		handler: getProducts,
	})

	fastify.route({
		method: 'GET',
		url: '/products/:product_code',
		schema: {
			tags: ['products'],
			description: 'Get Product by code',
			params: {
				product_code: { type: 'string' },
			},
			response: {
				200: ProductSchema.serialization.product,
			},
		},
		handler: getProduct,
	})

	fastify.route({
		method: 'POST',
		url: '/products/',
		schema: {
			tags: ['products'],
			description: 'Create new Product',
			body: {
				allOf: [ProductSchema.validation.createProduct],
				required: ['code', 'name', 'description', 'price'],
			},
			response: {
				201: ProductSchema.serialization.product,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthAdmin,
		handler: createProduct,
	})

	fastify.route({
		method: 'PATCH',
		url: '/products/:product_code',
		schema: {
			tags: ['products'],
			description: 'Edit Product',
			params: {
				product_code: { type: 'string' },
			},
			body: ProductSchema.validation.updateProduct,
			response: {
				200: ProductSchema.serialization.product,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthAdmin,
		handler: updateProduct,
	})

	fastify.route({
		method: 'DELETE',
		url: '/products/:product_code',
		schema: {
			tags: ['products'],
			description: 'delete a Product',
			params: {
				product_code: { type: 'string' },
			},
			response: {
				204: {},
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthAdmin,
		handler: deleteProduct,
	})
}

const getProducts = async function (req, res) {
	return await Product.find()
}

const getProduct = async function (req, res) {
	return await Product.ensureExistsAndRetrieve(req.params.product_code)
}

const createProduct = async function (req, res) {
	if (await Product.exists({ _id: req.body.code }))
		throw Errors.ConflictingProductCode
	const product = new Product(req.body)
	res.code(201)
	return await product.save()
}

const updateProduct = async function (req, res) {
	const product = await Product.findOneAndUpdate(
		{ _id: req.params.product_code },
		req.body,
		{ new: true }
	)
	if (!product) throw Errors.ProductNotFound
	return product
}

const deleteProduct = async function (req, res) {
	const { deletedCount } = await Product.deleteOne({
		_id: req.params.product_code,
	})
	if (deletedCount !== 1) throw Errors.ProductNotFound
	res.code(204).send()
}

module.exports = routes
