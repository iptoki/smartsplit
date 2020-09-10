const UserSchema = require("./users")

module.exports = {
	login: {
		type: "object",
		required: ["email", "password"],
		properties: {
			email: {
				type: "string",
				format: "email",
				example: "qa@smartsplit.org",
			},
			password: {
				type: "string",
				format: "password",
				example: "Biquette#1!",
			},
			expires: {
				type: "string",
				exemple: "5 days",
			},
		},
	},

	sessionInfo: {
		type: "object",
		properties: {
			accessToken: {
				type: "string",
			},
			user: UserSchema.user,
		},
	}
}
