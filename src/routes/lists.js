const JWTAuth = require("../service/JWTAuth")
const Entity = require("../models/lists/entity")
const ListSchema = require("../schemas/lists")
const Errors = require("./errors")

/************************ Routes ************************/

async function routes(fastify, options) {
	fastify.route({
		method: "GET",
		url: "/entities/:list_type/",
		schema: {
			tags: ["lists"],
			description: "Get a list by type",
			params: {
				list_type: {
					type: "string",
				},
			},
			response: {
				200: ListSchema.list,
			},
			security: [{ bearerAuth: [] }],
		},
		serializerCompiler: listSerializer,
		preValidation: JWTAuth.getAuthUser,
		handler: getList,
	})

	fastify.route({
		method: "GET",
		url: "/entities/:entity_id",
		schema: {
			tags: ["lists"],
			description: "Get a list entity by ID",
			params: {
				entity_id: {
					type: "string",
				},
			},
			response: {
				200: ListSchema.entity,
			},
			security: [{ bearerAuth: [] }],
		},
		serializerCompiler: entitySerializer,
		preValidation: JWTAuth.getAuthUser,
		handler: getListEntity,
	})

	fastify.route({
		method: "POST",
		url: "/entities/:list_type/",
		schema: {
			tags: ["lists"],
			description: "Create a new entity",
			params: {
				list_type: {
					type: "string",
				},
			},
			body: ListSchema.entityRequestBody,
			response: {
				201: ListSchema.entity,
			},
			security: [{ bearerAuth: [] }],
		},
		serializerCompiler: entitySerializer,
		preValidation: JWTAuth.requireAuthUser,
		handler: createListEntity,
	})

	fastify.route({
		method: "PATCH",
		url: "/entities/:entity_id",
		schema: {
			tags: ["lists"],
			description: "Update a list entity by ID",
			params: {
				entity_id: {
					type: "string",
				},
			},
			body: ListSchema.entityRequestBody,
			response: {
				200: ListSchema.entity,
			},
			security: [{ bearerAuth: [] }],
		},
		serializerCompiler: entitySerializer,
		preValidation: JWTAuth.requireAuthUser,
		handler: updateListEntity,
	})

	fastify.route({
		method: "DELETE",
		url: "/entities/:entity_id",
		schema: {
			tags: ["lists"],
			description: "Delete a list entity by ID",
			params: {
				entity_id: {
					type: "string",
				},
			},
			response: {
				204: {},
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: deleteListEntity,
	})
}

/************************ Handlers ************************/

async function createListEntity(req, res) {
	if (req.query.admin === true && !req.authUser.isAdmin)
		throw Errors.UserForbidden

	if (!req.authUser.isAdmin && req.params.list_type === "digital-distributors")
		throw Errors.UserForbidden

	const base =
		req.query.admin === true || req.params.list_type === "digital-distributors"
			? { users: false }
			: { users: [req.authUser._id] }

	const listModel = Entity.getEntityModel(req.params.list_type)
	if (!listModel) throw Errors.ListNotFound

	const entity = new listModel({ ...base, ...req.body })

	try {
		await entity.save()
	} catch (e) {
		if (e && e.code === 11000) throw Errors.ConflictingListEntity
		throw e
	}

	res.code(201)
	return filterAdminFields(entity, req.authUser)
}

async function getListEntity(req, res) {
	const entity = await Entity.findById(req.params.entity_id)

	if (!entity) throw Errors.ListEntityNotFound

	if (
		!req.authUser ||
		(!req.authUser.isAdmin &&
			(entity.users === false ||
				(Array.isArray(entity.users) &&
					!entity.users.includes(req.authUser._id))))
	)
		throw Errors.UserForbidden

	return filterAdminFields(entity, req.authUser)
}

async function getList(req, res) {
	let query = Entity.find({ type: req.params.list_type })

	if (!req.authUser) query = query.publicOnly()
	else if (!req.authUser.isAdmin) query = query.byUserId(req.authUser._id)

	const list = await query.exec()
	return list.map((entity) => filterAdminFields(entity, req.authUser))
}

async function updateListEntity(req, res) {
	if (!req.authUser.isAdmin && req.params.list_type === "digital-distributors")
		throw Errors.UserForbidden

	const entity = await getListEntity(req, res)

	if (!req.authUser.isAdmin) {
		delete req.body.adminReview
		delete req.body.users
	}

	entity.setFields(req.body)
	await entity.save()

	return filterAdminFields(entity, req.authUser)
}

async function deleteListEntity(req, res) {
	if (!req.authUser.isAdmin && req.params.list_type === "digital-distributors")
		throw Errors.UserForbidden

	const entity = await getListEntity(req, res)

	await entity.remove()
	res.code(204).send()
}

/************************ Custom serializer ************************/

/*
	fast-json-stringify does not support schema with `oneOf` being at the root.
	As a workaround, we mimic the `oneOf` mechanism  by defining a custom serializer 
	where we dinamicaly determine which schema should be serialized.
	See /src/schemas/lists.js for more information
*/

function entitySerializer({ schema, method, url, httpStatus }) {
	const fastJson = require("fast-json-stringify")
	return (entity) => {
		const stringify = fastJson(ListSchema[entity.type])
		return stringify(entity)
	}
}

function listSerializer({ schema, method, url, httpStatus }) {
	const fastJson = require("fast-json-stringify")
	return (list) => {
		if (list.length === 0) return JSON.stringify(list)
		const stringify = fastJson({
			type: "array",
			items: ListSchema[list[0].type],
		})
		return stringify(list)
	}
}

/************************ Helpers ************************/

function filterAdminFields(entity, authUser) {
	if (!authUser || !authUser.isAdmin) {
		entity.users = undefined
		entity.adminReview = undefined
	}

	return entity
}

module.exports = routes
