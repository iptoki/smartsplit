const JWTAuth = require("../service/JWTAuth")
const Entity = require("../models/lists/entity")
const ListSchema = require("../schemas/lists")
const Errors = require("./errors")

/************************ Routes ************************/

async function routes(fastify, options) {
	fastify.route({
		method: "GET",
		url: "/entities/:list_type/",
		serializerCompiler: listSerializer,
		schema: {
			params: {
				list_type: {
					type: "string",
				},
			},
			response: {
				200: ListSchema.list,
			},
		},
		preValidation: JWTAuth.getAuthUser,
		handler: getList,
	})

	fastify.route({
		method: "GET",
		url: "/entities/:entity_id",
		serializerCompiler: entitySerializer,
		schema: {
			params: {
				entity_id: {
					type: "string",
				},
			},
			response: {
				200: ListSchema.entity,
			},
		},
		preValidation: JWTAuth.getAuthUser,
		handler: getListEntity,
	})

	fastify.route({
		method: "POST",
		url: "/entities/:list_type/",
		serializerCompiler: entitySerializer,
		schema: {
			params: {
				list_type: {
					type: "string",
				},
			},
			response: {
				201: ListSchema.entity,
			},
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: createListEntity,
	})

	fastify.route({
		method: "PATCH",
		url: "/entities/:entity_id",
		serializerCompiler: entitySerializer,
		schema: {
			params: {
				entity_id: {
					type: "string",
				},
			},
			response: {
				200: ListSchema.entity,
			},
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: updateListEntity,
	})

	fastify.route({
		method: "DELETE",
		url: "/entities/:entity_id",
		schema: {
			params: {
				entity_id: {
					type: "string",
				},
			},
			response: {
				204: {},
			},
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
	return entity
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

	return entity
}

async function getList(req, res) {
	let query = Entity.find({ type: req.params.list_type })

	if (!req.authUser) query = query.publicOnly()
	else if (!req.authUser.isAdmin) query = query.byUserId(req.authUser._id)

	return await query.exec()
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

	return entity
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
	return (response) => {
		const stringify = fastJson(ListSchema[response.type])
		return stringify(response)
	}
}

function listSerializer({ schema, method, url, httpStatus }) {
	const fastJson = require("fast-json-stringify")
	return (response) => {
		if (response.length === 0) return JSON.stringify(response)
		const stringify = fastJson({
			type: "array",
			items: ListSchema[response[0].type],
		})
		return stringify(response)
	}
}

module.exports = routes
