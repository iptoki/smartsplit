const localeSchema = require("../entities").serialization.locale
const ProductCode = require("../../constants/ProductCode")
const Product = {
	type: "object",
	properties: {
		product_id: { type: "string" },
		productCode: {
			type: "string",
			enum: ProductCode.list,
		},
		name: localeSchema,
		description: localeSchema,
		price: { type: "number" },
		active: { type: "boolean" },
	},
}
const createUpdateProduct = {
	type: "object",
	properties: {
		product_id: { type: "string" },
		productCode: {
			type: "string",
			enum: ProductCode.list,
		},
		name: localeSchema,
		description: localeSchema,
		price: { type: "number" },
		active: { type: "boolean" },
	},
}
module.exports = {
	serialization: {
		Product,
	},
	validation: {
		createUpdateProduct,
	},
}
