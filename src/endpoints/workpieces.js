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
			200: WorkpieceSchema.workpiece,
			404: WorkpieceSchema.WorkpieceNotFoundError,
		},
	},
	JWTAuth.requireUser,
	loadWorkpiece
)

api.post(
	"/workpieces/",
	{
		tags: ["Workpieces"],
		summary: "Create a new workpiece in the system",
		parameters: [],
		responses: {
			200: WorkpieceSchema.workpiece,
		},
	},
	JWTAuth.requireUser,
	createWorkpiece
)

api.patch(
	"/workpieces/{workpiece_id}",
	{
		tags: ["Workpieces"],
		summary: "Update a workpiece by ID",
		parameters: [WorkpieceSchema.workpiece_id],
		responses: {
			200: WorkpieceSchema.workpiece,
			404: WorkpieceSchema.WorkpieceNotFoundError,
		},
	},
	JWTAuth.requireUser,
	loadWorkpieceAsOwner,
	updateWorkpiece
)

api.delete(
	"/workpieces/{workpiece_id}",
	{
		tags: ["Workpieces"],
		summary: "Delete from the system a workpiece by ID",
		parameters: [WorkpieceSchema.workpiece_id],
		responses: {
			404: WorkpieceSchema.WorkpieceNotFoundError,
		},
	},
	JWTAuth.requireUser,
	loadWorkpieceAsOwner,
	deleteWorkpiece
)

api.post(
	"/workpieces/{workpiece_id}/rightSplit",
	{
		tags: ["Workpieces"],
		summary:
			"Create a new split in a workpiece and archivate the old one if applicable",
		parameters: [WorkpieceSchema.workpiece_id],
		responses: {
			404: WorkpieceSchema.WorkpieceNotFoundError,
			409: WorkpieceSchema.ConflictingRightSplitStateError,
		},
	},
	JWTAuth.requireUser,
	loadWorkpieceAsOwner,
	createRightSplit
)

api.put(
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
	JWTAuth.requireUser,
	loadWorkpieceAsOwner,
	ensureRightSplitExist,
	updateRightSplit
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
	JWTAuth.requireUser,
	loadWorkpieceAsOwner,
	ensureRightSplitExist,
	deleteRightSplit
)

api.post(
	"/workpieces/{workpiece_id}/rightSplit/submit",
	{
		tags: ["Workpieces"],
		summary:
			"Submit an email to all members of the split and put it in voting mode",
		parameters: [WorkpieceSchema.workpiece_id],
		responses: {
			404: WorkpieceSchema.WorkpieceNotFoundError,
			409: WorkpieceSchema.ConflictingRightSplitStateError,
		},
	},
	JWTAuth.requireUser,
	loadWorkpieceAsOwner,
	ensureRightSplitExist,
	submitRightSplit
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
	JWTAuth.requireUser,
	loadWorkpieceAsRightHolder,
	ensureRightSplitExist,
	voteRightSplit
)

api.post(
	"/workpieces/{workpiece_id}/rightSplit/swap-user",
	{
		tags: ["Workpieces"],
		summary:
			"Swap user in a split if this user decide to vote with an other account",
		parameters: [WorkpieceSchema.workpiece_id],
		responses: {
			404: WorkpieceSchema.WorkpieceNotFoundError,
			409: WorkpieceSchema.ConflictingRightSplitStateError,
		},
	},
	JWTAuth.requireUser,
	loadWorkpiece,
	ensureRightSplitExist,
	swapRightSplitUser
)

api.get(
	"/workpieces/{workpiece_id}/files/{file_id}",
	{
		tags: ["Workpieces"],
		summary: "Get a workpiece's file by ID",
		parameters: [WorkpieceSchema.workpiece_id, WorkpieceSchema.file_id],
		responses: {
			404: WorkpieceSchema.WorkpieceNotFoundError,
		},
	},
	getWorkpieceFile
)

api.post(
	"/workpieces/{workpiece_id}/files/",
	{
		tags: ["Workpieces"],
		summary: "Add a new file to the workpiece",
		parameters: [WorkpieceSchema.workpiece_id],
		responses: {
			200: WorkpieceSchema.workpieceFile,
			404: WorkpieceSchema.WorkpieceNotFoundError,
		},
	},
	JWTAuth.requireUser,
	loadWorkpiece,
	addWorkpieceFile
)

api.patch(
	"/workpieces/{workpiece_id}/files/{file_id}",
	{
		tags: ["Workpieces"],
		summary: "Update a workpiece's file by ID",
		parameters: [WorkpieceSchema.workpiece_id, WorkpieceSchema.file_id],
		responses: {
			200: WorkpieceSchema.workpieceFile,
			404: WorkpieceSchema.WorkpieceNotFoundError,
		},
	},
	JWTAuth.requireUser,
	loadWorkpiece,
	updateWorkpieceFile
)

/*********************** Handlers ***********************/

async function loadWorkpiece() {
	const workpiece = await Workpiece.findById(this.req.params.workpiece_id)

	if (!workpiece)
		throw new WorkpieceSchema.WorkpieceNotFoundError({
			workpiece_id: this.req.params.workpiece_id,
		})
	if (
		workpiece.owner !== this.authUser._id &&
		!workpiece.rightHolders.includes(this.authUser._id)
	)
		throw new UserSchema.UserForbiddenError({ user_id: this.authUser._id })

	return workpiece
}

