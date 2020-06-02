const { api } = require("../app")
const { filter } = require("../autoapi/json")
const JWTAuth = require("../service/JWTAuth")
const List = require("../models/lists/list")
const ListSchema = require("../schemas/lists")
const UserSchema = require("../schemas/users")

/************************ Routes ************************/

api.get(
	"/entities/{list_type}/",
	{
		tags: ["Lists"],
		summary: "Get the list of the specified type",
		parameters: [ListSchema.list_type],
		responses: {},
	},
	JWTAuth.loadAuthUser,
	getList
)

api.get(
	"/entities/{entity_id}",
	{
		tags: ["Lists"],
		summary: "Get the entity by ID",
		parameters: [ListSchema.entity_id],
		responses: {},
	},
	JWTAuth.loadAuthUser,
	loadListEntity,
	filterEntityFields
)

api.post(
	"/entities/{list_type}/",
	{
		tags: ["Lists"],
		summary: "Create a new entity in the selected list",
		parameters: [],
		responses: {},
	},
	JWTAuth.requireUser,
	createListEntity,
	filterEntityFields
)

api.patch(
	"/entities/{entity_id}",
	{
		tags: ["Lists"],
		summary: "Update by id an entity of the selected list",
		parameters: [],
		responses: {},
	},
	JWTAuth.requireUser,
	loadListEntity,
	updateListEntity,
	filterEntityFields
)

api.delete(
	"/entities/{entity_id}",
	{
		tags: ["Lists"],
		summary: "Delete by id an entity of the selected list",
		parameters: [],
		responses: {},
	},
	JWTAuth.requireUser,
	loadListEntity,
	deleteListEntity
)

/************************ Handlers ************************/

async function getList() {
	let query = List.find({ type: this.req.params.list_type })

	if (!this.authUser) query = query.publicOnly()
	else if (!this.authUser.isAdmin) query = query.byUserId(this.authUser._id)

	const entities = await query.exec()
	return entities.map((e) => filterEntityFields.call(this, e))
}

async function createListEntity() {
	if (this.req.query.admin === true && !this.authUser.isAdmin)
		throw new UserSchema.UserForbiddenError({ user_id: this.authUser._id })

	if (
		!this.authUser.isAdmin &&
		this.req.params.list_type === "digital-distributors"
	)
		throw new UserSchema.UserForbiddenError({ user_id: this.authUser._id })

	const base =
		this.req.query.admin === true ||
		this.req.params.list_type === "digital-distributors"
			? { users: false }
			: { users: [this.authUser._id] }

	const listModel = List.getListModel(this.req.params.list_type)
	if (!listModel)
		throw new ListSchema.ListNotFoundError({ list: this.req.params.list_type })

	const entity = new listModel({ ...base, ...this.req.body })

	try {
		await entity.save()
	} catch (e) {
		if (e && e.code === 11000)
			throw new ListSchema.ConflictingListEntityError({
				_id: this.req.body._id,
			})
		throw e
	}

	this.res.status(201)
	return entity
}

async function updateListEntity(entity) {
	if (
		!this.authUser.isAdmin &&
		this.req.params.list_type === "digital-distributors"
	)
		throw new UserSchema.UserForbiddenError({ user_id: this.authUser._id })

	if (!this.authUser.isAdmin) {
		delete this.req.body.adminReview
		delete this.req.body.users
	}

	await entity.setFields(this.req.body)

	return entity
}

async function deleteListEntity(entity) {
	if (
		!this.authUser.isAdmin &&
		this.req.params.list_type === "digital-distributors"
	)
		throw new UserSchema.UserForbiddenError({ user_id: this.authUser._id })

	await entity.remove()
	this.res.status(204).end()
}

async function loadListEntity() {
	const entity = await List.findById(this.req.params.entity_id)

	if (!entity)
		throw new ListSchema.ListEntityNotFoundError({
			entity_id: this.req.params.entity_id,
		})

	if (
		!this.authUser ||
		(!this.authUser.isAdmin &&
			(entity.users === false ||
				(Array.isArray(entity.users) &&
					!entity.users.includes(this.authUser._id))))
	)
		throw new UserSchema.UserForbiddenError()

	return entity
}

function filterEntityFields(entity) {
	if (!List.discriminators[entity.type]) return null

	const spec = api.schemaFromModel(
		entity.type,
		List.discriminators[entity.type]
	)
	const filtered = filter(entity, spec)

	if (!this.authUser || !this.authUser.isAdmin) {
		delete filtered.users
		delete filtered.adminReview
	}

	return filtered
}
