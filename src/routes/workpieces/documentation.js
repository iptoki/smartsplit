const Errors = require("../errors")
const JWTAuth = require("../../service/JWTAuth")
const DocumentationSchemas = require("../../schemas/workpieces/documentation")

/************************ Routes ************************/

async function routes(fastify, options) {
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
		handler: getDocumentation,
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
					enum: [
						"creation",
						"performance",
						"recording",
						"release",
						"info",
						"lyrics",
						"streaming",
					],
				},
			},
			response: {
				200: DocumentationSchemas.documentation,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: getDocumentationField,
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
		handler: getWorkpieceFile,
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
		handler: addWorkpieceFile,
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
		handler: updateWorkpieceFile,
	})
}

/************************ Handlers ************************/

const { getWorkpiece, getWorkpieceAsOwner } = require("./workpieces")

const _getWorkpieceFile = function (workpiece, file_id) {
	for (file of workpiece.files) {
		if (file._id === file_id) {
			return file
		}
	}
	throw Errors.WorkpieceFileNotFound
}

const getDocumentation = async function (req, res) {
	const workpiece = await getWorkpiece(req, res)
	return workpiece.documentation
}

const getDocumentationField = async function (req, res) {
	const workpiece = await getWorkpiece(req, res)
	return workpiece.documentation[req.params.field]
}

const getWorkpieceFile = async function (req, res) {
	const workpiece = await Workpiece.findById(req.params.workpiece_id)
	if (!workpiece) throw Errors.WorkpieceNotFound

	const file = _getWorkpieceFile(workpiece, req.params.file_id)

	if (file.visibility !== "public") {
		await JWTAuth.requireAuthUser(req, res)
		if (workpiece.owner !== req.authUser._id) throw Errors.UserForbidden
	}

	res.header("Content-Type", file.mimeType)
	return file.data
}

const addWorkpieceFile = async function (req, res) {
	const workpiece = await getWorkpieceAsOwner(req, res)
	const file = workpiece.addFile(
		req.body.name,
		req.body.mimeType,
		req.body.visibility,
		Buffer.from(req.body.data, "base64")
	)
	await workpiece.save()
	res.code(201)
	return file
}

const updateWorkpieceFile = async function (req, res) {
	const workpiece = await getWorkpieceAsOwner(req, res)
	const file = _getWorkpieceFile(workpiece, req.params.file_id)
	for (field of ["name", "mimeType", "visibility"]) {
		if (req.body[field]) file[field] = req.body[field]
	}
	if (req.body.data) {
		const data = Buffer.from(req.body.data, "base64")
		file.data = data
		file.size = data.length
	}
	await workpiece.save()
	return file
}

const getWorkpiecesByOwner = async function (req, res) {
	return await Workpiece.find().byOwner(req.params.user_id)
}

module.exports = routes