async function loadWorkpieceAsOwner() {
	const workpiece = await loadWorkpiece.call(this)
	if (workpiece.owner !== this.authUser._id)
		throw new UserSchema.UserForbiddenError({ user_id: this.authUser._id })

	return workpiece
}

async function loadWorkpieceAsRightHolder() {
	const workpiece = await loadWorkpiece.call(this)

	if (!workpiece.rightHolders.includes(this.authUser._id))
		throw new UserSchema.UserForbiddenError({ user_id: this.authUser._id })

	return workpiece
}

async function createWorkpiece() {
	this.req.body.owner = this.authUser._id
	const workpiece = new Workpiece(this.req.body)
	await workpiece.save()

	return workpiece
}

async function updateWorkpiece(workpiece) {
	for (let field of ["title", "entityTags"])
		if (this.req.body[field]) workpiece[field] = this.req.body[field]
	await workpiece.save()

	return workpiece
}

function ensureRightSplitExist(workpiece) {
	if (!workpiece.rightSplit)
		throw new WorkpieceSchema.RightSplitNotFoundError({
			workpiece_id: workpiece._id,
		})
	return workpiece
}

async function deleteWorkpiece(workpiece) {
	if (!workpiece.isRemovable()) throwConflictingRightSplitStateError(workpiece)

	await workpiece.remove()
	this.res.status(204).end()
}

async function createRightSplit(workpiece) {
	if (!workpiece.canAcceptNewSplit())
		throwConflictingRightSplitStateError(workpiece)

	if (workpiece.rightSplit) workpiece.archivedSplits.push(workpiece.rightSplit)

	await workpiece.setRightSplit(this.req.body)
	await workpiece.save()

	return workpiece.rightSplit
}

async function updateRightSplit(workpiece) {
	if (!workpiece.canUpdateRightSplit())
		throwConflictingRightSplitStateError(workpiece)

	await workpiece.setRightSplit(this.req.body)
	await workpiece.save()

	return workpiece.rightSplit
}

async function deleteRightSplit(workpiece) {
	if (!workpiece.canUpdateRightSplit())
		throwConflictingRightSplitStateError(workpiece)

	workpiece.archivedSplits.push(workpiece.rightSplit)
	workpiece.rightSplit = undefined
	await workpiece.save()

	this.res.status(204).end()
}

async function submitRightSplit(workpiece) {
	if (!workpiece.canUpdateRightSplit())
		throwConflictingRightSplitStateError(workpiece)

	await workpiece.submitRightSplit()
	await workpiece.save()

	this.res.status(204).end()
}

async function voteRightSplit(workpiece) {
	if (!workpiece.canVoteRightSplit())
		throwConflictingRightSplitStateError(workpiece)

	workpiece.setVote(this.authUser._id, this.req.body)
	await workpiece.updateRightSplitState()
	await workpiece.save()

	this.res.status(204).end()
}

async function swapRightSplitUser(workpiece) {
	if (!workpiece.canVoteRightSplit())
		throwConflictingRightSplitStateError(workpiece)

	const data = workpiece.decodeToken(this.req.body.token)

	if (data) {
		const tokenUser = await User.findById(data.rightHolder_id)
		if (tokenUser && workpiece.rightHolders.includes(tokenUser._id)) {
			workpiece.swapRightHolder(tokenUser._id, this.authUser._id)
			await workpiece.save()

			this.res.status(204).end()
			return
		}
	}

	throw new WorkpieceSchema.InvalidSplitTokenError({
		token: this.req.body.token,
	})
}

async function loadWorkpieceFile(file_id, workpiece = null) {
	if (!workpiece) workpiece = await Workpiece.findOne({ "files._id": file_id })
	for (file of workpiece.files) {
		if (file._id === file_id) {
			return file
		}
	}
	throw new WorkpieceSchema.FileNotFoundError({
		workpiece_id: workpiece._id,
		file_id: this.req.params.file_id,
	})
}

async function getWorkpieceFile() {
	const file = await loadWorkpieceFile(this.req.params.file_id)
	this.res.contentType(file.mimeType)
	this.res.send(file.data)
	return
}

async function addWorkpieceFile(workpiece) {
	const file = workpiece.addFile(
		this.req.body.name,
		this.req.body.mimeType,
		this.req.body.visibility,
		Buffer.from(this.req.body.data, "base64")
	)
	await workpiece.save()
	return file
}

async function updateWorkpieceFile(workpiece) {
	const file = await loadWorkpieceFile(this.req.params.file_id, workpiece)
	for (field of ["name", "mimeType", "visibility"]) {
		if (this.req.body[field]) file[field] = this.req.body[field]
	}
	if (this.req.body.data) {
		const data = Buffer.from(this.req.body.data, "base64")
		file.data = data
		file.size = data.length
	}
	await workpiece.save()
	return file
}

function throwConflictingRightSplitStateError(workpiece) {
	throw new WorkpieceSchema.ConflictingRightSplitStateError({
		workpiece_id: workpiece._id,
		right_split_state: workpiece.rightSplit._state,
	})
}
