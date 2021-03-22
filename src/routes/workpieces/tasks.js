const Errors = require("../errors")
const JWTAuth = require("../../service/JWTAuth")
const Workpiece = require("../../models/workpiece/workpiece")
const WorkpieceSchema = require("../../schemas/workpieces/workpieces")
	.serialization.workpiece
const Tasks = require("../../constants/tasks")

/************************ Routes ************************/

async function routes(fastify, options) {
	fastify.route({
		method: "GET",
		url: "/workpieces/tasks/",
		schema: {
			tags: ["tasks"],
			description: "Get tasks",
			querystring: {
				rightHolders: { type: "array" },
				status: {
					type: "string",
					enum: Tasks.Status.list,
				},
				query: {
					type: "string",
				},
			},
			response: {
				200: { type: "array", items: WorkpieceSchema },
			},
			security: [{ bearerAuth: [] }],
		},
		//preValidation: JWTAuth.requireAuthLogistic,
		handler: getTasks,
	})
}

/************************ Handlers ************************/

const getTasks = async function (req, res) {
	return await Workpiece.find({
		$or: [
			{
				$and: [
					{ "collaborators.user": { $in: req.query.rightHolders } },
					{ "collaborators.isRightHolder": true },
				],
			},
			{
				title: { $regex: new RegExp(req.query.query), $options: "i" },
			},
			...Tasks.Types.list.map((x) => ({ ["tasks." + x]: req.query.status })), // #wizard
		],
	})
}

module.exports = routes
