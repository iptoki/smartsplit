const mongoose = require("mongoose")
const uuid = require("uuid").v4
const Config = require("../../config")
const User = require("../user")
const SplitTemplates = require("../notifications/templates")
const { UserNotFound } = require("../../routes/errors")
const JWT = require("../../utils/jwt")
const RightSplitSchema = require("./rightSplit")
const DocumentationSchema = require("./documentation")
const RightTypes = require("../../constants/rightTypes")

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
		rightHolders: {
			type: [String],
			ref: "User",
		},
		entityTags: {
			type: [String],
			ref: "ListEntity",
		},
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

WorkpieceSchema.virtual("workpiece_id").get(function () {
	return this._id
})

WorkpieceSchema.query.byOwner = function (user_id) {
	return this.where({ owner: user_id })
}

WorkpieceSchema.methods.isOwnerPartOfRightHolders = function () {
	for (rh of this.rightHolders) {
		if (rh._id === this.owner._id) return true
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

WorkpieceSchema.methods.setRightSplit = async function (body) {
	this.rightSplit = {
		_state: "draft",
		copyright: [],
		interpretation: [],
		recording: [],
	}
	this.rightHolders = []

	for (let rightType of RightTypes.list) {
		for (let entry of body[rightType]) {
			if (!(await User.exists({ _id: entry.rightHolder }))) throw UserNotFound

			if (!this.rightHolders.includes(entry.rightHolder))
				this.rightHolders.push(entry.rightHolder)

			this.rightSplit[rightType].push({
				rightHolder: entry.rightHolder,
				roles: entry.roles,
				vote: this.owner === entry.rightHolder ? "accepted" : "undecided",
				shares: entry.shares,
			})
		}
	}
}

WorkpieceSchema.methods.setVote = function (rightHolderId, rightsVote) {
	for (let type of RightTypes.list) {
		for (let entry of this.rightSplit[type]) {
			if (entry.rightHolder === rightHolderId && rightsVote[type]) {
				if (entry.vote === "undecided") {
					entry.vote = rightsVote[type].vote
					entry.comment = rightsVote[type].comment
				}
				break
			}
		}
	}
}

WorkpieceSchema.methods.addFile = function (name, mimeType, visibility, data) {
	const l = this.documentation.files.art.push({
		name: name,
		size: data.length,
		mimeType: mimeType,
		visibility: visibility,
		data: data,
	})
	return this.documentation.files.art[l - 1]
}

WorkpieceSchema.methods.isRemovable = function () {
	return this.canAcceptNewSplit()
}

WorkpieceSchema.methods.canAcceptNewSplit = function () {
	return (
		!this.rightSplit || ["draft", "rejected"].includes(this.rightSplit._state)
	)
}

WorkpieceSchema.methods.canUpdateRightSplit = function () {
	return this.rightSplit && this.rightSplit._state === "draft"
}

WorkpieceSchema.methods.canVoteRightSplit = function () {
	return this.rightSplit && this.rightSplit._state === "voting"
}

WorkpieceSchema.methods.emailRightHolders = async function (notificationType) {
	if (!this.populated("rightHolders"))
		await this.populate("rightHolders").execPopulate()
	for (rh of this.rightHolders)
		await rh.sendNotification(notificationType, {
			workpiece: this,
		})
}

WorkpieceSchema.methods.emailOwner = async function (notificationType) {
	await this.owner.sendNotification(notificationType, {
		workpiece: this,
	})
}

WorkpieceSchema.methods.submitRightSplit = async function () {
	this.rightSplit._state = "voting"
	await this.emailRightHolders(SplitTemplates.CREATED)
}

WorkpieceSchema.methods.swapRightHolder = async function (originalId, swapId) {
	const index = this.rightHolders.indexOf(originalId)
	this.rightHolders[index] = swapId

	for (let type of RightTypes.list) {
		for (let entry of this.rightSplit[type]) {
			if (entry.rightHolder === originalId) {
				entry.rightHolder = swapId
				break
			}
		}
	}
}

WorkpieceSchema.methods.updateRightSplitState = async function () {
	if (!this.rightSplit) return

	const initialState = this.rightSplit._state
	let accepted = true

	for (let type of RightTypes.list) {
		for (let entry of this.rightSplit[type]) {
			if (entry.vote === "rejected") this.rightSplit._state = "rejected"
			else if (entry.vote === "undecided") accepted = false
		}
	}

	if (accepted) this.rightSplit._state = "accepted"

	if (this.rightSplit._state !== initialState) {
		const template =
			this.rightSplit._state === "accepted"
				? SplitTemplates.ACCEPTED
				: SplitTemplates.REJECTED

		await this.emailRightHolders(template)
		if (!this.isOwnerPartOfRightHolders()) await this.emailOwner(template)
	}
}

WorkpieceSchema.methods.updateDocumentation = async function (data) {
	await this.updateCreation(data.creation)
	await this.updatePerformance(data.performance)
	await this.updateRecording(data.recording)
	await this.updateRelease(data.release)
	await this.updateFiles(data.files)
	await this.updateInfo(data.info)
	await this.updateLyrics(data.lyrics)
	await this.updateStreaming(data.streaming)
}

WorkpieceSchema.methods.updateCreation = async function (data) {
	for (let field of ["date", "iswc"])
		if (field !== undefined) this.documentation.creation[field] = data[field]
	for (field of ["authors", "composers", "publishers"])
		if (Array.isArray(data[field])) {
			for (const uid of data[field])
				if (!(await User.exists({ _id: uid }))) throw UserNotFound
			this.documentation.creation[field] = data[field]
		}
}

WorkpieceSchema.methods.updatePerformance = async function (data) {
	if (data.conductor !== undefined)
		this.documentation.performance.conductor = data.conductor
	if (Array.isArray(data.performers)) {
		// TODO
	}
}

WorkpieceSchema.methods.updateRecording = async function (data) {
	if (Array.isArray(data.directors)) {
		for (const uid of data.directors)
			if (!(await User.exists({ _id: uid }))) throw UserNotFound
		this.documentation.recording.directors = data.directors
	}
	// TODO `recording` `mixing` `mastering`
}

WorkpieceSchema.methods.updateRelease = async function (data) {
	for (let field of ["date", "label", "format", "support"])
		if (field !== undefined) this.documentation.release[field] = data[field]
}

WorkpieceSchema.methods.updateFiles = async function (data) {
	for (let field of ["audio", "scores", "midi"])
		if (field !== undefined) this.documentation.info[field] = data[field]
}

WorkpieceSchema.methods.updateInfo = async function (data) {
	for (let field of ["length", "BPM", "influences"])
		if (field !== undefined) this.documentation.info[field] = data[field]

	// TODO `mainGenre` `secondaryGenres`
}

WorkpieceSchema.methods.updateLyrics = async function (data) {
	for (let field of ["texts", "languages", "public"])
		if (field !== undefined) this.documentation.lyrics[field] = data[field]
}

WorkpieceSchema.methods.updateStreaming = async function (data) {
	if (Array.isArray(data)) this.documentation.streaming = data
}

module.exports = mongoose.model("Workpiece", WorkpieceSchema)
