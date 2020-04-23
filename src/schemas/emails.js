const { api, error } = require("../app")

module.exports = {
	
	email: api.param("email", {
		in: "path",
		name: "email",
		description: "The email of the user",
		example: "qa@smartsplit.com"
	}),

	createEmail: api.schema('create_email', {
		type: "object",
		properties: {
			email: {
				type: "string",
				format: "email",
				example: "qa@smartsplit.org"
			}
		},
		required: ["email"]
	}),
	
	emails: api.schema("user_emails", {
		type: "array",
		items: {
			type: "object",
			properties: {
				email: {
					type: "string",
					format: "email",
					example: "qa@smartsplit.org"
				},
				status: {
					type: "string",
					enum: ["active","pending"]
				}
			}
		}
	}),
	
	EmailNotFoundError:
		error("email_not_found", 404, "Email not found"),
	
	ConflictingEmailError:
		error("email_conflict",  409, "A user already exists with this email"),

	InvalidActivationTokenError:
		error("email_invalid_activation_token", 403, "The supplied email activation token is invalid or has expired"),

	EmailAlreadyActivatedError:
		error("user_email_already_active", 412, "This email is already active and cannot be activated again"),
}
