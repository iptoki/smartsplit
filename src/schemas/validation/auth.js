module.exports.login = {
	type: "object",
	required: ["email", "password"],
	properties: {
		email: {
			type: "string",
			example: "qa@smartsplit.org",
		},
		password: {
			type: "string",
			example: "Biquette#1!",
		},
		expires: {
			type: "string",
			exemple: "5 days",
		},
	},
	additionalProperties: false,
}
