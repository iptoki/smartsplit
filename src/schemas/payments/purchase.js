const localeSchema = require("../entities").serialization.locale
const ProductSchema = require("./product").serialization.Product
const PromoCodeSchema = require("./promoCode").serialization.PromoCode
const AddressSchema = require("./address").serialization.Address

const Purchase = {
	type: "object",
	properties: {
		purchase_id: { type: "string" },
		workpiece_id: { type: "string" },
		user_id: { type: "string" },
		product: ProductSchema,
		promoCode: PromoCodeSchema,
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
}
const PurchaseIntent = {
	type: "object",
	properties: {
		purchase: Purchase,
		clientSecret: { type: "string" },
	},
}
const createUpdatePurchase = {
	type: "object",
	properties: {
		workpiece_id: { type: "string" },
		productCode: { type: "string" },
		promoCode: { type: "string" },
		billingAddress_id: { type: "string" },
		purchaseDate: { type: "string" },
	},
}
module.exports = {
	serialization: {
		Purchase,
		PurchaseIntent,
	},
	validation: {
		createUpdatePurchase,
	},
}
