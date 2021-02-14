const mongoose = require("mongoose")
const User = require("../user")
const RightTypes = require("../../constants/rightTypes")
const {
	UserNotFound,
	ConflictingRightSplitState,
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

const LabelSchema = new mongoose.Schema({
	rightHolder: {
		type: String,
		ref: "User",
	},
	agreementDuration: String,
	notifViaEmail: Boolean,
	notifViaText: Boolean,
})

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
		privacy: {
			type: String,
			enum: ["private", "public"],
		},
		copyrightDividingMethod: {
			type: String,
			enum: ["manual", "role", "equal"],
		},
		label: LabelSchema,
		copyright: [CopyrightSplitSchema],
		performance: [PerformanceSplitSchema],
		recording: [RecordingSplitSchema],
	},
	{ _id: false }
)

RightSplitSchema.methods.getOwnerId = function () {
	return typeof this.owner === "string" ? this.owner : this.owner._id
}

RightSplitSchema.methods.getRightHolders = function () {
	let rightHolders = []
	if (this.label && this.label.rightHolder)
		rightHolders.push(this.label.rightHolder)
	for (let rightType of RightTypes.list) {
		if (!Array.isArray(this[rightType])) continue
		for (let item of this[rightType]) {
			if (!rightHolders.includes(item.rightHolder))
				rightHolders.push(item.rightHolder)
		}
	}
	return rightHolders
}

RightSplitSchema.methods.update = async function (data) {
	for (const field of ["privacy", "copyrightDividingMethod", "label"]) {
		if (data[field] !== undefined) this[field] = data[field]
	}

	let promises = []
	if (data.label !== undefined)
		promises.push(User.ensureExist(data.label.rightHolder))

	const owner_id = this.getOwnerId()
	for (let rightType of RightTypes.list) {
		if (!Array.isArray(data[rightType])) continue
		this[rightType] = []
		for (let item of data[rightType]) {
			promises.push(User.ensureExist(item.rightHolder))
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

	await Promise.all(promises)
}

RightSplitSchema.methods.setVote = function (rightHolderId, data) {
	if (this._state !== "voting") throw ConflictingRightSplitState

	for (let rightType of RightTypes.list) {
		for (let item of this[rightType]) {
			if (item.rightHolder === rightHolderId && data[rightType]) {
				if (item.vote === "undecided") {
					item.vote = data[rightType].vote
					item.comment = data[rightType].comment
				}
				break
			}
		}
	}

	this.updateState()
}

RightSplitSchema.methods.updateState = function () {
	let accepted = true
	loop1: for (let type of RightTypes.list) {
		for (let item of this[type]) {
			if (item.vote !== "accepted") accepted = false
			if (item.vote === "rejected") {
				this._state = "rejected"
				break loop1
			}
		}
	}

	if (accepted) this._state = "accepted"
}

RightSplitSchema.methods.getPathsToPopulate = function () {
	let paths = ["rightSplit.owner", "rightSplit.label.rightHolder"]
	for (let rightType of RightTypes.list) {
		if (!Array.isArray(this[rightType])) continue
		for (let i = 0; i < this[rightType].length; i++) {
			paths.push(`rightSplit.${rightType}.${i}.rightHolder`)
		}
	}
	return paths
}

module.exports = RightSplitSchema
