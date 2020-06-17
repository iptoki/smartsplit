const { api } = require("../app")
const JWTAuth = require("../service/JWTAuth")
const User = require("../models/user")
const Workpiece = require("../models/workpiece")
const WorkpieceSchema = require("../schemas/workpieces")
const UserSchema = require("../schemas/users")

/************************ Routes ************************/

api.get(
	"/workpieces/{workpiece_id}",
	{
		tags: ["Workpieces"],
		summary: "Get a workpiece by ID",
		parameters: [WorkpieceSchema.workpiece_id],
		responses: {
			404: WorkpieceSchema.WorkpieceNotFoundError
		},
	},
	JWTAuth.loadAuthUser,
	loadWorkpiece,
)

api.post(
	"/workpieces/",
	{
		tags: ["Workpieces"],
		summary: "Create a new workpiece in the system",
		parameters: [],
		responses: {},
	},
	JWTAuth.loadAuthUser,
	createWorkpiece,
)

api.patch(
	"/workpieces/{workpiece_id}",
	{
		tags: ["Workpieces"],
		summary: "Update a workpiece by ID",
		parameters: [WorkpieceSchema.workpiece_id],
		responses: {
			404: WorkpieceSchema.WorkpieceNotFoundError
		},
	},
	JWTAuth.loadAuthUser,
	loadWorkpieceAsOwner,
	updateWorkpiece,
)

api.delete(
	"/workpieces/{workpiece_id}",
	{
		tags: ["Workpieces"],
		summary: "Delete from the system a workpiece by ID",
		parameters: [WorkpieceSchema.workpiece_id],
		responses: {
			404: WorkpieceSchema.WorkpieceNotFoundError
		},
	},
	JWTAuth.loadAuthUser,
	loadWorkpieceAsOwner,
	deleteWorkpiece,
)

api.post(
	"/workpieces/{workpiece_id}/rightSplit",
	{
		tags: ["Workpieces"],
		summary: "Create a new split in a workpiece and archivate the old one if applicable",
		parameters: [WorkpieceSchema.workpiece_id],
		responses: {
			404: WorkpieceSchema.WorkpieceNotFoundError,
			409: WorkpieceSchema.ConflictingRightSplitStateError,
		},
	},
	JWTAuth.loadAuthUser,
	loadWorkpieceAsOwner,
	createRightSplit,
)

api.patch(
	"/workpieces/{workpiece_id}/rightSplit",
	{
		tags: ["Workpieces"],
		summary: "Update the split of a workpiece by ID",
		parameters: [WorkpieceSchema.workpiece_id],
		responses: {
			404: WorkpieceSchema.WorkpieceNotFoundError,
			409: WorkpieceSchema.ConflictingRightSplitStateError,
		},
	},
	JWTAuth.loadAuthUser,
	loadWorkpieceAsOwner,
	updateRightSplit,
)

api.delete(
	"/workpieces/{workpiece_id}/rightSplit",
	{
		tags: ["Workpieces"],
		summary: "Delete the split of a workpiece by ID",
		parameters: [WorkpieceSchema.workpiece_id],
		responses: {
			404: WorkpieceSchema.WorkpieceNotFoundError,
			409: WorkpieceSchema.ConflictingRightSplitStateError,
		},
	},
	JWTAuth.loadAuthUser,
	loadWorkpieceAsOwner,
	deleteRightSplit,
)

api.post(
	"/workpieces/{workpiece_id}/rightSplit/submit",
	{
		tags: ["Workpieces"],
		summary: "Submit an email to all members of the split and put it in voting mode",
		parameters: [WorkpieceSchema.workpiece_id],
		responses: {
			404: WorkpieceSchema.WorkpieceNotFoundError,
			409: WorkpieceSchema.ConflictingRightSplitStateError,
		},
	},
	JWTAuth.loadAuthUser,
	loadWorkpieceAsOwner,
	submitRightSplit,
)

api.post(
	"/workpieces/{workpiece_id}/rightSplit/vote",
	{
		tags: ["Workpieces"],
		summary: "Record the user's vote on the workpiece's splits",
		parameters: [WorkpieceSchema.workpiece_id],
		responses: {
			404: WorkpieceSchema.WorkpieceNotFoundError,
			409: WorkpieceSchema.ConflictingRightSplitStateError,
		},
	},
	JWTAuth.loadAuthUser,
	loadWorkpieceAsRightHolder,
	voteRightSplit
)

api.post(
	"/workpieces/{workpiece_id}/rightSplit/swap-user",
	{
		tags: ["Workpieces"],
		summary: "Swap user in a split if this user decide to vote with an other account",
		parameters: [WorkpieceSchema.workpiece_id],
		responses: {
			404: WorkpieceSchema.WorkpieceNotFoundError,
			409: WorkpieceSchema.ConflictingRightSplitStateError,
		},
	},
	JWTAuth.loadAuthUser,
	loadWorkpiece,
	swapRightSplitUser
)

