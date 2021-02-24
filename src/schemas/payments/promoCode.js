const localeSchema = require("../entities").serialization.locale
const PromoCode = {
	type: "object",
	properties: {
		promo_id: { type: "string" },
		organisation: localeSchema,
		description: localeSchema,
		value: { type: "string" },
		expires: { type: "string" },
		purchase_id: { type: "string" },
	},
}

const createUpdatePromoCode = {
	type: "object",
	required: ["organisation", "description", "value", "expires"],
	properties: {
		organisation: localeSchema,
		description: localeSchema,
		value: { type: "string" },
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
