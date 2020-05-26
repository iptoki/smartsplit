const { api }        = require("../app")
const JWTAuth        = require("../service/JWTAuth")
const List           = require("../models/lists/list")
const ListSchema     = require("../schemas/lists")
const UserSchema     = require("../schemas/users")


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
}, JWTAuth.requireUser, loadListEntity, updateListEntity)


api.delete("/entities/{entity_id}", {
	tags: ["Lists"],
	summary: "Delete by id an entity of the selected list",
	parameters: [],
	responses: {},
}, JWTAuth.requireUser, loadListEntity, deleteListEntity)


/************************ Handlers ************************/

async function getList() {
	let query = List.find({type: this.req.params.list_type})

	if(!this.authUser)
		query = query.publicOnly().select("-users -adminReview")
	else if(!this.authUser.isAdmin)
		query = query.byUserId(this.authUser._id).select("-users -adminReview")

	return await query.exec()
}

async function createListEntity() {
	if(this.req.query.admin === true && !this.authUser.isAdmin)
		throw new UserSchema.UserForbiddenError({user_id: this.authUser._id})

	if(!this.authUser.isAdmin && this.req.params.list_type === "distributionServiceProvider")
		throw new UserSchema.UserForbiddenError({user_id: this.authUser._id})
	
	const base = this.req.query.admin === true ?
		{users: false} : {users: [this.authUser._id]}

	const listModel = List.getListModel(this.req.params.list_type)
	const entity = new listModel({...base, ...this.req.body})
	await entity.save()

	this.res.status(201)

	return entity
}

async function updateListEntity() {
	if(!this.authUser.isAdmin) {
		delete this.req.body.adminReview
		delete this.req.body.users
	}

	await entity.setFields(this.req.body)

	this.res.status(204)

	return entity
}

async function deleteListEntity(entity) {
	await entity.remove()
	this.res.status(204).end()
}


async function loadListEntity() {
	const entity = await List.findById(this.req.params.entity_id)

	if(!entity)
		throw new ListSchema.ListEntityNotFoundError({entity_id: this.req.params.entity_id})

	if(!this.authUser.isAdmin && ( 
		entity.users === false || 
		entity.type === "digital-distributors" ||
		( Array.isArray(entity.users) && !entity.users.includes(this.authUser._id) ) 
	))
		throw new UserSchema.UserForbiddenError({user_id: this.authUser._id})

	return entity
}
