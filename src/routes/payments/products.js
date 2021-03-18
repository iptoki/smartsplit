const Product = require("../../models/payments/product")
const Purchase = require("../../models/payments/purchase")
const ProductSchema = require("../../schemas/payments/products")
const Errors = require("../errors")
const JWTAuth = require("../../service/JWTAuth")

async function routes(fastify, options) {
	fastify.route({
		method: "GET",
		url: "/products/",
		schema: {
			tags: ["products"],
			description: "Get Products",
			response: {
				200: { type: "array", items: ProductSchema.serialization.product },
			},
		},
		handler: getProducts,
	})

	fastify.route({
		method: "GET",
		url: "/products/:product_code",
		schema: {
			tags: ["products"],
			description: "Get Product by code",
			params: {
				product_code: { type: "string" },
			},
			response: {
				200: ProductSchema.serialization.product,
			},
		},
		handler: getProduct,
	})

	fastify.route({
		method: "POST",
		url: "/products/",
		schema: {
			tags: ["products"],
			description: "Create new Product",
			body: {
				allOf: [ProductSchema.validation.createUpdateProduct],
				required: ["code", "name", "description", "price"],
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
		method: "PATCH",
		url: "/products/:product_code",
		schema: {
			tags: ["products"],
			description: "Edit Product",
			params: {
				product_code: { type: "string" },
			},
			body: ProductSchema.validation.createUpdateProduct,
			response: {
				200: ProductSchema.serialization.product,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthAdmin,
		handler: updateProduct,
	})

	fastify.route({
		method: "DELETE",
		url: "/products/:product_code",
		schema: {
			tags: ["products"],
			description: "delete a Product",
			params: {
				product_code: { type: "string" },
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
	const product = await Product.findById(req.params.product_code)
	if (!product) throw Errors.ProductNotFound
	return product
}

const createProduct = async function (req, res) {
	if (!(await Product.exists({ code: req.body.code })))
		throw Errors.ConflictingProductCode
	const product = new Product(req.body)
	await product.save()
	return product
}

const updateProduct = async function (req, res) {
	const product = await getProduct(req, res)
	await product.update(req.body)
	return product
}

const deleteProduct = async function (req, res) {
	await Product.deleteOne({ _id: req.params.product_code })
	res.code(204).send()
}

module.exports = routes
