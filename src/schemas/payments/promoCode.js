const localeSchema = require("../entities").serialization.locale

const promoCode = {
	type: "object",
	properties: {
		code: { type: "string" },
		promo_id: { type: "string" },
		organisation: localeSchema,
		description: localeSchema,
		value: { type: "number" },
		expires: { type: "string" },
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
	},
}

module.exports = {
	serialization: {
		promoCode,
	},
	validation: {
		createUpdatePromoCode,
	},
}
