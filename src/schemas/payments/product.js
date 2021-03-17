const localeSchema = require("../entities").serialization.locale
const ProductCode = require("../../constants/ProductCode")

const product = {
	type: "object",
	properties: {
		code: {
			type: "string",
			enum: ProductCode.list,
		},
		name: localeSchema,
		description: localeSchema,
		price: { type: "number" },
	},
}

const createProduct = {
	type: "object",
	required: ["productCode", "name", "description", "price"],
	properties: {
		productCode: {
			type: "string",
			enum: ProductCode.list,
		},
		name: localeSchema,
		description: localeSchema,
		price: { type: "number" },
	},
	additionalProperties: false,
}

const updateProduct = {
	type: "object",
	properties: {
		productCode: {
			type: "string",
			enum: ProductCode.list,
		},
		name: localeSchema,
		description: localeSchema,
		price: { type: "number" },
	},
	additionalProperties: false,
}

module.exports = {
	serialization: {
		product,
	},
	validation: {
		createProduct,
		updateProduct,
	},
}
