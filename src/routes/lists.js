const JWTAuth = require("../service/JWTAuth")
const List = require("../models/lists/list")
const ListSchema = require("../schemas/lists")
const Errors = require("./errors")

/************************ Routes ************************/

async function routes(fastify, options) {
	fastify.route({
		method: "GET",
		url: "/entities/:list_type/",
		schema: {
			response: {
				200: { type: "array", items: { $ref: "ListEntitySchema" } },
			},
		},
		handler: getList,
	})

	fastify.route({
		method: "GET",
		url: "/entities/:entity_id",
		schema: {
			response: {
				200: { $ref: "ListEntitySchema" },
			},
		},
		handler: getListEntity,
	})

	fastify.route({
		method: "POST",
		url: "/entities/:list_type/",
		schema: {
			response: {
				200: { $ref: "ListEntitySchema" },
			},
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: createListEntity,
	})

	fastify.route({
		method: "PATCH",
		url: "/entities/:entity_id",
		schema: {
			response: {
				200: { $ref: "ListEntitySchema" },
			},
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: updateListEntity,
	})

	fastify.route({
		method: "DELETE",
		url: "/entities/:entity_id",
		schema: {
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

	const listModel = List.getListModel(req.params.list_type)
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
	const entity = await List.findById(req.params.entity_id)

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
	let query = List.find({ type: req.params.list_type })

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

module.exports = routes