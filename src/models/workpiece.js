const mongoose = require("mongoose")
const uuid = require("uuid").v4
const User = require("./user")
const UserSchema = require("../schemas/users")
const JWT = require("../utils/jwt")

const JWT_SPLIT_TYPE = "workpiece:split-invite"

const RightTypes = ["copyright", "interpretation", "recording"]

const splitAPISpec = {
	type: "object",
	properties: {
		rightHolder: {
			type: "string",
			format: "uuid",
			example: "e87b56fe-1ce0-4ec7-8393-e18dc7415041",
		},
		roles: {
			type: "array",
			items: {
				type: "string",
				example: "guitarist",
			},
		},
		vote: {
			type: "string",
			enum: ["undecided", "accepted", "rejected"],
			example: "accepted",
		},
		comment: {
			type: "string",
			example: "this is a comment",
		},
		shares: {
			type: "number",
			example: 2,
		},
	},
}

const rightSplitAPISpec = {
	type: "object",
	properties: {
		_state: {
			type: "string",
			enum: ["draft", "voting", "accepted", "rejected"],
			example: "accepted",
			readOnly: true,
		},
		copyright: {
			type: "array",
			items: splitAPISpec,
		},
		interpretation: {
			type: "array",
			items: splitAPISpec,
		},
		recording: {
			type: "array",
			items: splitAPISpec,
		},
	},
}

const SplitSchema = new mongoose.Schema(
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

const RightSplitSchema = new mongoose.Schema(
	{
		_state: {
			type: String,
			enum: ["draft", "voting", "accepted", "rejected"],
		},
		copyright: [SplitSchema],
		interpretation: [SplitSchema],
		recording: [SplitSchema],
	},
	{ _id: false }
)

const WorkpieceSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			alias: "workpiece_id",
			default: uuid,
			api: {
				type: "string",
				format: "uuid",
				example: "e87b56fe-1ce0-4ec7-8393-e18dc7415041",
				readOnly: true,
			},
		},

		title: {
			type: String,
			api: {
				type: "string",
				example: "MyWorkpieceTitle",
			},
		},

		owner: {
			type: String,
			ref: "User",
			api: {
				type: "string",
				format: "uuid",
				example: "e87b56fe-1ce0-4ec7-8393-e18dc7415041",
				readOnly: true,
			},
		},

		rightHolders: {
			type: [String],
			ref: "User",
			api: {
				type: "array",
				items: {
					type: "string",
					format: "uuid",
					example: "e87b56fe-1ce0-4ec7-8393-e18dc7415041",
				},
				readOnly: true,
			},
		},

		entityTags: {
			type: [String],
			ref: "ListEntity",
			api: {
				type: "array",
				items: {
					type: "string",
					format: "uuid",
					example: "e87b56fe-1ce0-4ec7-8393-e18dc7415041",
				},
			},
		},

		rightSplit: {
			type: RightSplitSchema,
			api: rightSplitAPISpec,
		},

		archivedSplits: {
			type: [RightSplitSchema],
			api: {
				type: "array",
				items: rightSplitAPISpec,
			},
		},
	},
	{ timestamps: true }
)

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

	for (let rightType of RightTypes) {
		for (let entry of body[rightType]) {
			if (!(await User.exists({ _id: entry.rightHolder })))
				throw new UserSchema.UserNotFoundError({ user_id: entry.rightHolder })

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
	for (let type of RightTypes) {
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
	for (rh of this.rightHolders) await rh.sendNotification(notificationType)
}

WorkpieceSchema.methods.submitRightSplit = async function () {
	this.rightSplit._state = "voting"
	await this.emailRightHolders("split-created")
}

WorkpieceSchema.methods.swapRightHolder = async function (originalId, swapId) {
	const index = this.rightHolders.indexOf(originalId)
	this.rightHolders[index] = swapId

	for (let type of RightTypes) {
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

	for (let type of RightTypes) {
		for (let entry of this.rightSplit[type]) {
			if (entry.vote === "rejected") this.rightSplit._state = "rejected"
			else if (entry.vote === "undecided") accepted = false
		}
	}

	if (accepted) this.rightSplit._state = "accepted"

	if (this.rightSplit._state !== initialState) {
		if (this.rightSplit._state === "accepted")
			await this.emailRightHolders("split-accepted")

		if (this.rightSplit._state === "rejected")
			await this.emailRightHolders("split-rejected")
	}
}

module.exports = mongoose.model("Workpiece", WorkpieceSchema)

module.exports.RightTypes = RightTypes
