const mongoose = require("mongoose")
const uuid = require("uuid").v4
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

WorkpieceSchema.methods.addFile = function (data) {
	const file_id = uuid()
	if (data.fields.visibility === undefined) data.fields.visibility = {}
	const options = {
		metadata: {
			encoding: data.encoding,
			mimetype: data.mimetype,
			visibility: data.fields.visibility.value || "private",
		},
	}
	data.file.pipe(
		mongoose.bucket.protectedWork.openUploadStreamWithId(
			file_id,
			data.filename,
			options
		)
	)
	const length = this.documentation.files.art.push(file_id)
	return this.documentation.files.art[length - 1]
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
	await this.documentation.updateCreation(data.creation || {})
	await this.documentation.updatePerformance(data.performance || {})
	await this.documentation.updateRecording(data.recording || {})
	await this.documentation.updateRelease(data.release || {})
	await this.documentation.updateFiles(data.files || {})
	await this.documentation.updateInfo(data.info || {})
	await this.documentation.updateLyrics(data.lyrics || {})
	await this.documentation.updateStreaming(data.streaming || {})
}

WorkpieceSchema.methods.populateDocumentation = async function () {
	await this.populateCreation()
	await this.populateFiles()
	// await this.populatePerformance()
	// await this.populateRecording()
	// await this.populateInfo()
}

WorkpieceSchema.methods.populateFiles = async function () {
	await this.populate("documentation.files.art").execPopulate()
}

WorkpieceSchema.methods.populateCreation = async function () {
	await this.populate("documentation.creation.authors").execPopulate()
	await this.populate("documentation.creation.composers").execPopulate()
	await this.populate("documentation.creation.publishers").execPopulate()
}

WorkpieceSchema.methods.populatePerformance = async function () {
	await this.populate("documentation.performance.conductor").execPopulate()
	for (let performer of this.documentation.performance.performers) {
		await performer.populate("user")
		for (let instrument of this.instruments) {
			await instrument.populate("instrument").execPopulate()
			await instrument.populate("role").execPopulate()
		}
	}
	// TODO performer.vocals
}

WorkpieceSchema.methods.populateRecording = async function () {
	await this.populate("documentation.recording.directors").execPopulate()
	for (let field of ["recording", "mixing", "mastering"]) {
		for (let record of this.documentation.recording[field]) {
			await record.populate("studio").execPopulate()
			await record.populate("engineers").execPopulate()
		}
	}
}

WorkpieceSchema.methods.populateInfo = async function () {
	await this.populate("documentation.info.mainGenre").execPopulate()
	await this.populate("documentation.info.secondaryGenres").execPopulate()
}

WorkpieceSchema.methods.getFileStream = function (file_id) {
	return mongoose.bucket.protectedWork.openDownloadStream(file_id)
}

module.exports = mongoose.model("Workpiece", WorkpieceSchema)
