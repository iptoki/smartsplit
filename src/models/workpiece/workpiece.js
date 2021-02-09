const mongoose = require("mongoose")
const uuid = require("uuid").v4
const User = require("../user")
const { SplitTemplates } = require("../notifications/templates")
const JWT = require("../../utils/jwt")
const RightSplitSchema = require("./rightSplit")
const DocumentationSchema = require("./documentation")
const RightTypes = require("../../constants/rightTypes")
const {
	UserNotFound,
	ConflictingRightSplitState,
} = require("../../routes/errors")

const JWT_SPLIT_TYPE = "workpiece:split-invite"

const WorkpieceSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			alias: "workpiece_id",
			default: uuid,
		},
		title: {
			type: String,
		},
		owner: {
			type: String,
			ref: "User",
		},
		rightHolders: [
			{
				type: String,
				ref: "User",
			},
		],
		entityTags: [
			{
				type: String,
				ref: "Entity",
			},
		],
		rightSplit: {
			type: RightSplitSchema,
		},
		archivedSplits: {
			type: [RightSplitSchema],
		},
		documentation: {
			type: DocumentationSchema,
			default: {},
		},
	},
	{ timestamps: true, toJSON: { virtuals: true } }
)

WorkpieceSchema.query.byOwner = function (user_id) {
	return this.where({ owner: user_id })
}

WorkpieceSchema.query.byRightHolders = function (user_id) {
	return this.where({ rightHolders: {$in : [user_id]}, owner : {$ne : user_id} })
}

WorkpieceSchema.methods.getOwnerId = function () {
	return this.populated("owner") ? this.owner._id : this.owner
}

WorkpieceSchema.methods.getSplitOwnerId = function () {
	return this.populated("rightSplit.owner")
		? this.rightSplit.owner._id
		: this.rightSplit.owner
}

WorkpieceSchema.methods.isOwnerPartOfRightHolders = function () {
	if (!this.rightHolders) return false
	const ownerId = this.getOwnerId()
	if (!this.populated("rightHolders"))
		return this.rightHolders.includes(ownerId)
	for (let rh of this.rightHolders) {
		if (rh._id === ownerId) return true
	}
	return false
}

WorkpieceSchema.methods.createToken = async function (
	rightHolderId,
	expires = "7 days"
) {
	return JWT.create(
		JWT_SPLIT_TYPE,
		{
			workpiece_id: this._id,
			rightHolder_id: rightHolderId,
		},
		expires
	)
}

WorkpieceSchema.methods.decodeToken = function (token) {
	return JWT.decode(JWT_SPLIT_TYPE, token)
}

WorkpieceSchema.methods.setRightSplit = async function (data) {
	if (
		this.rightSplit &&
		!["draft", "rejected"].includes(this.rightSplit._state)
	)
		throw ConflictingRightSplitState

	if (this.rightSplit && this.rightSplit._state === "rejected") {
		if (!data.owner || !(await User.exists({ _id: data.owner })))
			throw UserNotFound
		this.archivedSplits.push(this.rightSplit)
		this.rightSplit = {
			owner: data.owner,
			_state: "draft",
			version: this.rightSplit.version + 1,
		}
	}
	if (!this.rightSplit) {
		const nArchived = this.archivedSplits.length
		const version =
			nArchived > 0 ? this.archivedSplits[nArchived - 1].version + 1 : 1
		this.rightSplit = { owner: data.owner, _state: "draft", version }
	}

	const owner_id = this.getSplitOwnerId()

	for (let rightType of RightTypes.list) {
		if (!Array.isArray(data[rightType])) continue
		this.rightSplit[rightType] = []
		for (let item of data[rightType]) {
			if (!(await User.exists({ _id: item.rightHolder }))) throw UserNotFound
			this.rightSplit[rightType].push({
				rightHolder: item.rightHolder,
				roles: item.roles,
				status: item.status,
				function: item.function,
				vote: owner_id === item.rightHolder ? "accepted" : "undecided",
				shares: item.shares,
			})
		}
	}

	this.updateRightHolders()
}

