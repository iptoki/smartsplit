const Errors = require("../errors")
const JWTAuth = require("../../service/JWTAuth")
const DocumentationSchemas = require("../../schemas/workpieces/documentation")

/************************ Routes ************************/

async function routes(fastify, options) {
	fastify.route({
		method: "GET",
		url: "/workpieces/:workpiece_id/documentation",
		schema: {
			tags: ["workpiece_documentation"],
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
		url: "/workpieces/:workpiece_id/documentation/:field",
		schema: {
			tags: ["workpiece_documentation"],
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
			// response: {
			// 	200: DocumentationSchemas.documentationField,
			// },
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: getDocumentationField,
	})

	fastify.route({
		method: "PATCH",
		url: "/workpieces/:workpiece_id/documentation",
		schema: {
			tags: ["workpiece_documentation"],
			description: "Update a workpiece's documentation",
			params: {
				workpiece_id: {
					type: "string",
				},
			},
			body: DocumentationSchemas.documentation,
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
		url: "/workpieces/:workpiece_id/documentation/:field",
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
			body: DocumentationSchemas.documentationField,
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
			tags: ["workpieces_documentation_files"],
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
		url: "/workpieces/:workpiece_id/documentation/files/:type/",
		schema: {
			tags: ["workpieces_documentation_files"],
			description: "Create and add a new file to a workpiece's documentation",
			params: {
				type: "object",
				properties: {
					workpiece_id: {
						type: "string",
					},
					type: {
						type: "string",
						enum: ["art", "audio", "scores", "midi", "lyrics"],
					},
				},
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
			tags: ["workpieces_documentation_files"],
			description: "Update a workpiece's file by ID",
			params: {
				type: "object",
				properties: {
					workpiece_id: {
						type: "string",
					},
					file_id: {
						type: "string",
					},
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

	fastify.route({
		method: "DELETE",
		url: "/workpieces/:workpiece_id/documentation/files/:file_id",
		schema: {
			tags: ["workpieces_documentation_files"],
			description: "Delete a workpiece's file by ID",
			params: {
				workpiece_id: {
					type: "string",
				},
				file_id: {
					type: "string",
				},
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: deleteFile,
	})
}

/************************ Handlers ************************/

const { getWorkpiece, getWorkpieceAsOwner } = require("./workpieces")

const getWorkpieceFileLocation = function (workpiece, file_id) {
	let index = -1
	let type
	for (type of ["art", "audio", "scores", "midi", "lyrics"]) {
		index = workpiece.documentation.files[type].indexOf(file_id)
		if (index >= 0) break
	}
	return { index, type }
}

const getWorkpieceFile = async function (workpiece, file_id) {
	const location = getWorkpieceFileLocation(workpiece, file_id)
	if (location.index < 0) throw Errors.WorkpieceFileNotFound
	await workpiece.populateFiles()
	return workpiece.documentation.files[location.type][location.index]
}

const getDocumentation = async function (req, res) {
	const workpiece = await getWorkpiece(req, res)
	await workpiece.populateDocumentation()
	return workpiece.documentation
}

const getDocumentationField = async function (req, res) {
	const workpiece = await getWorkpiece(req, res)
	await workpiece.populateDocumentation()
	res.schema(DocumentationSchemas[req.params.field])
	return workpiece.documentation[req.params.field]
	return {
		field: req.params.field,
		data: workpiece.documentation[req.params.field],
	}
}

const updateDocumentation = async function (req, res) {
	const workpiece = await getWorkpieceAsOwner(req, res)
	await workpiece.updateDocumentation(req.body)
	await workpiece.save()
	await workpiece.populateDocumentation()
	return workpiece.documentation
}

const updateDocumentationField = async function (req, res) {
	req.body = { [req.params.field]: req.body }
	const doc = await updateDocumentation(req, res)
	return {
		field: req.params.field,
		data: doc[req.params.field],
	}
}

const getFile = async function (req, res) {
	const workpiece = await getWorkpiece(req, res)
	const file = await workpiece.documentation.getFile(req.params.file_id)
	if (!file) throw Errors.WorkpieceFileNotFound
	if (file.metadata.visibility !== "public") {
		await JWTAuth.requireAuthUser(req, res)
		if (workpiece.owner !== req.authUser._id) throw Errors.UserForbidden
	}

	res.type(file.metadata.mimetype)
	return workpiece.documentation.getFileStream(req.params.file_id)
}

const createFile = async function (req, res) {
	const workpiece = await getWorkpieceAsOwner(req, res)
	const data = await req.file()

	if (data.file.truncated === true) throw Errors.FileTooLarge

	const file_id = await workpiece.documentation.addFile(req.params.type, data)
	await workpiece.save()

	res.code(201)
	return await getWorkpieceFile(workpiece, file_id)
}

const updateFile = async function (req, res) {
	const workpiece = await getWorkpieceAsOwner(req, res)
	const location = getWorkpieceFileLocation(workpiece, req.params.file_id)

	if (location.index < 0) throw Errors.WorkpieceFileNotFound

	const file = await workpiece.documentation.getFile(req.params.file_id)

	if (req.body.filename !== undefined) file.filename = req.body.filename
	if (req.body.visibility !== undefined)
		file.metadata.visibility = req.body.visibility
	if (req.body.type !== undefined && req.body.type !== location.type) {
		workpiece.documentation.files[req.body.type].push(file._id)
		workpiece.documentation.files[
			location.type
		] = workpiece.documentation.files[location.type].filter(
			(id) => id !== file._id
		)
		location.type = req.body.type
		location.index = workpiece.documentation.files[req.body.type].length - 1
	}
	await file.save()
	await workpiece.save()
	await workpiece.populateFiles()
	return workpiece.documentation.files[location.type][location.index]
}

const deleteFile = async function (req, res) {
	const workpiece = await getWorkpieceAsOwner(req, res)
	const location = getWorkpieceFileLocation(workpiece, req.params.file_id)
	if (location.index < 0) throw Errors.WorkpieceFileNotFound
	await workpiece.documentation.deleteFile(req.params.file_id)
	await workpiece.save()
	res.code(204).send()
}

module.exports = routes
