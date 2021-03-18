const locale = {
	type: "object",
	properties: {
		fr: { type: "string" },
		en: { type: "string" },
	},
	additionalProperties: false,
}

const promoCode = {
	type: "object",
	properties: {
		promoCode_id: { type: "string" },
		code: { type: "string" },
		organisation: locale,
		description: locale,
		value: { type: "number" },
		expires: { type: "string" },
	},
	additionalProperties: false,
}

const createUpdatePromoCode = {
	type: "object",
	properties: {
		code: { type: "string" },
		organisation: locale,
		description: locale,
		value: { type: "number" },
		expires: { type: "string", format: "date" },
	},
	additionalProperties: false,
}

module.exports = {
	serialization: {
		promoCode,
	},
	validation: {
		createUpdatePromoCode,
	},
}
