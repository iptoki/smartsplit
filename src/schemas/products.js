const ProductCodes = require('../constants/productCodes')

const locale = {
	type: 'object',
	properties: {
		fr: { type: 'string' },
		en: { type: 'string' },
	},
	additionalProperties: false,
}

const product = {
	type: 'object',
	properties: {
		code: {
			type: 'string',
		},
		name: locale,
		description: locale,
		price: { type: 'number' },
	},
	additionalProperties: false,
}

const createProduct = {
	...product,
	required: ['code', 'name', 'description', 'price'],
}

const updateProduct = {
	type: 'object',
	properties: {
		name: locale,
		description: locale,
		price: { type: 'number' },
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
