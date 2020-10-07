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
		preValidation: JWTAuth.getAuthUser,
		handler: Controller.getUser,
		preSerialization: preSerializeUser,
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
			security: [{ bearerAuth: [] }],
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
			description:
				"Deprecated, you should use POST /users/:user_id/collaborators/. Invite a new user",
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

	fastify.route({
		method: "GET",
		url: "/users/:user_id/collaborators/",
		schema: {
			tags: ["users", "collaborators"],
			description: "Get a user's collaborators",
			params: {
				user_id: {
					type: "string",
				},
			},
			response: {
				200: {
					type: "array",
					items: UserSchema.userPublicProfile,
				},
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: Controller.getCollaborators,
	})

	fastify.route({
		method: "POST",
		url: "/users/:user_id/collaborators/",
		schema: {
			tags: ["users", "collaborators"],
			description:
				"Create a new collaborator and add it to the authenticated user's collaborators",
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
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: Controller.createCollaborator,
	})

	fastify.route({
		method: "DELETE",
		url: "/users/:user_id/collaborators/:collaborator_id",
		schema: {
			tags: ["users", "collaborators"],
			description: "Delete a user's collaborator by ID",
			params: {
				user_id: {
					type: "string",
				},
				collaborator_id: {
					type: "string",
				},
			},
			response: {
				204: {},
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: Controller.deleteCollaborator,
	})
}

async function preSerializeUser(req, res, user) {
	if (res.userPublicSchema) {
		const fastJson = require("fast-json-stringify")
		const stringify = fastJson(UserSchema.userPublicProfile)
		if (user.professional_identity && !user.professional_identity.public)
			user.professional_identity = undefined
		return JSON.parse(stringify(user))
	}
	return user
}

module.exports = routes
