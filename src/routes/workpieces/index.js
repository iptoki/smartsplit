const JWTAuth = require("../service/JWTAuth")
const Controller = require("./handlers")

/************************ Routes ************************/

async function routes(fastify, options) {
	fastify.route({
		method: "GET",
		url: "/workpieces/by-owner/:user_id/",
		schema: {
			response: {
				200: { type: "array", items: { $ref: "WorkpieceSchema" } },
			},
		},
		preValidation: JWTAuth.getAuthUser,
		handler: Controller.getWorkpiecesByOwner,
	})

	fastify.route({
		method: "GET",
		url: "/workpieces/:workpiece_id",
		schema: {
			response: {
				200: { $ref: "WorkpieceSchema" },
			},
		},
		preValidation: JWTAuth.getAuthUser,
		handler: Controller.getWorkpiece,
	})

	fastify.route({
		method: "POST",
		url: "/workpieces/",
		schema: {
			response: {
				200: { $ref: "WorkpieceSchema" },
			},
		},
		preValidation: JWTAuth.getAuthUser,
		handler: Controller.createWorkpiece,
	})

	fastify.route({
		method: "PATCH",
		url: "/workpieces/:workpiece_id",
		schema: {
			response: {
				200: { $ref: "WorkpieceSchema" },
			},
		},
		preValidation: JWTAuth.getAuthUser,
		handler: Controller.updateWorkpiece,
	})

	fastify.route({
		method: "DELETE",
		url: "/workpieces/:workpiece_id",
		schema: {
			response: {
				204: {},
			},
		},
		preValidation: JWTAuth.getAuthUser,
		handler: Controller.deleteWorkpiece,
	})

	fastify.route({
		method: "GET",
		url: "/workpieces/:workpiece_id/files/:file_id",
		schema: {
			response: {
				200: { /* TODO */ },
			},
		},
		preValidation: JWTAuth.getAuthUser,
		handler: Controller.getWorkpieceFile,
	})

	fastify.route({
		method: "POST",
		url: "/workpieces/:workpiece_id/files/",
		schema: {
			response: {
				200: { $ref: "WorkpieceFileSchema" },
			},
		},
		preValidation: JWTAuth.getAuthUser,
		handler: Controller.addWorkpieceFile,
	})

	fastify.route({
		method: "PATCH",
		url: "/workpieces/:workpiece_id/files/:file_id",
		schema: {
			response: {
				200: { $ref: "WorkpieceFileSchema" },
			},
		},
		preValidation: JWTAuth.getAuthUser,
		handler: Controller.updateWorkpieceFile,
	})

	fastify.route({
		method: "POST",
		url: "/workpieces/:workpiece_id/rightSplit",
		schema: {
			response: {
				200: { $ref: "RightSplitSchema" },
			},
		},
		preValidation: JWTAuth.getAuthUser,
		handler: Controller.createRightSplit,
	})

	fastify.route({
		method: "PUT",
		url: "/workpieces/:workpiece_id/rightSplit",
		schema: {
			response: {
				200: { $ref: "RightSplitSchema" },
			},
		},
		preValidation: JWTAuth.getAuthUser,
		handler: Controller.updateRightSplit,
	})

	fastify.route({
		method: "DELETE",
		url: "/workpieces/:workpiece_id/rightSplit",
		schema: {
			response: {
				204: {},
			},
		},
		preValidation: JWTAuth.getAuthUser,
		handler: Controller.deleteRightSplit,
	})

	fastify.route({
		method: "POST",
		url: "/workpieces/:workpiece_id/rightSplit/submit",
		schema: {
			response: {
				204: {},
			},
		},
		preValidation: JWTAuth.getAuthUser,
		handler: Controller.submitRightSplit,
	})

	fastify.route({
		method: "POST",
		url: "/workpieces/:workpiece_id/rightSplit/vote",
		schema: {
			response: {
				204: {},
			},
		},
		preValidation: JWTAuth.getAuthUser,
		handler: Controller.voteRightSplit,
	})

	fastify.route({
		method: "POST",
		url: "/workpieces/:workpiece_id/rightSplit/swap-user",
		schema: {
			response: {
				204: {},
			},
		},
		preValidation: JWTAuth.getAuthUser,
		handler: Controller.swapRightSplitUser,
	})
}