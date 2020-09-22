const JWTAuth = require("../../service/JWTAuth")
const Controller = require("./handlers")
const WorkpieceSchema = require("../../schemas/workpieces")

/************************ Routes ************************/

async function routes(fastify, options) {
	fastify.route({
		method: "GET",
		url: "/workpieces/by-owner/:user_id/",
		schema: {
			params: {
				user_id: {
					type: "string",
				},
			},
			response: {
				200: { type: "array", items: WorkpieceSchema.workpiece },
			},
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: Controller.getWorkpiecesByOwner,
	})

	fastify.route({
		method: "GET",
		url: "/workpieces/:workpiece_id",
		schema: {
			params: {
				workpiece_id: {
					type: "string",
				},
			},
			response: {
				200: WorkpieceSchema.workpiece,
			},
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: Controller.getWorkpiece,
	})

	fastify.route({
		method: "POST",
		url: "/workpieces/",
		schema: {
			response: {
				201: WorkpieceSchema.workpiece,
			},
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: Controller.createWorkpiece,
	})

	fastify.route({
		method: "PATCH",
		url: "/workpieces/:workpiece_id",
		schema: {
			params: {
				workpiece_id: {
					type: "string",
				},
			},
			response: {
				200: WorkpieceSchema.workpiece,
			},
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: Controller.updateWorkpiece,
	})

	fastify.route({
		method: "DELETE",
		url: "/workpieces/:workpiece_id",
		schema: {
			params: {
				workpiece_id: {
					type: "string",
				},
			},
			response: {
				204: {},
			},
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: Controller.deleteWorkpiece,
	})

	fastify.route({
		method: "GET",
		url: "/workpieces/:workpiece_id/files/:file_id",
		schema: {
			params: {
				workpiece_id: {
					type: "string",
				},
				file_id: {
					type: "string",
				},
			},
		},
		handler: Controller.getWorkpieceFile,
	})

	fastify.route({
		method: "POST",
		url: "/workpieces/:workpiece_id/files/",
		schema: {
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
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: Controller.addWorkpieceFile,
	})

	fastify.route({
		method: "PATCH",
		url: "/workpieces/:workpiece_id/files/:file_id",
		schema: {
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
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: Controller.updateWorkpieceFile,
	})

	fastify.route({
		method: "POST",
		url: "/workpieces/:workpiece_id/rightSplit",
		schema: {
			params: {
				workpiece_id: {
					type: "string",
				},
			},
			response: {
				201: WorkpieceSchema.rightSplit,
			},
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: Controller.createRightSplit,
	})

	fastify.route({
		method: "PUT",
		url: "/workpieces/:workpiece_id/rightSplit",
		schema: {
			params: {
				workpiece_id: {
					type: "string",
				},
			},
			response: {
				200: WorkpieceSchema.rightSplit,
			},
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: Controller.updateRightSplit,
	})

	fastify.route({
		method: "DELETE",
		url: "/workpieces/:workpiece_id/rightSplit",
		schema: {
			params: {
				workpiece_id: {
					type: "string",
				},
			},
			response: {
				204: {},
			},
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: Controller.deleteRightSplit,
	})

	fastify.route({
		method: "POST",
		url: "/workpieces/:workpiece_id/rightSplit/submit",
		schema: {
			params: {
				workpiece_id: {
					type: "string",
				},
			},
			response: {
				204: {},
			},
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: Controller.submitRightSplit,
	})

	fastify.route({
		method: "POST",
		url: "/workpieces/:workpiece_id/rightSplit/vote",
		schema: {
			params: {
				workpiece_id: {
					type: "string",
				},
			},
			response: {
				204: {},
			},
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: Controller.voteRightSplit,
	})

	fastify.route({
		method: "POST",
		url: "/workpieces/:workpiece_id/rightSplit/swap-user",
		schema: {
			params: {
				workpiece_id: {
					type: "string",
				},
			},
			response: {
				204: {},
			},
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: Controller.swapRightSplitUser,
	})
}

module.exports = routes
