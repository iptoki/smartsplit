const JWTAuth = require("../service/JWTAuth")
const Entity = require("../models/entities/entity")
const EntitySchema = require("../schemas/entities")
const EntityTypes = require("../constants/entityTypes")
const Errors = require("./errors")

/************************ Routes ************************/

async function routes(fastify, options) {
	fastify.route({
		method: "GET",
		url: "/entities/:entity_type/",
		schema: {
			tags: ["entities"],
			description: "Get a list of entities by type and optional search terms",
			params: {
				entity_type: {
					type: "string",
					enum: EntityTypes.list,
				},
			},
			querystring: {
				search_terms: { type: "string" },
				limit: {
					type: "integer",
					default: 50,
					minimum: 1,
					maximum: 250,
				},
				skip: {
					type: "integer",
					default: 0,
					minimum: 0,
				},
			},
			response: {
				200: { type: "array", items: EntitySchema.serialization.entity },
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.getAuthUser,
		handler: getEntities,
	})

	fastify.route({
		method: "GET",
		url: "/entities/:entity_id",
		schema: {
			tags: ["entities"],
			description: "Get an entity by ID",
			params: {
				entity_id: {
					type: "string",
					enum: EntityTypes.list,
				},
			},
			response: {
				200: EntitySchema.serialization.entity,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.getAuthUser,
		handler: getEntityById,
	})

	fastify.route({
		method: "POST",
		url: "/entities/:entity_type/",
		schema: {
			tags: ["entities"],
			description: "Create a new entity",
			params: {
				entity_type: {
					type: "string",
					enum: EntityTypes.list,
				},
			},
			body: EntitySchema.validation.createUpdateEntity,
			response: {
				201: EntitySchema.serialization.entity,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: createEntity,
	})

	fastify.route({
		method: "PATCH",
		url: "/entities/:entity_id",
		schema: {
			tags: ["entities"],
			description: "Update an entity by ID",
			params: {
				entity_id: {
					type: "string",
					enum: EntityTypes.list,
				},
			},
			body: EntitySchema.validation.createUpdateEntity,
			response: {
				200: EntitySchema.serialization.entity,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: updateEntity,
	})

	fastify.route({
		method: "DELETE",
		url: "/entities/:entity_id",
		schema: {
			tags: ["entities"],
			description: "Delete an entity by ID",
			params: {
				entity_id: {
					type: "string",
					enum: EntityTypes.list,
				},
			},
			response: {
				204: {},
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: deleteEntity,
	})

	// Secret route available for admins only
	// Seed a list of entities in the database.
	// Data set that will be seeded are located in /smartsplit/data/
	fastify.route({
		method: "POST",
		url: "/entities/:entity_type/seed",
		schema: {
			hide: true,
			params: {
				entity_type: {
					type: "string",
				},
			},
		},
		preValidation: JWTAuth.requireAuthAdmin,
		handler: seedEntities,
	})
}

/************************ Handlers ************************/

async function createEntity(req, res) {
	if (req.query.admin === true && !req.authUser.isAdmin)
		throw Errors.UserForbidden

	if (
		!req.authUser.isAdmin &&
		req.params.entity_type === EntityTypes.DIGITAL_DISTRIBUTOR
	)
		throw Errors.UserForbidden

	const base =
		req.query.admin === true ||
		req.params.entity_type === EntityTypes.DIGITAL_DISTRIBUTOR
			? { users: false }
			: { users: [req.authUser._id] }

	const entityModel = Entity.getEntityModel(req.params.entity_type)
	if (!entityModel) throw Errors.EntityTypeNotFound

	const entity = new entityModel({ ...base, ...req.body })

	await entity.save()

	res.code(201).schema(EntitySchema.serialization[entity.type])
	return entity
}

async function getEntityById(req, res) {
	const entity = await Entity.findById(req.params.entity_id)

	if (!entity) throw Errors.EntityNotFound

	if (
		!req.authUser ||
		(!req.authUser.isAdmin &&
			(entity.users === false ||
				(Array.isArray(entity.users) &&
					!entity.users.includes(req.authUser._id))))
	)
		throw Errors.UserForbidden

	res.schema(EntitySchema.serialization[entity.type])
	return entity
}

async function getEntities(req, res) {
	let regex = ""
	if (req.query.search_terms) {
		let search_terms = [req.query.search_terms]
		if (req.query.search_terms.includes(" "))
			search_terms = search_terms.concat(req.query.search_terms.split(" "))
		regex = new RegExp(search_terms.join("|"))
	}

	let query = Entity.find({
		type: req.params.entity_type,
		$or: [
			{ name: { $regex: regex, $options: "i" } },
			{ "langs.en": { $regex: regex, $options: "i" } },
			{ "langs.fr": { $regex: regex, $options: "i" } },
		],
	})
		.skip(parseInt(req.query.skip))
		.limit(parseInt(req.query.limit))

	if (!req.authUser) query = query.publicOnly()
	else if (!req.authUser.isAdmin) query = query.byUserId(req.authUser._id)

	const entities = await query.exec()
	res.schema({
		type: "array",
		items: EntitySchema.serialization[req.params.entity_type],
	})
	return entities
}

async function updateEntity(req, res) {
	if (
		!req.authUser.isAdmin &&
		req.params.entity_type === EntityTypes.DIGITAL_DISTRIBUTOR
	)
		throw Errors.UserForbidden

	const entity = await getEntityById(req, res)

	if (!req.authUser.isAdmin) {
		delete req.body.adminReview
		delete req.body.users
	}

	entity.setFields(req.body)
	await entity.save()

	res.schema(EntitySchema.serialization[entity.type])
	return entity
}

async function deleteEntity(req, res) {
	if (
		!req.authUser.isAdmin &&
		req.params.entity_type === EntityTypes.DIGITAL_DISTRIBUTOR
	)
		throw Errors.UserForbidden

	const entity = await getEntityById(req, res)

	await entity.remove()
	res.code(204).send()
}

async function seedEntities(req, res) {
	const fs = require("fs")
	const uuid = require("uuid").v4
	const data = fs.readFileSync(`./data/${req.params.entity_type}s.json`, "utf8")
	const entities = JSON.parse(data)
	const entityModel = Entity.getEntityModel(req.params.entity_type)
	for (obj of entities) {
		const base = { _id: uuid(), users: false }
		const entity = new entityModel({ ...base, ...obj })
		await entity.save()
	}
	return "success"
}

module.exports = routes
