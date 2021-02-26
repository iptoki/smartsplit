const Address = {
	type: "object",
	properties: {
		address_id: { type: "string" },
		user_id: { type: "string" },
		street1: { type: "string" },
		street2: { type: "string" },
		city: { type: "string" },
		province: { type: "string" },
		postalCode: { type: "string" },
		country: { type: "string" },
		active: { type: "boolean" },
	},
}
const createAddress = {
	type: "object",
	required: ["street1", "city", "province", "postalCode", "country"],
	properties: {
		street1: { type: "string" },
		street2: { type: "string" },
		city: { type: "string" },
		province: { type: "string" },
		postalCode: { type: "string" },
		country: { type: "string" },
	},
	additionalProperties: false,
}
const updateAddress = {
	type: "object",
	properties: {
		street1: { type: "string" },
		street2: { type: "string" },
		city: { type: "string" },
		province: { type: "string" },
		postalCode: { type: "string" },
		country: { type: "string" },
		active: { type: "boolean" },
	},
	additionalProperties: false,
}

module.exports = {
	serialization: {
		Address,
	},
	validation: {
		createAddress,
		updateAddress,
	},
}
