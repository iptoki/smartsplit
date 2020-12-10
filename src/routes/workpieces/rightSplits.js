const Errors = require("../errors")
const User = require("../../models/user")
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
		handler: createRightSplit,
	})

	fastify.route({
		method: "PUT",
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
		handler: updateRightSplit,
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
		handler: deleteRightSplit,
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
			response: {
				204: {},
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: submitRightSplit,
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
		handler: voteRightSplit,
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
		handler: swapRightSplitUser,
	})
}

/************************ Handlers ************************/

const {
	getWorkpiece,
	getWorkpieceAsOwner,
	getWorkpieceAsRightHolder,
} = require("./workpieces")

const createRightSplit = async function (req, res) {
	const workpiece = await getWorkpieceAsOwner(req, res)

	if (!workpiece.canAcceptNewSplit()) throw Errors.ConflictingRightSplitState

	if (workpiece.rightSplit) workpiece.archivedSplits.push(workpiece.rightSplit)

	await workpiece.setRightSplit(req.body)
	await workpiece.save()

	res.code(201)
	return workpiece.rightSplit
}

const updateRightSplit = async function (req, res) {
	const workpiece = await getWorkpieceAsOwner(req, res)

	if (!workpiece.canUpdateRightSplit()) throw Errors.ConflictingRightSplitState

	await workpiece.setRightSplit(req.body)
	await workpiece.save()

	return workpiece.rightSplit
}

const deleteRightSplit = async function (req, res) {
	const workpiece = await getWorkpieceAsOwner(req, res)

	if (!workpiece.canUpdateRightSplit()) throw Errors.ConflictingRightSplitState

	workpiece.archivedSplits.push(workpiece.rightSplit)
	workpiece.rightSplit = undefined
	await workpiece.save()

	res.code(204).send()
}

const submitRightSplit = async function (req, res) {
	const workpiece = await getWorkpieceAsOwner(req, res)

	if (!workpiece.canUpdateRightSplit()) throw Errors.ConflictingRightSplitState

	await workpiece.submitRightSplit()
	await workpiece.save()

	res.code(204).send()
}

const voteRightSplit = async function (req, res) {
	const workpiece = await getWorkpieceAsRightHolder(req, res)

	if (!workpiece.canVoteRightSplit()) throw Errors.ConflictingRightSplitState

	workpiece.setVote(req.authUser._id, req.body)
	await workpiece.updateRightSplitState()
	await workpiece.save()

	res.code(204).send()
}

const swapRightSplitUser = async function (req, res) {
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
