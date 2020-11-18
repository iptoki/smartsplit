const JWTAuth = require("../../service/JWTAuth")
const EmailVerification = require("../../models/emailVerification")
const { UserTemplates } = require("../../models/notifications/templates")
const UserSchema = require("../../schemas/users")
const Errors = require("../errors")
const { getUser } = require("./users")

/************************ Routes ************************/

async function routes(fastify, options) {
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
		handler: getUserEmails,
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
		handler: createUserEmail,
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
				200: UserSchema.emailStatusList,
			},
		},
		handler: activateUserEmail,
	})

	fastify.route({
		method: "POST",
		url: "/users/:user_id/emails/primary",
		schema: {
			tags: ["users", "users_emails"],
			description: "Set a user email to the primary one",
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
				200: UserSchema.emailStatusList,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: setUserPrimaryEmail,
	})

	fastify.route({
		method: "GET",
		url: "/users/:user_id/emails/primary",
		schema: {
			tags: ["users", "users_emails"],
			description: "Get the user primary email",
			params: {
				user_id: {
					type: "string",
				},
			},
			response: {
				200: {
					type: "string",
				},
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: getUserPrimaryEmail,
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
		handler: deleteUserEmail,
	})
}

/************************ Handlers ************************/

async function getUserWithPendingEmails(req, res) {
	const user = await getUser(req, res)
	await user.populate("pendingEmails").execPopulate()
	return user
}

async function getUserEmails(req, res) {
	return formatEmailList(await getUserWithPendingEmails(req, res))
}

async function createUserEmail(req, res) {
	const user = await getUserWithPendingEmails(req, res)
	const emailVerif = await user.addPendingEmail(req.body.email)

	await emailVerif.save()
	await user.sendNotification(UserTemplates.ACTIVATE_EMAIL, {
		to: { name: user.fullName, email: emailVerif._id },
	})

	return formatEmailList(user)
}

async function activateUserEmail(req, res) {
	const user = await getUserWithPendingEmails(req, res)

	if (user.emails.includes(normalizeEmailAddress(req.params.email)))
		throw Errors.EmailAlreadyActivated

	const email = user.pendingEmails.find(
		(item) => item.email === normalizeEmailAddress(req.params.email)
	)

	if (!email) throw Errors.EmailNotFound

	if (!(await email.verifyActivationToken(req.body.token)))
		throw Errors.InvalidActivationToken

	await EmailVerification.deleteOne({ _id: email._id })

	user.emails.push(email._id)
	await user.save()

	return formatEmailList(user)
}

async function deleteUserEmail(req, res) {
	const user = await getUserWithPendingEmails(req, res)

	if (!(await user.removeEmail(req.params.email))) {
		if (!(await user.removePendingEmail(req.params.email))) {
			throw Errors.EmailNotFound
		}
	}

	res.code(204).send()
}

async function getUserPrimaryEmail(req, res) {
	const user = await getUser(req, res)
	if (!user.email) throw Errors.EmailNotFound
	return user.email
}

async function setUserPrimaryEmail(req, res) {
	const user = await getUser(req, res)

	user.setPrimaryEmail(req.body.email)
	await user.save()

	return formatEmailList(user)
}

function formatEmailList(user) {
	let list = []
	if (user.email) list.push({ email: user.emails[0], status: "primary" })
	list.push(
		...user.emails.slice(1).map((e) => ({ email: e, status: "active" })),
		...user.pendingEmails.map((e) => ({ email: e.email, status: "pending" }))
	)
	return list
}

module.exports = routes
