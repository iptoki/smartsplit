const localeSchema = require("../entities").serialization.locale

const PromoCode = {
	type: "object",
	properties: {
		code: { type: "string" },
		promo_id: { type: "string" },
		organisation: localeSchema,
		description: localeSchema,
		value: { type: "number" },
		expires: { type: "string" },
		purchase_id: { type: "string" },
	},
}

const createUpdatePromoCode = {
	type: "object",
	required: ["code", "organisation", "description", "value", "expires"],
	properties: {
		code: { type: "string" },
		organisation: localeSchema,
		description: localeSchema,
		value: { type: "number" },
		expires: { type: "string" },
		purchase_id: { type: "string" },
	},
}

module.exports = {
	serialization: {
		PromoCode,
	},
	validation: {
		createUpdatePromoCode,
	},
}
