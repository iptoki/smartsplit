const ProductSchema = require("./products").serialization.product
const PromoSchema = require("./promos").serialization.promo
const AddressSchema = require("./addresses").serialization.address

const purchase = {
	type: "object",
	properties: {
		purchase_id: { type: "string" },
		workpiece_id: { type: "string" },
		user_id: { type: "string" },
		product: ProductSchema,
		promo: PromoSchema,
		creditsUsed: { type: "number" },
		billingAddress: AddressSchema,
		subtotal: { type: "number" },
		gst: { type: "number" },
		pst: { type: "number" },
		total: { type: "number" },
		payment_id: { type: "string" },
		status: {
			type: "string",
			enum: ["pending", "succeeded", "failed"],
		},
		purchaseDate: { type: "string" },
	},
	additionalProperties: false,
}

const purchaseIntent = {
	type: "object",
	properties: {
		purchase: purchase,
		clientSecret: { type: "string" },
	},
	additionalProperties: false,
}

const createUpdatePurchase = {
	type: "object",
	properties: {
		workpiece_id: { type: "string" },
		productCode: { type: "string" },
		promoCode: { type: "string" },
		billingAddress_id: { type: "string" },
	},
	additionalProperties: false,
}

module.exports = {
	serialization: {
		purchase,
		purchaseIntent,
	},
	validation: {
		createUpdatePurchase,
	},
}
