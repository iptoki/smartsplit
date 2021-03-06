const Workpiece = require('../../models/workpiece')
const Tasks = require('../../constants/tasks')
const WorkpieceSchema = require('../../schemas/workpieces')
const Errors = require('../../errors')
const JWTAuth = require('../../service/JWTAuth')

/************************ Routes ************************/

async function routes(fastify, options) {
	fastify.route({
		method: 'GET',
		url: '/workpieces/by-owner/:user_id',
		schema: {
			tags: ['workpieces_general'],
			description: 'Get workpieces by owner',
			params: {
				user_id: { type: 'string' },
			},
			response: {
				200: { type: 'array', items: WorkpieceSchema.serialization.workpiece },
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: getWorkpiecesByOwner,
	})

	fastify.route({
		method: 'GET',
		url: '/workpieces/by-right-holder/:user_id',
		schema: {
			tags: ['workpieces_general'],
			description: 'Get workpieces by collaborator',
			params: {
				user_id: { type: 'string' },
			},
			response: {
				200: { type: 'array', items: WorkpieceSchema.serialization.workpiece },
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: getWorkpiecesByRightHolder,
	})

	fastify.route({
		method: 'GET',
		url: '/workpieces/:workpiece_id',
		schema: {
			tags: ['workpieces_general'],
			description: 'Get workpiece by ID',
			params: {
				workpiece_id: { type: 'string' },
			},
			response: {
				200: WorkpieceSchema.serialization.workpiece,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: getWorkpiece,
		preSerialization: async function (req, res, payload) {
			await payload.populateAll()
			return payload
		},
	})

	fastify.route({
		method: 'POST',
		url: '/workpieces/',
		schema: {
			tags: ['workpieces_general'],
			description: 'Create a new workpiece in the system',
			body: {
				allOf: [WorkpieceSchema.validation.createUpdateWorkpiece],
				required: ['title'],
			},
			response: {
				201: WorkpieceSchema.serialization.workpiece,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: createWorkpiece,
	})

	fastify.route({
		method: 'PATCH',
		url: '/workpieces/:workpiece_id',
		schema: {
			tags: ['workpieces_general'],
			description: 'Update a workpiece by ID',
			params: {
				workpiece_id: { type: 'string' },
			},
			body: WorkpieceSchema.validation.createUpdateWorkpiece,
			response: {
				200: WorkpieceSchema.serialization.workpiece,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: updateWorkpiece,
	})

	fastify.route({
		method: 'DELETE',
		url: '/workpieces/:workpiece_id',
		schema: {
			tags: ['workpieces_general'],
			description: 'Delete a workpiece by ID',
			params: {
				workpiece_id: { type: 'string' },
			},
			response: {
				204: {},
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: deleteWorkpiece,
	})

	fastify.route({
		method: 'POST',
		url: '/workpieces/:workpiece_id/collaborators/:collaborator_id',
		schema: {
			tags: ['workpieces_general'],
			description: 'Add a collaborator by ID',
			params: {
				workpiece_id: { type: 'string' },
				collaborator_id: { type: 'string' },
			},
			response: {
				204: {},
			},
			security: [{ bearerAuth: [] }],
			dbOperation: 'update',
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: addCollaboratorById,
	})

	fastify.route({
		method: 'PATCH',
		url: '/workpieces/:workpiece_id/collaborators/:collaborator_id',
		schema: {
			tags: ['workpieces_general'],
			description: "Update a collaborator's permission by ID",
			params: {
				workpiece_id: { type: 'string' },
				collaborator_id: { type: 'string' },
			},
			response: {
				204: {},
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: updateCollaboratorById,
	})

	fastify.route({
		method: 'DELETE',
		url: '/workpieces/:workpiece_id/collaborators/:collaborator_id',
		schema: {
			tags: ['workpieces_general'],
			description: 'Delete a collaborator by ID',
			params: {
				workpiece_id: { type: 'string' },
				collaborator_id: { type: 'string' },
			},
			response: {
				204: {},
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: deleteCollaboratorById,
	})

	fastify.route({
		method: 'PUT',
		url: '/workpieces/:workpiece_id/disableEditorNotif/',
		schema: {
			tags: ['workpieces_general'],
			description: 'Disable editor notification for auth user',
			params: {
				workpiece_id: { type: 'string' },
			},
			response: {
				204: {},
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: disableEditorNotif,
	})
}

/************************ Handlers ************************/

const getWorkpiece = async function (req, res) {
	const populate = req.authUser
		? {
				path: 'editorSplit',
				match: { rightHolder_id: req.authUser.id },
		  }
		: []
	return await Workpiece.ensureExistsAndRetrieve(
		req.params.workpiece_id,
		populate
	)
}

const getWorkpieceAsOwner = async function (req, res) {
	const workpiece = await getWorkpiece(req, res)

	if (workpiece.owner !== req.authUser._id) throw Errors.UserForbidden

	return workpiece
}

const getWorkpieceAsRightHolder = async function (req, res) {
	const workpiece = await getWorkpiece(req, res)

	if (!workpiece.getRightHolderIds().includes(req.authUser._id))
		throw Errors.UserForbidden

	return workpiece
}

const getWorkpieceWithWritePermission = async function (req, res) {
	const workpiece = await getWorkpiece(req, res)
	if (
		!['write', 'admin'].includes(
			workpiece.getCollaboratorPermission(req.authUser._id)
		)
	)
		throw Errors.UserForbidden
	return workpiece
}

const createWorkpiece = async function (req, res) {
	req.body.owner = req.authUser._id
	const workpiece = new Workpiece(req.body)
	await workpiece.save()
	req.setTransactionResource(workpiece)
	await workpiece.populateAll()
	res.code(201)
	return workpiece
}

const updateWorkpiece = async function (req, res) {
	const workpiece = await getWorkpieceAsOwner(req, res)
	req.setTransactionResource(workpiece)

	for (let field of ['title'])
		if (req.body[field]) workpiece[field] = req.body[field]

	if (req.body.documentation !== undefined)
		await workpiece.documentation.update(req.body.documentation)

	await workpiece.save()
	await workpiece.populateAll()

	return workpiece
}

const deleteWorkpiece = async function (req, res) {
	const workpiece = await getWorkpieceAsOwner(req, res)
	req.setTransactionResource(workpiece)

	if (!workpiece.isRemovable()) throw Errors.ConflictingRightSplitState

	await workpiece.remove()
	res.code(204).send()
}

const getWorkpiecesByOwner = async function (req, res) {
	const workpieces = await Workpiece.find().byOwner(req.params.user_id)
	let promises = []
	for (const workpiece of workpieces) promises.push(workpiece.populateAll())
	return await Promise.all(promises)
}

const getWorkpiecesByRightHolder = async function (req, res) {
	const workpieces = await Workpiece.find().byCollaborator(req.params.user_id)
	let promises = []
	for (const workpiece of workpieces) promises.push(workpiece.populateAll())
	return await Promise.all(promises)
}

const addCollaboratorById = async function (req, res) {
	const workpiece = await getWorkpieceWithWritePermission(req, res)
	req.setTransactionResource(workpiece)

	workpiece.addCollaboratorById(req.params.collaborator_id, req.body.permission)
	await workpeice.save()
	return
}

const updateCollaboratorById = async function (req, res) {
	const workpiece = await getWorkpieceWithWritePermission(req, res)
	req.setTransactionResource(workpiece)

	workpiece.updateCollaboratorById(
		req.params.collaborator_id,
		req.body.permission
	)
	await workpeice.save()
	return
}

const deleteCollaboratorById = async function (req, res) {
	const workpiece = await getWorkpieceWithWritePermission(req, res)
	req.setTransactionResource(workpiece)

	workpiece.deleteCollaboratorById(req.body.collaborator_id)
	await workpiece.save()
	return
}

const disableEditorNotif = async function (req, res) {
	const workpiece = await getWorkpieceAsRightHolder(req, res)
	workpiece.collaborators.forEach((x) => {
		if (x.user === req.authUser._id) x.displayEditorNotif = false
	})
	await workpiece.save()
	res.code(204).send()
}

module.exports = {
	routes,
	getWorkpiece,
	getWorkpieceAsOwner,
	getWorkpieceAsRightHolder,
}
