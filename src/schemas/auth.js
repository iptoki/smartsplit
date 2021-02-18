const UserSchema = require("./users")

module.exports = {
	login: {
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
		},
		additionalProperties: false,
	},

	sessionInfo: {
		type: "object",
		properties: {
			accessToken: {
				type: "string",
			},
			user: UserSchema.serialization.user,
		},
	},
}
