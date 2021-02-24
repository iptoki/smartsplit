const localeSchema = require("../entities").serialization.locale
const Purchase = {
	type: "object",
	properties: {
		workpiece_id: { type: "string" },
		user_id: { type: "string" },
		product: { type: "string" },
		promoCode: { type: "string" },
		billingAddress: { type: "string" },
		creditsUsed: { type: "number" },
		creditsValue: { type: "number" },
		subtotal: { type: "number" },
		gst: { type: "number" },
		pst: { type: "number" },
		total: { type: "number" },
		payment_id: { type: "string" },
		status: {
			type: "string",
			enum: ["pending" | "succeeded" | "failed"],
		},
		purchaseDate: { type: "string" },
	},
}
const createUpdatePurchase = {
	type: "object",
	properties: {
		workpiece_id: { type: "string" },
		user_id: { type: "string" },
		product: { type: "string" },
		promoCode: { type: "string" },
		billingAddress: { type: "string" },
		creditsUsed: { type: "number" },
		creditsValue: { type: "number" },
		subtotal: { type: "number" },
		gst: { type: "number" },
		pst: { type: "number" },
		total: { type: "number" },
		payment_id: { type: "string" },
		status: {
			type: "string",
			enum: ["pending" | "succeeded" | "failed"],
		},
		purchaseDate: { type: "string" },
	},
}
module.exports = {
	serialization: {
		Purchase,
	},
	validation: {
		createUpdatePurchase,
	},
}
