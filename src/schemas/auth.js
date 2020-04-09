const { api, error } = require("../app")
const UserSchema = require("./users")

module.exports = {
	login: api.schema("user_login", {
		type: "object",
		required: ["email", "password"],
		properties: {
			email: {
				type: "string",
				format: "email",
				example: "qa@smartsplit.org"
			},
			
			password: {
				type: "string",
				format: "password",
				example: "Biquette#1!"
			}
		}
	}),
	
	sessionInfo: api.schema("session_info", {
		type: "object",
		properties: {
			accessToken: {
				type: "string"
			},
			
			user: UserSchema.user
		}
	}),
	
	check: api.schema("auth_status", {
		type: "boolean"
	}),
	
	InvalidCredentialsError:
		error("auth_invalid_credentials", 401, "Invalid credentials provided: incorrect email or password"),
}
