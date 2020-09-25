const JWTAuth = require("../../service/JWTAuth")
const Controller = require("./handlers")
const WorkpieceSchema = require("../../schemas/workpieces")

/************************ Routes ************************/

async function routes(fastify, options) {
	fastify.route({
		method: "GET",
		url: "/workpieces/by-owner/:user_id/" /* TODO: remove that ugly `/` */,
		schema: {
			tags: ["workpieces"],
			description: "Get workpieces by owner",
			params: {
				user_id: {
					type: "string",
				},
			},
			response: {
				200: { type: "array", items: WorkpieceSchema.workpiece },
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: Controller.getWorkpiecesByOwner,
	})

	fastify.route({
		method: "GET",
		url: "/workpieces/:workpiece_id",
		schema: {
			tags: ["workpieces"],
			description: "Get workpiece by ID",
			params: {
				workpiece_id: {
					type: "string",
				},
			},
			response: {
				200: WorkpieceSchema.workpiece,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: Controller.getWorkpiece,
	})

	fastify.route({
		method: "POST",
		url: "/workpieces/",
		schema: {
			tags: ["workpieces"],
			description: "Create a new workpiece in the system",
			body: WorkpieceSchema.workpieceRequestBody,
			response: {
				201: WorkpieceSchema.workpiece,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: Controller.createWorkpiece,
	})

	fastify.route({
		method: "PATCH",
		url: "/workpieces/:workpiece_id",
		schema: {
			tags: ["workpieces"],
			description: "Update a workpiece by ID",
			params: {
				workpiece_id: {
					type: "string",
				},
			},
			body: WorkpieceSchema.workpieceRequestBody,
			response: {
				200: WorkpieceSchema.workpiece,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: Controller.updateWorkpiece,
	})

	fastify.route({
		method: "DELETE",
		url: "/workpieces/:workpiece_id",
		schema: {
			tags: ["workpieces"],
			description: "Delete a workpiece by ID",
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
		handler: Controller.deleteWorkpiece,
	})

	fastify.route({
		method: "GET",
		url: "/workpieces/:workpiece_id/files/:file_id",
		schema: {
			tags: ["workpieces", "workpieces_files"],
			description: "Get a workpiece's file by ID",
			params: {
				workpiece_id: {
					type: "string",
				},
				file_id: {
					type: "string",
				},
			},
			response: {
				200: {},
			},
		},
		handler: Controller.getWorkpieceFile,
	})

	fastify.route({
		method: "POST",
		url: "/workpieces/:workpiece_id/files/",
		schema: {
			tags: ["workpieces", "workpieces_files"],
			description: "Create a new file in a workpiece",
			params: {
				workpiece_id: {
					type: "string",
				},
			},
			body: {
				allOf: [WorkpieceSchema.fileRequestBody],
				required: ["name", "mimeType", "data"],
			},
			response: {
				201: WorkpieceSchema.file,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: Controller.addWorkpieceFile,
	})

	fastify.route({
		method: "PATCH",
		url: "/workpieces/:workpiece_id/files/:file_id",
		schema: {
			tags: ["workpieces", "workpieces_files"],
			description: "Update a workpiece's file by ID",
			params: {
				workpiece_id: {
					type: "string",
				},
				file_id: {
					type: "string",
				},
			},
			body: WorkpieceSchema.fileRequestBody,
			response: {
				200: WorkpieceSchema.file,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: Controller.updateWorkpieceFile,
	})

	fastify.route({
		method: "POST",
		url: "/workpieces/:workpiece_id/rightSplit",
		schema: {
			tags: ["workpieces", "right_splits"],
			description: "Create a new right splits in a workpiece",
			params: {
				workpiece_id: {
					type: "string",
				},
			},
			body: WorkpieceSchema.rightSplitRequestBody,
			response: {
				201: WorkpieceSchema.rightSplit,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: Controller.createRightSplit,
	})

	fastify.route({
		method: "PUT",
		url: "/workpieces/:workpiece_id/rightSplit",
		schema: {
			tags: ["workpieces", "right_splits"],
			description: "Update a workpiece's right splits",
			params: {
				workpiece_id: {
					type: "string",
				},
			},
			body: WorkpieceSchema.rightSplitRequestBody,
			response: {
				200: WorkpieceSchema.rightSplit,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: Controller.updateRightSplit,
	})

	fastify.route({
		method: "DELETE",
		url: "/workpieces/:workpiece_id/rightSplit",
		schema: {
			tags: ["workpieces", "right_splits"],
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
		handler: Controller.deleteRightSplit,
	})

	fastify.route({
		method: "POST",
		url: "/workpieces/:workpiece_id/rightSplit/submit",
		schema: {
			tags: ["workpieces", "right_splits"],
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
		handler: Controller.submitRightSplit,
	})

	fastify.route({
		method: "POST",
		url: "/workpieces/:workpiece_id/rightSplit/vote",
		schema: {
			tags: ["workpieces", "right_splits"],
			description: "Vote for accepting or refusing a right split",
			params: {
				workpiece_id: {
					type: "string",
				},
			},
			body: WorkpieceSchema.rightSplitVoteBody,
			response: {
				204: {},
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: Controller.voteRightSplit,
	})

	fastify.route({
		method: "POST",
		url: "/workpieces/:workpiece_id/rightSplit/swap-user",
		schema: {
			tags: ["workpieces", "right_splits"],
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
		handler: Controller.swapRightSplitUser,
	})
}

module.exports = routes
