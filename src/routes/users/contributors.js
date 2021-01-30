const JWTAuth = require("../../service/JWTAuth")
const User = require("../../models/user")
const AccountStatus = require("../../constants/accountStatus")
const UserValidationSchema = require("../../schemas/validation/user")
const UserSerializationSchema = require("../../schemas/serialization/user")
const CommonSchema = require("../../schemas/commons")
const Errors = require("../errors")
const { getUser } = require("./users")
const { UserTemplates } = require("../../models/notifications/templates")

/************************ Routes ************************/

async function routes(fastify, options) {
	fastify.route({
		method: "GET",
		url: "/users/:user_id/contributors/",
		schema: {
			tags: ["contributors"],
			description: "Get a user's contributors",
			params: {
				user_id: CommonSchema.uuid1,
			},
			response: {
				200: {
					type: "array",
					items: UserSchema.contributor,
				},
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: getContributors,
	})

	fastify.route({
		method: "GET",
		url: "/users/:user_id/contributors/:contributor_id",
		schema: {
			tags: ["contributors"],
			description: "Get a user's contributor by ID",
			params: {
				user_id: CommonSchema.uuid1,
				contributor_id: CommonSchema.uuid2,
			},
			response: {
				200: UserSchema.contributor,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: getContributorById,
	})

	fastify.route({
		method: "POST",
		url: "/users/:user_id/contributors/",
		schema: {
			tags: ["contributors"],
			description:
				"Create a new contributor and add it to the authenticated user's contributors",
			params: {
				user_id: CommonSchema.uuid1,
			},
			body: UserValidationSchema.contributor,
			response: {
				201: UserSchema.contributor,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: createContributor,
	})

	fastify.route({
		method: "POST",
		url: "/users/:user_id/contributors/:contributor_id/upgrade",
		schema: {
			tags: ["contributors"],
			description: "Upgrade a contributor's account to a collaborator",
			params: {
				user_id: CommonSchema.uuid1,
				contributor_id: CommonSchema.uuid2,
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
				200: {
					type: "object",
					properties: {
						collaborators: {
							type: "array",
							items: UserSerializationSchema.public_user,
						},
						contributors: {
							type: "array",
							items: UserSerializationSchema.public_user,
						},
						user: UserSerializationSchema.public_user,
					},
				},
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: upgradeContributorById,
	})

	fastify.route({
		method: "PATCH",
		url: "/users/:user_id/contributors/:contributor_id",
		schema: {
			tags: ["contributors"],
			description: "Update a user's contributor by ID",
			params: {
				user_id: CommonSchema.uuid1,
				contributor_id: CommonSchema.uuid2,
			},
			body: UserValidationSchema.contributor,
			response: {
				200: UserSchema.contributor,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: updateContributorById,
	})

	fastify.route({
		method: "DELETE",
		url: "/users/:user_id/contributors/:contributor_id",
		schema: {
			tags: ["contributors"],
			description: "Delete a user's contributor by ID",
			params: {
				user_id: CommonSchema.uuid1,
				contributor_id: CommonSchema.uuid2,
			},
			response: {
				204: {},
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: deleteContributorById,
	})
}

/************************ Handlers ************************/

async function getContributorById(req, res) {
	const user = await getUser(req, res)
	if (!user.contributors.includes(req.params.contributor_id))
		throw Errors.ContributorNotFound

	return await User.findById(req.params.contributor_id)
}

async function getContributors(req, res) {
	const user = await getUser(req, res)
	await user.populate("contributors").execPopulate()
	return user.contributors
}

async function createContributor(req, res) {
	const user = await getUser(req, res)
	const contributor = new User({
		...req.body,
		accountStatus: AccountStatus.CONTRIBUTOR,
	})

	user.contributors.push(contributor._id)

	await contributor.save()
	await user.save()

	res.code(201)
	return contributor
}

async function upgradeContributorById(req, res) {
	const user = await getUser(req, res)
	const index = user.contributors.indexOf(req.params.contributor_id)

	if (index < 0) throw Errors.ContributorNotFound

	if (await User.findOne().byEmail(req.body.email)) throw Errors.ConflictingUser

	const contributor = await User.findById(req.params.contributor_id)

	const emailVerif = await contributor.addPendingEmail(req.body.email)
	contributor.accountStatus = AccountStatus.SPLIT_INVITED

	await contributor.save()
	await emailVerif.save()

	await contributor.sendNotification(UserTemplates.SPLIT_INVITED, {
		to: { name: contributor.fullName, email: emailVerif._id },
	})

	user.collaborators.push(contributor._id)
	user.contributors.splice(index, 1)
	await user.save()

	await user.populate("contributors").execPopulate()
	await user.populate("collaborators").execPopulate()

	for (let collab of user.collaborators) {
		if (!collab.professional_identity.public)
			collab.professional_identity = undefined
	}

	return {
		collaborators: user.collaborators,
		contributors: user.contributors,
		user: contributor,
	}
}

async function updateContributorById(req, res) {
	const contributor = await getContributorById(req, res)
	await contributor.update(req.body)
	return await User.findById(contributor._id)
}

async function deleteContributorById(req, res) {
	const user = await getUser(req, res)
	const index = user.contributors.indexOf(req.params.contributor_id)

	if (index < 0) throw Errors.ContributorNotFound

	user.contributors.splice(index, 1)
	await User.deleteOne({ _id: req.params.contributor_id })
	await user.save()

	res.code(204).send()
}

module.exports = routes