WorkpieceSchema.methods.updateRightHolders = function () {
	this.rightHolders = []

	for (let rightType of RightTypes.list) {
		if (!Array.isArray(this.rightSplit[rightType])) continue
		for (let item of this.rightSplit[rightType]) {
			if (!this.rightHolders.includes(item.rightHolder))
				this.rightHolders.push(item.rightHolder)
		}
	}
}

WorkpieceSchema.methods.setVote = function (rightHolderId, data) {
	if (!this.rightSplit || this.rightSplit._state !== "voting")
		throw ConflictingRightSplitState

	for (let rightType of RightTypes.list) {
		for (let item of this.rightSplit[rightType]) {
			if (item.rightHolder === rightHolderId && data[rightType]) {
				if (item.vote === "undecided") {
					item.vote = data[rightType].vote
					item.comment = data[rightType].comment
				}
				break
			}
		}
	}

	this.updateRightSplitState()
}

WorkpieceSchema.methods.isRemovable = function () {
	return (
		!this.rightSplit || ["draft", "rejected"].includes(this.rightSplit._state)
	)
}

WorkpieceSchema.methods.canVoteRightSplit = function () {
	return this.rightSplit && this.rightSplit._state === "voting"
}

WorkpieceSchema.methods.emailRightHolders = async function (
	notificationType,
	skipSplitOwner
) {
	if (!this.populated("rightHolders"))
		await this.populate("rightHolders").execPopulate()
	for (let rh of this.rightHolders) {
		if (rh._id === this.getSplitOwnerId() && skipSplitOwner) continue
		rh.sendNotification(notificationType, {
			workpiece: this,
		})
	}
}

WorkpieceSchema.methods.emailOwner = async function (notificationType) {
	if (!this.populated("owner")) await this.populate("owner").execPopulate()
	this.owner.sendNotification(notificationType, {
		workpiece: this,
	})
}

WorkpieceSchema.methods.submitRightSplit = function () {
	if (!this.rightSplit || this.rightSplit._state !== "draft")
		throw ConflictingRightSplitState
	this.rightSplit._state = "voting"
	this.emailRightHolders(SplitTemplates.CREATED, true)
}

WorkpieceSchema.methods.swapRightHolder = async function (originalId, swapId) {
	const index = this.rightHolders.indexOf(originalId)
	this.rightHolders[index] = swapId

	for (let type of RightTypes.list) {
		for (let item of this.rightSplit[type]) {
			if (item.rightHolder === originalId) {
				item.rightHolder = swapId
				break
			}
		}
	}
}

WorkpieceSchema.methods.updateRightSplitState = function () {
	if (!this.rightSplit) return

	const initialState = this.rightSplit._state
	let accepted = true

	for (let type of RightTypes.list) {
		for (let item of this.rightSplit[type]) {
			if (item.vote === "rejected") {
				this.rightSplit._state = "rejected"
				accepted = false
			} else if (item.vote === "undecided") accepted = false
		}
	}

	if (accepted) this.rightSplit._state = "accepted"

	this.emailSplitResult()
}

WorkpieceSchema.methods.emailSplitResult = async function () {
	if (!["accepted", "rejected"].includes(this.rightSplit._state)) return
	const template =
		this.rightSplit._state === "accepted"
			? SplitTemplates.ACCEPTED
			: SplitTemplates.REJECTED
	this.emailRightHolders(template, false)
	if (!this.isOwnerPartOfRightHolders()) this.emailOwner(template)
}

WorkpieceSchema.methods.deleteRightSplit = function () {
	if (this.rightSplit && this.rightSplit._state !== "draft")
		throw ConflictingRightSplitState
	this.rightSplit = undefined
}

