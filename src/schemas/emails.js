module.exports = {
	createEmail: {
		type: "object",
		properties: {
			email: {
				type: "string",
				format: "email",
				example: "qa@smartsplit.org",
			},
		},
		required: ["email"],
	},

	activateEmailSchema: {
		type: "object",
		required: ["token"],
		properties: {
			token: {
				type: "string",
				format: "jwt",
			},
		},
	},

	emailStatusList: {
		type: "array",
		items: {
			type: "object",
			properties: {
				email: {
					type: "string",
					format: "email",
					example: "qa@smartsplit.org",
				},
				status: {
					type: "string",
					enum: ["active", "pending"],
				},
			},
		},
	},
}
