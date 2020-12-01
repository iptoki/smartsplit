const Errors = require("../errors")
const JWTAuth = require("../../service/JWTAuth")
const DocumentationSchemas = require("../../schemas/workpieces/documentation")

/************************ Routes ************************/

async function routes(fastify, options) {
	fastify.route({
		method: "GET",
		url: "/workpieces/:workpiece_id/documentation",
		schema: {
			tags: ["workpieces", "workpiece_documentation"],
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
		url: "/workpieces/:workpiece_id/documentaion/:field",
		schema: {
			tags: ["workpieces", "workpiece_documentation"],
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
						"files",
						"info",
						"lyrics",
						"streaming",
					],
				},
			},
			response: {
				200: DocumentationSchemas.documentationField,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: getDocumentationField,
		serializerCompiler: documentationFieldSerializer,
	})

	fastify.route({
		method: "PATCH",
		url: "/workpieces/:workpiece_id/documentation",
		schema: {
			tags: ["workpieces", "workpiece_documentation"],
			description: "Update a workpiece's documentation",
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
		handler: updateDocumentation,
	})

	fastify.route({
		method: "PATCH",
		url: "/workpieces/:workpiece_id/documentaion/:field",
		schema: {
			tags: ["workpiece_documentation"],
			description: "Patch a workpiece's documentation field",
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
						"files",
						"info",
						"lyrics",
						"streaming",
					],
				},
			},
			response: {
				200: DocumentationSchemas.documentationField,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: updateDocumentationField,
		serializerCompiler: documentationFieldSerializer,
	})

	fastify.route({
		method: "GET",
		url: "/workpieces/:workpiece_id/documentation/files/:file_id",
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
		handler: getFile,
	})

	fastify.route({
		method: "POST",
		url: "/workpieces/:workpiece_id/documentaion/files/",
		schema: {
			tags: ["workpieces", "workpieces_files"],
			description: "Create and add a new file to a workpiece's documentation",
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
		handler: createFile,
	})

	fastify.route({
		method: "PATCH",
		url: "/workpieces/:workpiece_id/documentation/files/:file_id",
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
		handler: updateFile,
	})
}

/************************ Handlers ************************/

const { getWorkpiece, getWorkpieceAsOwner } = require("./workpieces")

const _getWorkpieceFile = function (workpiece, file_id) {
	for (file of workpiece.documentation.files.art) {
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
	return {
		field: req.params.field,
		data: workpiece.documentation[req.params.field],
	}
}

const updateDocumentation = async function (req, res) {
	const workpiece = await getWorkpieceAsOwner(req, res)
	await workpiece.updateDocumentation(req.body)
	await workpiece.save()
	return workpiece.documentation
}

const updateDocumentationField = async function (req, res) {
	req.body = { [req.params.field]: req.body }
	const doc = await updateDocumentation(req, res)
	return doc[req.params.field]
}

const getFile = async function (req, res) {
	const workpiece = await getWorkpiece(req, res)
	const file = _getWorkpieceFile(workpiece, req.params.file_id)

	if (file.visibility !== "public") {
		await JWTAuth.requireAuthUser(req, res)
		if (workpiece.owner !== req.authUser._id) throw Errors.UserForbidden
	}

	res.header("Content-Type", file.mimeType)
	return file.data
}

const createFile = async function (req, res) {
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

const updateFile = async function (req, res) {
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

/************************ Custom serializer ************************/

/*
	fast-json-stringify does not support schema with `oneOf` being at the root.
	As a workaround, we mimic the `oneOf` mechanism  by defining a custom serializer 
	where we dinamicaly determine which schema should be serialized.
	See /src/schemas/workpieces/documentation.js for more information
*/

function documentationFieldSerializer(test) {
	const fastJson = require("fast-json-stringify")
	return (response) => {
		const stringify = fastJson(DocumentationSchemas[response.field])
		return stringify(response.data)
	}
}

module.exports = routes
