const address = {
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
	},
	additionalProperties: false,
}

const createUpdateAddress = {
	type: "object",
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

module.exports = {
	serialization: {
		address,
	},
	validation: {
		createUpdateAddress,
	},
}