WorkpieceSchema.methods.updateDocumentation = async function (data) {
	await this.documentation.updateCreation(data.creation || {})
	await this.documentation.updatePerformance(data.performance || {})
	await this.documentation.updateRecording(data.recording || {})
	await this.documentation.updateRelease(data.release || {})
	await this.documentation.updateFiles(data.files || {})
	await this.documentation.updateInfo(data.info || {})
	await this.documentation.updateLyrics(data.lyrics || {})
	await this.documentation.updateStreaming(data.streaming || {})
}

WorkpieceSchema.methods.populateAll = async function () {
	await this.populate("owner").execPopulate()
	await this.populate("rightHolders").execPopulate()
	await this.populateDocumentation()
	await this.populateRightSplit()
	await this.populateArchivedRightSplits()
}

WorkpieceSchema.methods.populateRightSplit = async function () {
	if (!this.rightSplit) return
	await this.populate("rightSplit.owner").execPopulate()
	for (let rightType of RightTypes.list) {
		if (!Array.isArray(this.rightSplit[rightType])) continue
		for (let i = 0; i < this.rightSplit[rightType].length; i++) {
			await this.populate(
				`rightSplit.${rightType}.${i}.rightHolder`
			).execPopulate()
		}
	}
}

WorkpieceSchema.methods.populateArchivedRightSplits = async function () {
	for (let i = 0; i < this.archivedSplits.length; i++) {
		for (let rightType of RightTypes.list) {
			if (!Array.isArray(this.archivedSplits[i][rightType])) continue
			for (let j = 0; j < this.archivedSplits[i][rightType].length; j++) {
				await this.populate(
					`archivedSplits.${i}.${rightType}.${j}.rightHolder`
				).execPopulate()
			}
		}
	}
}

WorkpieceSchema.methods.populateDocumentation = async function () {
	await this.populateCreation()
	await this.populateFiles()
	await this.populatePerformance()
	await this.populateRecording()
	await this.populateInfo()
}

WorkpieceSchema.methods.populateFiles = async function () {
	await this.populate("documentation.files.art").execPopulate()
	await this.populate("documentation.files.audio").execPopulate()
	await this.populate("documentation.files.scores").execPopulate()
	await this.populate("documentation.files.midi").execPopulate()
	await this.populate("documentation.files.lyrics").execPopulate()
}

WorkpieceSchema.methods.populateCreation = async function () {
	await this.populate("documentation.creation.authors").execPopulate()
	await this.populate("documentation.creation.composers").execPopulate()
	await this.populate("documentation.creation.publishers").execPopulate()
}

WorkpieceSchema.methods.populatePerformance = async function () {
	await this.populate("documentation.performance.conductor").execPopulate()
	const doc = this.documentation.performance.performers
	const path = "documentation.performance.performers"
	for (let i = 0; i < doc.length; i++) {
		await this.populate(`${path}.${i}.user`).execPopulate()
		for (let field of ["instruments", "vocals"]) {
			for (let j = 0; j < doc[i][field].length; j++) {
				await this.populate(
					`${path}.${i}.${field}.${j}.instrument`
				).execPopulate()
				// await this.populate(`${path}.${i}.${field}.${j}.role`).execPopulate()
			}
		}
	}
}

WorkpieceSchema.methods.populateRecording = async function () {
	await this.populate("documentation.recording.directors").execPopulate()
	await this.populate("documentation.recording.producers").execPopulate()
	for (let field of ["recording", "mixing", "mastering"]) {
		for (let i = 0; i < this.documentation.recording[field].length; i++) {
			await this.populate(
				`documentation.recording.${field}.${i}.engineers`
			).execPopulate()
		}
	}
}

WorkpieceSchema.methods.populateInfo = async function () {
	await this.populate("documentation.info.mainGenre").execPopulate()
	await this.populate("documentation.info.secondaryGenres").execPopulate()
}

module.exports = mongoose.model("Workpiece", WorkpieceSchema)
