const Errors = require("../errors")
const User = require("../../models/user")
const { UserTemplates } = require("../../models/notifications/templates")
const JWTAuth = require("../../service/JWTAuth")
const RightSplitSchemas = require("../../schemas/workpieces/rightSplits")

/************************ Routes ************************/

async function routes(fastify, options) {
	fastify.route({
		method: "POST",
		url: "/workpieces/:workpiece_id/rightSplit",
		schema: {
			tags: ["right_splits"],
			description: "Create a new right splits in a workpiece",
			params: {
				workpiece_id: {
					type: "string",
				},
			},
			body: RightSplitSchemas.rightSplitRequestBody,
			response: {
				201: RightSplitSchemas.rightSplit,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: create,
	})

	fastify.route({
		method: "PATCH",
		url: "/workpieces/:workpiece_id/rightSplit",
		schema: {
			tags: ["right_splits"],
			description: "Update a workpiece's right splits",
			params: {
				workpiece_id: {
					type: "string",
				},
			},
			body: RightSplitSchemas.rightSplitRequestBody,
			response: {
				200: RightSplitSchemas.rightSplit,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: update,
	})

	fastify.route({
		method: "DELETE",
		url: "/workpieces/:workpiece_id/rightSplit",
		schema: {
			tags: ["right_splits"],
			description: "Delete a workpiece's right splits",
			params: {
				workpiece_id: {
					type: "string",
				},
			},
			response: {
				204: {},
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: remove,
	})

	fastify.route({
		method: "POST",
		url: "/workpieces/:workpiece_id/rightSplit/submit",
		schema: {
			tags: ["right_splits"],
			description: "Submit a workpiece's right splits to the right holders",
			params: {
				workpiece_id: {
					type: "string",
				},
			},
			body: RightSplitSchemas.rightSplitSubmitBody,
			response: {
				204: {},
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: submit,
	})

	fastify.route({
		method: "POST",
		url: "/workpieces/:workpiece_id/rightSplit/vote",
		schema: {
			tags: ["right_splits"],
			description: "Vote for accepting or refusing a right split",
			params: {
				workpiece_id: {
					type: "string",
				},
			},
			body: RightSplitSchemas.rightSplitVoteBody,
			response: {
				204: {},
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: vote,
	})

	fastify.route({
		method: "POST",
		url: "/workpieces/:workpiece_id/rightSplit/swap-user",
		schema: {
			tags: ["right_splits"],
			description:
				"Substitute a right holders in a split by replacing it by an other one",
			params: {
				workpiece_id: {
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
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: swapUser,
	})
}

/************************ Handlers ************************/

const {
	getWorkpiece,
	getWorkpieceAsOwner,
	getWorkpieceAsRightHolder,
} = require("./workpieces")

const getWorkpieceAsAuthorizedUser = async function (req, res) {
	let workpiece
	try {
		workpiece = await getWorkpieceAsOwner(req, res)
	} catch (e) {
		workpiece = await getWorkpieceAsRightHolder(req, res)
	}
	return workpiece
}

const getWorkpieceAsSplitOwner = async function (req, res) {
	const workpiece = await getWorkpiece(req, res)
	if (!workpiece.rightSplit || workpiece.rightSplit.owner !== req.authUser._id)
		throw Errors.UserForbidden
	return workpiece
}

const create = async function (req, res) {
	const workpiece = await getWorkpieceAsAuthorizedUser(req, res)
	req.body.owner = req.authUser._id

	await workpiece.setRightSplit(req.body)
	await workpiece.save()
	await workpiece.populateRightSplit()

	res.code(201)
	return workpiece.rightSplit
}

const update = async function (req, res) {
	const workpiece = await getWorkpieceAsSplitOwner(req, res)

	await workpiece.setRightSplit(req.body)
	await workpiece.save()
	await workpiece.populateRightSplit()

	return workpiece.rightSplit
}

const remove = async function (req, res) {
	const workpiece = await getWorkpieceAsSplitOwner(req, res)

	workpiece.deleteRightSplit()
	await workpiece.save()

	res.code(204).send()
}

const submit = async function (req, res) {
	const workpiece = await getWorkpieceAsSplitOwner(req, res)

	let emails = {}
	for (item of req.body) emails[item.user_id] = item.email

	await workpiece.populate("rightHolders").execPopulate()

	for (const rh of workpiece.rightHolders) {
		if (emails[rh._id] && !rh.emails.includes(emails[rh._id])) {
			const pending = await rh.addPendingEmail(emails[rh._id])
			await pending.save()
			rh.sendNotification(UserTemplates.ACTIVATE_EMAIL, {
				to: { name: rh.fullName, email: emails[rh._id] },
			})
		}
	}

	workpiece.submitRightSplit(emails)
	await workpiece.save()

	res.code(204).send()
}

const vote = async function (req, res) {
	const workpiece = await getWorkpieceAsRightHolder(req, res)

	workpiece.setSplitVote(req.authUser._id, req.body)
	await workpiece.save()

	res.code(204).send()
}

const swapUser = async function (req, res) {
	const workpiece = await getWorkpiece(req, res)

	if (!workpiece.canVoteRightSplit()) throw Errors.ConflictingRightSplitState

	const data = workpiece.decodeToken(req.body.token)

	if (data) {
		const tokenUser = await User.findById(data.rightHolder_id)
		if (tokenUser && workpiece.rightHolders.includes(tokenUser._id)) {
			workpiece.swapRightHolder(tokenUser._id, req.authUser._id)
			await workpiece.save()

			res.code(204).send()
			return
		}
	}

	throw Errors.InvalidSplitToken
}

module.exports = routes
