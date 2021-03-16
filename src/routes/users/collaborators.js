const JWTAuth = require("../../service/JWTAuth")
const User = require("../../models/user")
const EmailVerification = require("../../models/emailVerification")
const AccountStatus = require("../../constants/accountStatus")
const UserSchema = require("../../schemas/users")
const Errors = require("../errors")
const { UserTemplates } = require("../../models/notificationTemplates")
const { getUserWithAuthorization } = require("./users")

/************************ Routes ************************/

async function routes(fastify, options) {
	fastify.route({
		method: "GET",
		url: "/users/:user_id/collaborators/",
		schema: {
			tags: ["collaborators"],
			description: "Get a user's collaborators",
			params: {
				user_id: { type: "string" },
			},
			querystring: {
				search_terms: { type: "string" },
				degree: {
					type: "integer",
					minimum: 1,
					maximum: 4,
					default: 1,
				},
				limit: {
					type: "integer",
					minimum: 1,
					maximum: 250,
					default: 50,
				},
				skip: {
					type: "integer",
					minimum: 0,
					default: 0,
				},
			},
			response: {
				200: {
					type: "array",
					items: UserSchema.serialization.collaborator,
				},
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: getCollaborators,
	})

	fastify.route({
		method: "GET",
		url: "/users/:user_id/collaborators/:collaborator_id",
		schema: {
			tags: ["collaborators"],
			description: "Get a user's collaborator by ID",
			params: {
				user_id: { type: "string" },
				collaborator_id: { type: "string" },
			},
			response: {
				200: UserSchema.serialization.collaborator,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: getCollaboratorById,
	})

	fastify.route({
		method: "POST",
		url: "/users/:user_id/collaborators/",
		schema: {
			tags: ["collaborators"],
			description:
				"Create a new collaborator and add it to the authenticated user's collaborators",
			params: {
				user_id: { type: "string" },
			},
			body: UserSchema.validation.createCollaborator,
			response: {
				201: UserSchema.serialization.collaborator,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: createCollaborator,
	})

	fastify.route({
		method: "POST",
		url: "/users/:user_id/collaborators/:collaborator_id",
		schema: {
			tags: ["collaborators"],
			description:
				"Add an existing user to the authenticated user's collaborators",
			params: {
				user_id: { type: "string" },
				collaborator_id: { type: "string" },
			},
			response: {
				200: UserSchema.serialization.user,
			},
			security: [{ bearerAuth: [] }],
			dbOperation: "update",
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: addCollaboratorById,
	})

	fastify.route({
		method: "DELETE",
		url: "/users/:user_id/collaborators/:collaborator_id",
		schema: {
			tags: ["collaborators"],
			description: "Delete a user's collaborator by ID",
			params: {
				user_id: { type: "string" },
				collaborator_id: { type: "string" },
			},
			response: {
				204: {},
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: deleteCollaboratorById,
	})
}

/************************ Handlers ************************/

async function getCollaborators(req, res) {
	const user = await getUserWithAuthorization(req)
	return await user.getCollaborators(
		parseInt(req.query.degree),
		req.query.search_terms,
		parseInt(req.query.limit),
		parseInt(req.query.skip)
	)
}

async function getCollaboratorById(req, res) {
	const user = await getUserWithAuthorization(req)
	if (!user.collaborators.includes(req.params.collaborator_id))
		throw Errors.CollaboratorNotFound

	return await User.findById(req.params.collaborator_id).populate(
		"_pendingEmails"
	)
}

async function createCollaborator(req, res) {
	const user = await getUserWithAuthorization(req)
	const collaborator = await user.createCollaborator(req.body)
	await collaborator.populate("_pendingEmails").execPopulate()
	res.code(201)
	req.setTransactionResource(collaborator)
	return collaborator
}

async function addCollaboratorById(req, res) {
	const user = await getUserWithAuthorization(req)
	req.setTransactionResource(user)

	await user.addCollaborators([req.params.collaborator_id])
	await user.save()

	return user
}

async function deleteCollaboratorById(req, res) {
	const user = await getUserWithAuthorization(req)
	req.setTransactionResource(user)

	if (!user.deleteCollaboratorById(req.params.collaborator_id))
		throw Errors.CollaboratorNotFound

	await user.save()
	res.code(204).send()
}

module.exports = routes
