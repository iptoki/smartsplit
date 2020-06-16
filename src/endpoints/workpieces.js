const { api } = require("../app")
const JWTAuth = require("../service/JWTAuth")
const Workpiece = require("../models/workpiece")
const WorkpieceSchema = require("../schemas/workpieces")

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
	loadWorkpiece,
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
	loadWorkpiece,
	deleteWorkpiece,
)

api.post(
	"/workpieces/{workpiece_id}/rightSplit",
	{
		tags: ["Workpieces"],
		summary: "Create a new split in a workpiece and archivate the old one if applicable",
		parameters: [WorkpieceSchema.workpiece_id],
		responses: {
			404: WorkpieceSchema.WorkpieceNotFoundError
		},
	},
	JWTAuth.loadAuthUser,
	loadWorkpiece,
	createRightSplit,
)

api.patch(
	"/workpieces/{workpiece_id}/rightSplit",
	{
		tags: ["Workpieces"],
		summary: "Update the split of a workpiece by ID",
		parameters: [WorkpieceSchema.workpiece_id],
		responses: {
			404: WorkpieceSchema.WorkpieceNotFoundError
		},
	},
	JWTAuth.loadAuthUser,
	loadWorkpiece,
	updateRightSplit,
)

api.delete(
	"/workpieces/{workpiece_id}/rightSplit",
	{
		tags: ["Workpieces"],
		summary: "Delete the split of a workpiece by ID",
		parameters: [WorkpieceSchema.workpiece_id],
		responses: {
			404: WorkpieceSchema.WorkpieceNotFoundError
		},
	},
	JWTAuth.loadAuthUser,
	loadWorkpiece,
	deleteRightSplit,
)

api.post(
	"/workpieces/{workpiece_id}/rightSplit/submit",
	{
		tags: ["Workpieces"],
		summary: "Submit an email to all members of the split and put it in voting mode",
		parameters: [WorkpieceSchema.workpiece_id],
		responses: {
			404: WorkpieceSchema.WorkpieceNotFoundError
		},
	},
	JWTAuth.loadAuthUser,
	loadWorkpiece,
	submitRightSplit,
)

api.post(
	"/workpieces/{workpiece_id}/rightSplit/vote",
	{
		tags: ["Workpieces"],
		summary: "Record the user's vote on the workpiece's splits",
		parameters: [WorkpieceSchema.workpiece_id],
		responses: {
			404: WorkpieceSchema.WorkpieceNotFoundError
		},
	},
	JWTAuth.loadAuthUser,
	loadWorkpiece,
	voteRightSplit
)

api.post(
	"/workpieces/{workpiece_id}/rightSplit/swap-user",
	{
		tags: ["Workpieces"],
		summary: "Swap user in a split if this user decide to vote with an other account",
		parameters: [WorkpieceSchema.workpiece_id],
		responses: {
			404: WorkpieceSchema.WorkpieceNotFoundError
		},
	},
	JWTAuth.loadAuthUser,
	loadWorkpiece,
	swapRightSplitUser
)

api.patch(
	"/workpieces/{workpiece_id}/rightHolders",
	{
		tags: ["Workpieces"],
		summary: "Update the rightHolders of a workpiece by ID",
		parameters: [WorkpieceSchema.workpiece_id],
		responses: {
			404: WorkpieceSchema.WorkpieceNotFoundError
		},
	},
	JWTAuth.loadAuthUser,
	loadWorkpiece,
)


/*********************** Handlers ***********************/

async function loadWorkpiece() {
	const workpiece = Workpiece.findById(this.req.params.workpiece_id)

	if(!workpiece)
		throw new WorkpieceSchema.WorkpieceNotFoundError({
			workpiece_id: this.req.params.workpiece_id
		})

	return workpiece
}

async function createWorkpiece() {
	this.req.body.owner = this.authUser
	const workpiece = new Workpiece(this.req.body)
	await workpiece.save()

	return workpiece
}

async function updateWorkpiece(workpiece) {
	for(field of ["title", "rightHolders", "entityTags"])
		if(this.req.body[field])
			workpiece[field] = this.req.body[field]
	await workpiece.save()

	return workpiece
}

async function deleteWorkpiece(workpiece) {
	await workpiece.remove()
	this.res.status(204).end()
}

async function createRightSplit(workpiece) {
	if(workpiece.rightSplit) {
		if(["voting", "accepted"].includes(workpiece.rightSplit._state))
			throw new WorkpieceSchema.RightSplitError({
				workpiece_id: workpiece._id
			})
		workpiece.archivedSplits.push(workpiece.rightSplit)
	}
	
	workpiece.setRightSplit(this.req.body)
	await workpiece.save()

	return workpiece.rightSplit
}

async function updateRightSplit(workpiece) {
	if(workpiece.rightSplit._state !== "draft")
		throw new WorkpieceSchema.RightSplitError({
			workpiece_id: workpiece._id
		})
	
	workpiece.setRightSplit(this.req.body)
	await workpiece.save()

	return workpiece.rightSplit
}

async function deleteRightSplit(workpiece) {
	if(workpiece.rightSplit._state !== "draft")
		throw new WorkpieceSchema.RightSplitError({
			workpiece_id: workpiece._id
		})

	delete workpiece.rightSplit
	await workpiece.save()
	this.res.status(204).end()
}

async function submitRightSplit(workpiece) {

}

async function voteRightSplit(workpiece) {
	if(workpiece.rightSplit._state !== "voting")
		throw new WorkpieceSchema.RightSplitError({
			workpiece_id: workpiece._id
		})

	let accepted = true
	for(splitType of ["copyright", "interpretation", "recording"]) {
		for(entry of workpiece.rightSplit[splitType]) {
			if(entry.vote !== "accepted") 
				accepted = false
			if(entry.rightHolder === this.authUser._id && this.req.body[splitType]) {
				entry.vote = this.req.body[splitType]
				if(this.req.body[splitType] === "refused")
					workpiece.rightSplit._state = "refused"
			}
		}
	}

	else if(accepted)
		workpiece._state = "accepted"
		// TODO send email?

	await workpiece.save()
	this.res.status(204).end()
}

async function swapRightSplitUser(workpiece) {

}
