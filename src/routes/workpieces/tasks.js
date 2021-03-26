const Errors = require('../../errors')
const JWTAuth = require('../../service/JWTAuth')
const Workpiece = require('../../models/workpiece')
const WorkpieceSchema = require('../../schemas/workpieces').serialization
	.workpiece
const Tasks = require('../../constants/tasks')
const { getWorkpieceAsOwner } = require('./workpieces')

/************************ Routes ************************/

async function routes(fastify, options) {
	fastify.route({
		method: 'GET',
		url: '/workpieces/tasks/',
		schema: {
			tags: ['tasks'],
			description: 'Get tasks',
			querystring: {
				rightHolders: { type: 'array' },
				status: {
					type: 'string',
					enum: Tasks.Status.list,
				},
				query: {
					type: 'string',
				},
			},
			response: {
				200: { type: 'array', items: WorkpieceSchema },
			},
			security: [{ bearerAuth: [] }],
		},
		//preValidation: JWTAuth.requireAuthLogistic,
		handler: getTasks,
	})

	fastify.route({
		method: 'PUT',
		url: '/workpieces/:workpiece_id/tasks/:task',
		schema: {
			tags: ['workpieces_general'],
			description: "Update a workpiece's task status",
			params: {
				workpiece_id: { type: 'string' },
				task: { type: 'string', enum: Tasks.Types.list },
			},
			body: {
				type: 'object',
				properties: { status: { type: 'string', enum: Tasks.Status.list } },
				additionalProperties: false,
			},
			response: {
				200: WorkpieceSchema,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: updateTaskStatus,
	})
}

/************************ Handlers ************************/

const getTasks = async function (req, res) {
	return await Workpiece.find({
		$or: [
			{
				$and: [
					{ 'collaborators.user': { $in: req.query.rightHolders } },
					{ 'collaborators.isRightHolder': true },
				],
			},
			{
				title: { $regex: new RegExp(req.query.query), $options: 'i' },
			},
			...Tasks.Types.list.map((x) => ({ [`tasks.${x}`]: req.query.status })), // #wizard
		],
	})
}

const updateTaskStatus = async function (req, res) {
	const workpiece = await getWorkpieceAsOwner(req)

	if (
		(!req.authUser.isAdmin || !req.authUser.isLogistic) &&
		(![Tasks.Status.UNREQUESTED, Tasks.Status.CANCELED].includes(
			workpiece.tasks[req.params.task]
		) ||
			req.body.status !== Tasks.Status.REQUESTED)
	)
		throw Errors.UserForbidden

	workpiece.updateTaskStatus(req.params.task, req.body.status)

	await workpiece.save()
	return workpiece
}

module.exports = routes
