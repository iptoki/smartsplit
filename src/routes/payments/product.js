const Product = require("../../models/payments/product").Product
const Purchase = require("../../models/payments/purchase")
const ProductSchema = require("../../schemas/payments/product")
const Errors = require("../errors")
const JWTAuth = require("../../service/JWTAuth")

/**** routes ***/

async function routes(fastify, options) {
	fastify.route({
		method: "GET",
		url: "/products/",
		schema: {
			tags: ["products"],
			description: "Get Products by logged in user",
			response: {
				200: { type: "array", items: ProductSchema.serialization.Product },
			},
			security: [{ bearerAuth: [] }],
		},
		querystring: {
			active: { type: "string" },
			limit: {
				type: "integer",
				default: 50,
				minimum: 1,
				maximum: 250,
			},
			skip: {
				type: "integer",
				default: 0,
				minimum: 0,
			},
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: getProducts,
	})
	fastify.route({
		method: "GET",
		url: "/products/:product_id",
		schema: {
			tags: ["products"],
			description: "Get Product by id",
			params: {
				product_id: {
					type: "string",
				},
			},
			response: {
				200: ProductSchema.serialization.Product,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: getProduct,
	})
	fastify.route({
		method: "POST",
		url: "/products/",
		schema: {
			tags: ["products"],
			description: "Create new Product",
			params: {
				product_id: {
					type: "string",
				},
			},
			body: {
				allOf: [ProductSchema.validation.createUpdateProduct],
				required: ProductSchema.validation.createUpdateProduct.required,
			},
			response: {
				201: ProductSchema.serialization.Product,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: createProduct,
	})
	fastify.route({
		method: "PATCH",
		url: "/products/:product_id",
		schema: {
			tags: ["products"],
			description: "Edit Product",
			params: {
				product_id: {
					type: "string",
				},
			},
			body: {
				anyOf: [ProductSchema.validation.createUpdateProduct],
				required: ProductSchema.validation.createUpdateProduct.required,
			},
			response: {
				201: ProductSchema.serialization.Product,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: updateProduct,
	})
	fastify.route({
		method: "DELETE",
		url: "/products/:product_id",
		schema: {
			tags: ["products"],
			description: "delete (inactivate) a user's Product",
			params: {
				product_id: {
					type: "string",
				},
			},
			response: {
				202: ProductSchema.serialization.Product,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: deleteProduct,
	})
}

const getProducts = async function (req, res) {
	let products

	if (req.query.active === "true") {
		products = await Product.find()
			.getActive()
			.skip(parseInt(req.query.skip))
			.limit(parseInt(req.query.limit))
	} else if (req.query.active === "false") {
		products = await Product.find()
			.getInactive()
			.skip(parseInt(req.query.skip))
			.limit(parseInt(req.query.limit))
	} else {
		products = await Product.find()
			.skip(parseInt(req.query.skip))
			.limit(parseInt(req.query.limit))
	}
	return products
}

const getProduct = async function (req, res) {
	const product = await Product.findById(req.params.product_id)

	if (!product) throw Errors.ProductNotFound

	return product
}

const createProduct = async function (req, res) {
	req.body.user_id = req.authUser._id
	const Product = new Product(req.body)
	await Product.save()
	res.code(201)
	return Product
}

const updateProduct = async function (req, res) {
	/* has product been purchased? */
	let purchaseOfProduct = Purchase.findOne({ product: req.product_id })
	/* if yes, then immutable */
	if (purchaseOfProduct) throw Errors.ProductImmutable
	let productToModify = await getProduct(req, res)
	for (let field of ["name", "description", "price", "active", "productCode"])
		if (req.body[field]) productToModify[field] = req.body[field]
	await productToModify.save()
	// if Product marked as active:false remove Product from user.payments.billingProduct
	return productToModify
}

const deleteProduct = async function (req, res) {
	/* delete only sets the active prop to inactive */
	let productToModify = await getProduct(req, res)
	productToModify["active"] = false
	await productToModify.save()
	return productToModify
	// if Product is currently set in user.payment.billingProduct, set billing Product to empty
}

module.exports = routes
