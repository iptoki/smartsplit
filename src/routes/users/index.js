const JWTAuth = require("../../service/JWTAuth")
const UserSchema = require("../../schemas/users")
const AuthSchema = require("../../schemas/auth")
const Controller = require("./handlers")

async function routes(fastify, options) {
	fastify.route({
		method: "GET",
		url: "/users/:user_id",
		schema: {
			tags: ["users"],
			description: "Get a user by ID",
			params: {
				user_id: {
					type: "string",
				},
			},
			response: {
				200: UserSchema.user,
			},
			security: [{ bearerAuth: [] }],
		},
		handler: Controller.getUserWithPendingEmails,
	})

	fastify.route({
		method: "GET",
		url: "/users/:user_id/avatar",
		schema: {
			tags: ["users"],
			description: "Get a user's avatar by ID",
			params: {
				user_id: {
					type: "string",
				},
			},
		},
		reponse: {
			200: {},
		},
		handler: Controller.getUserAvatar,
	})

	fastify.route({
		method: "POST",
		url: "/users/",
		schema: {
			tags: ["users"],
			description: "Create a new user in the system",
			body: {
				allOf: [UserSchema.userRequestBody],
				required: ["email", "password"],
			},
			response: {
				201: UserSchema.user,
			},
		},
		handler: Controller.createUser,
	})

	fastify.route({
		method: "POST",
		url: "/users/activate",
		schema: {
			tags: ["users"],
			description: "Activate a user's account",
			body: {
				type: "object",
				required: ["token"],
				properties: {
					token: {
						type: "string",
					},
				},
				additionalProperties: false,
			},
			response: {
				200: AuthSchema.sessionInfo,
			},
		},
		handler: Controller.activateUserAccount,
	})

	fastify.route({
		method: "PATCH",
		url: "/users/:user_id",
		schema: {
			tags: ["users"],
			description: "Update a user by ID",
			params: {
				user_id: {
					type: "string",
				},
			},
			body: UserSchema.userRequestBody,
			response: {
				200: UserSchema.user,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: Controller.updateUser,
	})

	fastify.route({
		method: "POST",
		url: "/users/request-password-reset",
		schema: {
			tags: ["users"],
			description: "Send a password reset email",
			body: {
				type: "object",
				required: ["email"],
				properties: {
					email: {
						type: "string",
					},
				},
				additionalProperties: false,
			},
			response: {
				204: {},
			},
		},
		handler: Controller.requestPasswordReset,
	})

	fastify.route({
		method: "POST",
		url: "/users/change-password",
		schema: {
			tags: ["users"],
			description: "Update the user password",
			body: {
				type: "object",
				required: ["password"],
				properties: {
					token: {
						type: "string",
					},
					currentPassword: {
						type: "string",
					},
					password: {
						type: "string",
					},
				},
				additionalProperties: false,
			},
			response: {
				200: AuthSchema.sessionInfo,
			},
		},
		handler: Controller.changeUserPassword,
	})

	fastify.route({
		method: "POST",
		url: "/users/verify-mobile-phone",
		schema: {
			tags: ["users"],
			description: "Verify the user's phone number",
			body: {
				type: "object",
				required: ["verificationCode"],
				properties: {
					verificationCode: {
						type: "number",
					},
				},
				additionalProperties: false,
			},
			response: {
				204: {},
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: Controller.verifyUserMobilePhone,
	})

	fastify.route({
		method: "POST",
		url: "/users/invite-new-user",
		schema: {
			tags: ["users"],
			description: "Invite a new user",
			body: {
				type: "object",
				required: ["email"],
				properties: {
					firstName: {
						type: "string",
					},
					lastName: {
						type: "string",
					},
					artistName: {
						type: "string",
					},
					email: {
						type: "string",
					},
				},
				additionalProperties: false,
			},
			response: {
				201: UserSchema.user,
			},
		},
		handler: Controller.inviteNewUser,
	})

	fastify.route({
		method: "DELETE",
		url: "/users/:user_id",
		schema: {
			tags: ["users"],
			description: "Delete a user's account by ID",
			params: {
				user_id: {
					type: "string",
				},
			},
			response: {
				204: {},
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: Controller.deleteUserAccount,
	})

	fastify.route({
		method: "GET",
		url: "/users/:user_id/emails/",
		schema: {
			tags: ["users", "users_emails"],
			description: "Get a user's email list",
			params: {
				user_id: {
					type: "string",
				},
			},
			response: {
				200: UserSchema.emailStatusList,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: Controller.getUserEmails,
	})

	fastify.route({
		method: "POST",
		url: "/users/:user_id/emails/",
		schema: {
			tags: ["users", "users_emails"],
			description: "Create a new email in a user's account",
			params: {
				user_id: {
					type: "string",
				},
			},
			body: {
				type: "object",
				required: ["email"],
				properties: {
					email: {
						type: "string",
					},
				},
				additionalProperties: false,
			},
			response: {
				201: UserSchema.emailStatusList,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: Controller.createUserEmail,
	})

	fastify.route({
		method: "POST",
		url: "/users/:user_id/emails/:email",
		schema: {
			tags: ["users", "users_emails"],
			description: "Activate a user's email",
			params: {
				user_id: {
					type: "string",
				},
				email: {
					type: "string",
				},
			},
			body: {
				type: "object",
				required: ["token"],
				properties: {
					token: {
						type: "string",
					},
				},
				additionalProperties: false,
			},
			response: {
				204: {},
			},
		},
		handler: Controller.activateUserEmail,
	})

	fastify.route({
		method: "DELETE",
		url: "/users/:user_id/emails/:email",
		schema: {
			tags: ["users", "users_emails"],
			description: "Delete a user's email",
			params: {
				user_id: {
					type: "string",
				},
				email: {
					type: "string",
				},
			},
			response: {
				204: {},
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: Controller.deleteUserEmail,
	})
}

module.exports = routes
