const JWTAuth = require('../../service/JWTAuth')
const EmailVerification = require('../../models/emailVerification')
const { UserTemplates } = require('../../models/notificationTemplates')
const UserSchema = require('../../schemas/users')
const Errors = require('../../errors')
const { getUserWithAuthorization } = require('./users')

/************************ Routes ************************/

async function routes(fastify, options) {
	fastify.route({
		method: 'GET',
		url: '/users/:user_id/emails/',
		schema: {
			tags: ['users_emails'],
			description: "Get a user's email list",
			params: {
				user_id: { type: 'string' },
			},
			response: {
				200: UserSchema.serialization.emailStatusList,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: getUserEmails,
	})

	fastify.route({
		method: 'POST',
		url: '/users/:user_id/emails/',
		schema: {
			tags: ['users_emails'],
			description: "Create a new email in a user's account",
			params: {
				user_id: { type: 'string' },
			},
			body: {
				type: 'object',
				required: ['email'],
				properties: {
					email: { type: 'string' },
				},
				additionalProperties: false,
			},
			response: {
				201: UserSchema.serialization.emailStatusList,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: createUserEmail,
	})

	fastify.route({
		method: 'POST',
		url: '/users/activate-email',
		schema: {
			tags: ['users_emails'],
			description: "Activate a user's email",
			body: {
				type: 'object',
				required: ['token'],
				properties: {
					token: { type: 'string' },
				},
				additionalProperties: false,
			},
			response: {
				200: UserSchema.serialization.emailStatusList,
			},
			dbOperation: 'update',
		},
		handler: activateUserEmail,
	})

	fastify.route({
		method: 'POST',
		url: '/users/:user_id/emails/primary',
		schema: {
			tags: ['users_emails'],
			description: 'Set a user email to the primary one',
			params: {
				user_id: { type: 'string' },
			},
			body: {
				type: 'object',
				required: ['email'],
				properties: {
					email: { type: 'string' },
				},
				additionalProperties: false,
			},
			response: {
				200: UserSchema.serialization.emailStatusList,
			},
			security: [{ bearerAuth: [] }],
			dbOperation: 'update',
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: setUserPrimaryEmail,
	})

	fastify.route({
		method: 'GET',
		url: '/users/:user_id/emails/primary',
		schema: {
			tags: ['users_emails'],
			description: 'Get the user primary email',
			params: {
				user_id: { type: 'string' },
			},
			response: {
				200: { type: 'string' },
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: getUserPrimaryEmail,
	})

	fastify.route({
		method: 'DELETE',
		url: '/users/:user_id/emails/:email',
		schema: {
			tags: ['users_emails'],
			description: "Delete a user's email",
			params: {
				user_id: { type: 'string' },
				email: { type: 'string' },
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
	const user = await getUserWithAuthorization(req)
	await user.populate('_pendingEmails').execPopulate()
	return user
}

async function getUserEmails(req, res) {
	return formatEmailList(await getUserWithPendingEmails(req, res))
}

async function createUserEmail(req, res) {
	const user = await getUserWithPendingEmails(req, res)
	const emailVerif = await user.addPendingEmail(
		req.body.email,
		UserTemplates.ACTIVATE_EMAIL
	)
	req.setTransactionResource(emailVerif)
	return formatEmailList(user)
}

async function activateUserEmail(req, res) {
	const user = await User.activate(req.body.token)
	req.setTransactionResource(user)
	await user.save()
	return formatEmailList(user)
}

async function deleteUserEmail(req, res) {
	const user = await getUserWithPendingEmails(req, res)
	req.setTransactionResource(user)
	if (!(await user.deleteEmail(req.params.email))) throw Errors.EmailNotFound

	await user.save()

	res.code(204).send()
}

async function getUserPrimaryEmail(req, res) {
	const user = await getUserWithAuthorization(req)
	if (!user.email) throw Errors.EmailNotFound
	return user.email
}

async function setUserPrimaryEmail(req, res) {
	const user = await getUserWithAuthorization(req)
	req.setTransactionResource(user)
	user.setPrimaryEmail(req.body.email)
	await user.save()

	return formatEmailList(user)
}

function formatEmailList(user) {
	let list = []
	if (user.email) list.push({ email: user.emails[0], status: 'primary' })
	list.push(
		...user.emails.slice(1).map((e) => ({ email: e, status: 'active' })),
		...user.pendingEmails.map((e) => ({ email: e, status: 'pending' }))
	)
	return list
}

module.exports = routes
