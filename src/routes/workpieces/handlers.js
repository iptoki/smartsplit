const User = require("../../models/user")
const Workpiece = require("../../models/workpiece")
const Errors = require("../errors")
const JWTAuth = require("../../service/JWTAuth")

const getWorkpiece = async function (req, res) {
	const workpiece = await Workpiece.findById(req.params.workpiece_id)

	if (!workpiece) throw Errors.WorkpieceNotFound

	return workpiece
}

const getWorkpieceAsOwner = async function (req, res) {
	const workpiece = await getWorkpiece(req, res)

	if (workpiece.owner !== req.authUser._id) throw Errors.UserForbidden

	return workpiece
}

const _getWorkpieceFile = function (workpiece, file_id) {
	for (file of workpiece.files) {
		if (file._id === file_id) {
			return file
		}
	}
	throw Errors.WorkpieceFileNotFound
}

module.exports.getWorkpiece = getWorkpiece

module.exports.getWorkpieceAsRightHolder = async function (req, res) {
	const workpiece = await getWorkpiece(req, res)

	if (!workpiece.rightHolders.includes(req.authUser._id))
		throw Errors.UserForbidden

	return workpiece
}

module.exports.createWorkpiece = async function (req, res) {
	req.body.owner = req.authUser._id
	const workpiece = new Workpiece(req.body)
	await workpiece.save()
	res.code(201)
	return workpiece
}

module.exports.updateWorkpiece = async function (req, res) {
	const workpiece = await getWorkpieceAsOwner(req, res)

	for (let field of ["title", "entityTags"])
		if (req.body[field]) workpiece[field] = req.body[field]

	await workpiece.save()
	return workpiece
}

module.exports.deleteWorkpiece = async function (req, res) {
	const workpiece = await getWorkpieceAsOwner(req, res)

	if (!workpiece.isRemovable()) throw Errors.ConflictingRightSplitState

	await workpiece.remove()
	res.code(204).send()
}

module.exports.getWorkpieceFile = async function (req, res) {
	const workpiece = await Workpiece.findById(req.params.workpiece_id)
	if (!workpiece) throw Errors.WorkpieceNotFound

	const file = _getWorkpieceFile(workpiece, req.params.file_id)

	if (file.visibility !== "public") {
		await JWTAuth.requireAuthUser(req, res)
		if (workpiece.owner !== req.authUser._id) throw Errors.UserForbidden
	}

	res.header("Content-Type", file.mimeType)
	return file.data
}

module.exports.addWorkpieceFile = async function (req, res) {
	const workpiece = await getWorkpieceAsOwner(req, res)
	const file = workpiece.addFile(
		req.body.name,
		req.body.mimeType,
		req.body.visibility,
		Buffer.from(req.body.data, "base64")
	)
	await workpiece.save()
	res.code(201)
	return file
}

module.exports.updateWorkpieceFile = async function (req, res) {
	const workpiece = await getWorkpieceAsOwner(req, res)
	const file = _getWorkpieceFile(workpiece, req.params.file_id)
	for (field of ["name", "mimeType", "visibility"]) {
		if (req.body[field]) file[field] = req.body[field]
	}
	if (req.body.data) {
		const data = Buffer.from(req.body.data, "base64")
		file.data = data
		file.size = data.length
	}
	await workpiece.save()
	return file
}

module.exports.getWorkpiecesByOwner = async function (req, res) {
	return await Workpiece.find().byOwner(req.user_id)
}

module.exports.createRightSplit = async function (req, res) {
	const workpiece = await getWorkpieceAsOwner(req, res)

	if (!workpiece.canAcceptNewSplit()) throw Errors.ConflictingRightSplitState

	if (workpiece.rightSplit) workpiece.archivedSplits.push(workpiece.rightSplit)

	await workpiece.setRightSplit(req.body)
	await workpiece.save()

	res.code(201)
	return workpiece.rightSplit
}

module.exports.updateRightSplit = async function (req, res) {
	const workpiece = await getWorkpieceAsOwner(req, res)

	if (!workpiece.canUpdateRightSplit()) throw Errors.ConflictingRightSplitState

	await workpiece.setRightSplit(req.body)
	await workpiece.save()

	return workpiece.rightSplit
}

module.exports.deleteRightSplit = async function (req, res) {
	const workpiece = await getWorkpieceAsOwner(req, res)

	if (!workpiece.canUpdateRightSplit()) throw Errors.ConflictingRightSplitState

	workpiece.archivedSplits.push(workpiece.rightSplit)
	workpiece.rightSplit = undefined
	await workpiece.save()

	res.code(204).send()
}

module.exports.submitRightSplit = async function (req, res) {
	const workpiece = await getWorkpieceAsOwner(req, res)

	if (!workpiece.canUpdateRightSplit()) throw Errors.ConflictingRightSplitState

	await workpiece.submitRightSplit()
	await workpiece.save()

	res.code(204).send()
}

module.exports.voteRightSplit = async function (req, res) {
	const workpiece = await getWorkpieceAsRightHolder(req, res)

	if (!workpiece.canVoteRightSplit()) throw Errors.ConflictingRightSplitState

	workpiece.setVote(req.authUser._id, req.body)
	await workpiece.updateRightSplitState()
	await workpiece.save()

	res.code(204).send()
}

module.exports.swapRightSplitUser = async function (req, res) {
	const workpiece = await getWorkpiece(req, res)

	if (!workpiece.canVoteRightSplit()) throw Errors.ConflictingRightSplitState

	const data = workpiece.decodeToken(req.body.token)

	if (data) {
		const tokenUser = await User.findById(data.rightHolder_id)
		if (tokenUser && workpiece.rightHolders.includes(tokenUser._id)) {
			workpiece.swapRightHolder(tokenUser._id, req.authUser._id)
			await workpiece.save()

			res.code(204).send()
			return
		}
	}

	throw Errors.InvalidSplitToken
}