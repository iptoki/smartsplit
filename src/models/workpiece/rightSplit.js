const mongoose = require("mongoose")
const User = require("../user")
const RightTypes = require("../../constants/rightTypes")
const {
	UserNotFound,
	ConflictingRightSplitState,
	RightSplitVoteNotFound,
} = require("../../routes/errors")

const CopyrightSplitSchema = new mongoose.Schema(
	{
		rightHolder: {
			type: String,
			ref: "User",
		},
		roles: [String],
		vote: {
			type: String,
			enum: ["undecided", "accepted", "rejected"],
		},
		comment: String,
		shares: Number,
	},
	{ _id: false }
)

const PerformanceSplitSchema = new mongoose.Schema(
	{
		rightHolder: {
			type: String,
			ref: "User",
		},
		roles: [String],
		status: {
			type: String,
			enum: ["principal", "featured", "bandMember", "session"],
		},
		vote: {
			type: String,
			enum: ["undecided", "accepted", "rejected"],
		},
		comment: String,
		shares: Number,
	},
	{ _id: false }
)

const RecordingSplitSchema = new mongoose.Schema(
	{
		rightHolder: {
			type: String,
			ref: "User",
		},
		function: {
			type: String,
			enum: [
				"producer",
				"autoProducer",
				"directorProducer",
				"techProducer",
				"studio",
				"illustratorDesigner",
			],
		},
		vote: {
			type: String,
			enum: ["undecided", "accepted", "rejected"],
		},
		comment: String,
		shares: Number,
	},
	{ _id: false }
)

const LabelSchema = new mongoose.Schema(
	{
		rightHolder: {
			type: String,
			ref: "User",
		},
		agreementDuration: String,
		notifViaEmail: Boolean,
		notifViaText: Boolean,
		shares: Number,
		vote: {
			type: String,
			enum: ["undecided", "accepted", "rejected"],
		},
		comment: String,
	},
	{ _id: false }
)

const PrivacySchema = new mongoose.Schema(
	{
		rightHolder: {
			type: String,
			ref: "User",
		},
		vote: {
			type: String,
			enum: ["undecided", "accepted", "rejected"],
		},
		comment: String,
	},
	{ _id: false }
)

const RightSplitSchema = new mongoose.Schema(
	{
		_state: {
			type: String,
			enum: ["draft", "voting", "accepted", "rejected"],
		},
		version: Number,
		owner: {
			type: String,
			ref: "User",
		},
		isPublic: {
			type: Boolean,
		},
		copyrightDividingMethod: {
			type: String,
			enum: ["manual", "role", "equal"],
		},
		label: LabelSchema,
		copyright: [CopyrightSplitSchema],
		performance: [PerformanceSplitSchema],
		recording: [RecordingSplitSchema],
		privacy: [PrivacySchema],
	},
	{ _id: false }
)

RightSplitSchema.methods.getOwnerId = function () {
	return typeof this.owner === "string" ? this.owner : this.owner._id
}

RightSplitSchema.methods.getRightHolderIds = function () {
	let rightHolderIds = []
	if (this.label && this.label.rightHolder)
		rightHolderIds.push(this.label.rightHolder)
	for (let rightType of RightTypes.list) {
		if (!Array.isArray(this[rightType])) continue
		for (let item of this[rightType]) {
			const id =
				typeof item.rightHolder === "string"
					? item.rightHolder
					: item.rightHolder._id
			if (!rightHolderIds.includes(id)) rightHolderIds.push(id)
		}
	}
	return rightHolderIds
}

RightSplitSchema.methods.getRightHolders = async function () {
	let promises = []
	for (const uid of this.getRightHolderIds()) promises.push(User.findById(uid))
	return await Promise.all(promises)
}

RightSplitSchema.methods.swapRightHolder = function (originalId, swapId) {
	for (let type of RightTypes.list) {
		if (!Array.isArray(this.rightSplit[type])) {
			if (this.rightSplit[type].rightHolder === originalId)
				this.rightSplit[type].rightHolder = swapId
			continue
		}
		for (let item of this.rightSplit[type]) {
			if (item.rightHolder === originalId) {
				item.rightHolder = swapId
				break
			}
		}
	}
}

RightSplitSchema.methods.update = async function (data) {
	const owner_id = this.getOwnerId()
	let promises = []

	for (const field of ["isPublic", "copyrightDividingMethod", "label"]) {
		if (data[field] !== undefined) this[field] = data[field]
	}

	if (data.label !== undefined && Object.keys(data.label).length > 0) {
		this.label.vote =
			owner_id === data.label.rightHolder ? "accepted" : "undecided"
		promises.push(User.ensureExists(data.label.rightHolder))
	}

	for (let rightType of RightTypes.list) {
		if (!Array.isArray(data[rightType])) continue
		this[rightType] = []
		for (let item of data[rightType]) {
			promises.push(User.ensureExists(item.rightHolder))
			this[rightType].push({
				rightHolder: item.rightHolder,
				roles: item.roles,
				status: item.status,
				function: item.function,
				vote: owner_id === item.rightHolder ? "accepted" : "undecided",
				shares: item.shares,
			})
		}
	}

	this.updatePrivacy()
	await Promise.all(promises)
}

RightSplitSchema.methods.updatePrivacy = function () {
	const owner_id = this.getOwnerId()
	this.privacy = []
	for (const id of this.getRightHolderIds()) {
		this.privacy.push({
			rightHolder: id,
			vote: owner_id === id ? "accepted" : "undecided",
		})
	}
}

RightSplitSchema.methods.setVote = function (rightHolderId, data) {
	if (this._state !== "voting") throw ConflictingRightSplitState

	for (let rightType of RightTypes.list) {
		if (!Array.isArray(this[rightType])) continue
		for (let item of this[rightType]) {
			if (item.rightHolder === rightHolderId) {
				if (!data[rightType]) throw RightSplitVoteNotFound
				if (item.vote === "undecided") {
					item.vote = data[rightType].vote
					item.comment = data[rightType].comment
				}
				break
			}
		}
	}
	if (
		this.label &&
		this.label.vote === "undecided" &&
		this.label.rightHolder === rightHolderId
	) {
		if (!data.label) throw RightSplitVoteNotFound
		this.label.vote = data.label.vote
		this.label.comment = data.label.comment
	}

	this.updateState()
}

RightSplitSchema.methods.updateState = function () {
	let count = 0
	let accepted = true
	for (let type of RightTypes.list) {
		if (!Array.isArray(this[type])) continue
		for (let item of this[type]) {
			if (item.vote === "undecided") return
			if (item.vote === "rejected") accepted = false
			count++
		}
	}
	if (this.label) {
		count++
		if (this.label.vote === "undecided") return
		if (this.label.vote === "rejected") accepted = false
	}
	if (count > 0) this._state = accepted ? "accepted" : "rejected"
}

RightSplitSchema.methods.getPathsToPopulate = function () {
	let paths = [
		{ path: "rightSplit.owner", populate: { path: "_pendingEmails" } },
		{
			path: "rightSplit.label.rightHolder",
			populate: { path: "_pendingEmails" },
		},
	]
	for (let rightType of RightTypes.list) {
		if (!Array.isArray(this[rightType])) continue
		for (let i = 0; i < this[rightType].length; i++) {
			paths.push({
				path: `rightSplit.${rightType}.${i}.rightHolder`,
				populate: { path: "_pendingEmails" },
			})
		}
	}
	return paths
}

module.exports = RightSplitSchema
