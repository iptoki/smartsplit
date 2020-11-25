const JWTAuth = require("../../service/JWTAuth")
const Controller = require("./handlers")
const WorkpieceSchemas = require("../../schemas/workpieces/workpieces")
const RightSplitSchemas = require("../../schemas/workpieces/rightSplits")
const DocumentationSchemas = require("../../schemas/workpieces/documentation")

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
				200: { type: "array", items: WorkpieceSchemas.workpiece },
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
				200: WorkpieceSchemas.workpiece,
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
			body: WorkpieceSchemas.workpieceRequestBody,
			response: {
				201: WorkpieceSchemas.workpiece,
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
			body: WorkpieceSchemas.workpieceRequestBody,
			response: {
				200: WorkpieceSchemas.workpiece,
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
				allOf: [DocumentationSchemas.fileRequestBody],
				required: ["name", "mimeType", "data"],
			},
			response: {
				201: DocumentationSchemas.file,
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
			body: DocumentationSchemas.fileRequestBody,
			response: {
				200: DocumentationSchemas.file,
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
			body: RightSplitSchemas.rightSplitRequestBody,
			response: {
				201: RightSplitSchemas.rightSplit,
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
			body: RightSplitSchemas.rightSplitRequestBody,
			response: {
				200: RightSplitSchemas.rightSplit,
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
			body: RightSplitSchemas.rightSplitVoteBody,
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

	fastify.route({
		method: "GET",
		url: "/workpieces/:workpiece_id/docs",
		schema: {
			tags: ["workpieces"],
			description: "Get a workpiece's documentation",
			params: {
				workpiece_id: {
					type: "string",
				},
			},
			response: {
				200: DocumentationSchemas.documentation,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: Controller.getDocumentation,
	})

	fastify.route({
		method: "GET",
		url: "/workpieces/:workpiece_id/docs/:field",
		schema: {
			tags: ["workpieces"],
			description: "Get a workpiece's documentation",
			params: {
				workpiece_id: {
					type: "string",
				},
				field: {
					type: "string",
					enum: ["creation", "performance", "recording", "release", "lyrics"],
				},
			},
			response: {
				200: DocumentationSchemas.documentation,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: Controller.getDocumentationField,
	})
}

module.exports = routes
