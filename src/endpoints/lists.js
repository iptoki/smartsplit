const { api, error } = require("../app")
const JWTAuth        = require("../service/JWTAuth")
const List           = require("../models/lists/list")


/************************ Routes ************************/

api.get("/entities/{list_type}", {
	tags: ["Lists"],
	summary: "Get the list of the specified type",
	parameters: [],
	responses: {},
}, JWTAuth.loadAuthUser, getList)


api.post("/entities/{list_type}/", {
	tags: ["Lists"],
	summary: "Create a new entity in the selected list",
	parameters: [],
	responses: {},
}, JWTAuth.requireUser, createListEntity)


api.patch("/entities/{entity_id}", {
	tags: ["Lists"],
	summary: "Update by id an entity of the selected list",
	parameters: [],
	responses: {},
}, JWTAuth.requireUser, updateListEntity)


api.delete("/entities/{entity_id}", {
	tags: ["Lists"],
	summary: "Delete by id an entity of the selected list",
	parameters: [],
	responses: {},
}, JWTAuth.requireUser, deleteListEntity)


/************************ Handlers ************************/

async function getList() {
	let query = List.find({type: this.req.params.list_type})

	if(!this.authUser)
		query = query.publicOnly()
	else if(this.authUser.isAdmin)
		query = query.select("+users +adminReview")
	else
		query = query.byUserId(this.authUser._id).select("+users")

	return await query.exec()
}

async function createListEntity() {
	if(this.req.params.admin && !this.authUser.isAmin)
		error("user_forbiden", 403, "This request requires an authenticated user with administrator privileges")

	const base = this.req.params.admin ? {users: false} : {users: [this.authUser._id]}

	const listModel = List.getListModel(this.req.params.list_type)
	const entity = new listModel({base, ... this.req.body})
	await entity.save()

	this.res.status(201).end()
}

async function updateListEntity() {
	const entity = List.findById(this.req.params.entity_id)

	if(!entity)
		error("list_entity_not_found", 404, "Entity not found")

	if(!this.authUser.isAmin && ( 
		( Array.isArray(entity.users) && !entity.users.includes(this.authUser._id) ) || entity.users === false 
	))
		error("user_forbiden", 403, "The authenticated user is not allowed to access this entity")

	if(!this.authUser.isAdmin) {
		delete this.req.body.adminReview
		delete this.req.body.users
	}

	await entity.setFields(this.req.body)

	this.res.status(204).end()
}

async function deleteListEntity() {
	const entity = List.findById(this.req.params.entity_id)

	if(!entity)
		error("list_entity_not_found", 404, "Entity not found")

	if(!this.authUser.isAmin && ( 
		( Array.isArray(entity.users) && !entity.users.includes(this.authUser._id) ) || entity.users === false 
	))
		error("user_forbiden", 403, "The authenticated user is not allowed to access this entity")

	await entity.remove()

	this.res.status(204).end()
}
