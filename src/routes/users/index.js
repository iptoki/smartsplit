const JWTAuth = require("../../service/JWTAuth")
const UserSchema = require("../../schemas/users")
const AuthSchema = require("../../schemas/auth")
const Controller = require("./handlers")

async function routes(fastify, options) {
	fastify.route({
		method: "GET",
		url: "/users/:user_id",
		schema: {
			params: {
				user_id: {
					type: "string",
				},
			},
			response: {
				200: UserSchema.user,
			},
		},
		handler: Controller.getUserWithPendingEmails,
	})

	fastify.route({
		method: "GET",
		url: "/users/:user_id/avatar",
		schema: {
			params: {
				user_id: {
					type: "string",
				},
			},
			response: {
				200: {
					/* TODO */
				},
			},
		},
		handler: Controller.getUserAvatar,
	})

	fastify.route({
		method: "POST",
		url: "/users/",
		schema: {
			body: UserSchema.userRequestBody,
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
			body: {
				type: "object",
				required: ["token"],
				properties: {
					token: {
						type: "string",
					},
				},
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
			params: {
				user_id: {
					type: "string",
				},
			},
			body: UserSchema.userRequestBody,
			response: {
				200: UserSchema.user,
			},
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: Controller.updateUser,
	})

	fastify.route({
		method: "POST",
		url: "/users/request-password-reset",
		schema: {
			body: {
				type: "object",
				required: ["email"],
				properties: {
					email: {
						type: "string",
					},
				},
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
			body: {
				type: "object",
				required: ["verificationCode"],
				properties: {
					verificationCode: {
						type: "number",
					},
				},
			},
			response: {
				204: {},
			},
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: Controller.verifyUserMobilePhone,
	})

	fastify.route({
		method: "POST",
		url: "/users/invite-new-user",
		schema: {
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
			params: {
				user_id: {
					type: "string",
				},
			},
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: Controller.deleteUserAccount,
	})

	fastify.route({
		method: "GET",
		url: "/users/:user_id/emails/",
		schema: {
			params: {
				user_id: {
					type: "string",
				},
			},
			response: {
				200: UserSchema.emailStatusList,
			},
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: Controller.getUserEmails,
	})

	fastify.route({
		method: "POST",
		url: "/users/:user_id/emails/",
		schema: {
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
			},
			response: {
				201: UserSchema.emailStatusList,
			},
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: Controller.createUserEmail,
	})

	fastify.route({
		method: "POST",
		url: "/users/:user_id/emails/:email",
		schemas: {
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
			},
		},
		handler: Controller.activateUserEmail,
	})

	fastify.route({
		method: "DELETE",
		url: "/users/:user_id/emails/:email",
		schema: {
			params: {
				user_id: {
					type: "string",
				},
				email: {
					type: "string",
				},
			},
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: Controller.deleteUserEmail,
	})
}

module.exports = routes
