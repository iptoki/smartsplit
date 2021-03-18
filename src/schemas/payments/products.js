const ProductCodes = require("../../constants/productCodes")

const locale = {
	type: "object",
	properties: {
		fr: { type: "string" },
		en: { type: "string" },
	},
	additionalProperties: false,
}

const product = {
	type: "object",
	properties: {
		code: {
			type: "string",
			enum: ProductCodes.list,
		},
		name: locale,
		description: locale,
		price: { type: "number" },
	},
	additionalProperties: false,
}

const createUpdateProduct = {
	...product,
}

module.exports = {
	serialization: {
		product,
	},
	validation: {
		createUpdateProduct,
	},
}