/*********************** Handlers ***********************/

async function loadWorkpiece() {
	const workpiece = await Workpiece.findById(this.req.params.workpiece_id)

	if(!workpiece)
		throw new WorkpieceSchema.WorkpieceNotFoundError({
			workpiece_id: this.req.params.workpiece_id
		})
	
	return workpiece
}

async function loadWorkpieceAsOwner() {
	const workpiece = await loadWorkpiece.call(this)
	if(workpiece.owner !== this.authUser._id)
		throw new UserSchema.UserForbiddenError({user_id: this.authUser._id})

	return workpiece
}

async function loadWorkpieceAsRightHolder() {
	const workpiece = loadWorkpiece.call(this)

	if(!workpiece.rightHolders.includes(this.authUser._id))
		throw new UserSchema.UserForbiddenError({user_id: this.authUser._id})
	
	return workpiece
}

async function createWorkpiece() {
	this.req.body.owner = this.authUser._id
	const workpiece = new Workpiece(this.req.body)
	await workpiece.save()

	return workpiece
}

async function updateWorkpiece(workpiece) {
	for(field of ["title", "entityTags"])
		if(this.req.body[field])
			workpiece[field] = this.req.body[field]
	await workpiece.save()

	return workpiece
}

async function deleteWorkpiece(workpiece) {
	// Refuse operation if an accepted rightSplit exist?
	await workpiece.remove()
	this.res.status(204).end()
}

async function createRightSplit(workpiece) {
	if(workpiece.rightSplit) {
		if(["voting", "accepted"].includes(workpiece.rightSplit._state))
			throw new WorkpieceSchema.ConflictingRightSplitStateError({
				workpiece_id: workpiece._id,
				right_split_state: workpiece.rightSplit._state
			})
		workpiece.archivedSplits.push(workpiece.rightSplit)
	}
	
	await workpiece.setRightSplit(this.req.body)
	await workpiece.save()

	return workpiece.rightSplit
}

async function updateRightSplit(workpiece) {
	if(workpiece.rightSplit._state !== "draft")
		throw new WorkpieceSchema.ConflictingRightSplitStateError({
			workpiece_id: workpiece._id,
			right_split_state: workpiece.rightSplit._state
		})
	
	await workpiece.setRightSplit(this.req.body)
	await workpiece.save()

	return workpiece.rightSplit
}

async function deleteRightSplit(workpiece) {
	if(workpiece.rightSplit._state !== "draft")
		throw new WorkpieceSchema.ConflictingRightSplitStateError({
			workpiece_id: workpiece._id,
			right_split_state: workpiece.rightSplit._state
		})

	workpiece.archivedSplits.push(workpiece.rightSplit)
	delete workpiece.rightSplit
	await workpiece.save()

	this.res.status(204).end()
}

async function submitRightSplit(workpiece) {
	if(workpiece.rightSplit._state !== "draft")
		throw new WorkpieceSchema.ConflictingRightSplitStateError({
			workpiece_id: workpiece._id,
			right_split_state: workpiece.rightSplit._state
		})

	workpiece.rightSplit._state = "voting"
	await workpiece.save()

	await workpiece.populate(rightHolders).execPopulate()
	for(user of workpiece.rightHolders)
		await user.emailRightSplitVoting()
	
	this.res.status(204).end()
}

async function voteRightSplit(workpiece) {
	if(workpiece.rightSplit._state !== "voting")
		throw new WorkpieceSchema.ConflictingRightSplitStateError({
			workpiece_id: workpiece._id,
			right_split_state: workpiece.rightSplit._state
		})

	let accepted = true
	for(type of ["copyright", "interpretation", "recording"]) {
		for(entry of workpiece.rightSplit[type]) {
			if(entry.vote !== "accepted") 
				accepted = false
			if(entry.rightHolder === this.authUser._id && this.req.body[type]) {
				entry.vote = this.req.body[type]
				if(this.req.body[type] === "refused")
					workpiece.rightSplit._state = "refused"
			}
		}
	}

	if(accepted) {
		workpiece._state = "accepted"
		await workpiece.populate(rightHolders).execPopulate()
		for(user of workpiece.rightHolders)
			await user.emailRightSplitAccepted()
	}

	await workpiece.save()
	this.res.status(204).end()
}

async function swapRightSplitUser(workpiece) {
	const user = User.findOne().byRightSplitToken(this.req.body.token)
	const index = workpiece.rightHolders.indexOf(user._id)

	if(index === -1)
		throw new UserSchema.UserForbiddenError()

	workpiece.rightHolders[index] = this.authUser._id

	for(type of ["copyright", "interpretation", "recording"]) {
		for(entry of workpiece.rightSplit[type]) {
			if(entry.rightHolder === user._id){
				entry.rightHolder = this.authUser._id 
				break
			}
		}
	}

	await workpiece.save()
	this.res.status(204).end()
}
