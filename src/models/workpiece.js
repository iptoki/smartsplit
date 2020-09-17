const mongoose = require("mongoose")
const uuid = require("uuid").v4
const Config = require("../config")
const User = require("./user")
const SplitTemplates = require("./notifications/templates")
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

const WorkpieceFileSchema = new mongoose.Schema({
	_id: {
		type: String,
		alias: "file_id",
		default: uuid,
	},
	name: {
		type: String,
	},
	mimeType: {
		type: String,
	},
	size: {
		type: Number,
	},
	visibility: {
		type: String,
		enum: ["public", "hidden", "private"],
	},
	data: Buffer,
})

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
			api: rightSplitAPISpec,
		},

		archivedSplits: {
			type: [RightSplitSchema],
		},

		files: {
			type: [WorkpieceFileSchema],
		},
	},
	{ timestamps: true, toJSON: { virtuals: true } }
)

WorkpieceSchema.virtual("workpiece_id").get(function () {
	return this._id
})

WorkpieceFileSchema.virtual("fileUrl").get(function () {
	return (
		Config.apiUrl + "/workpieces/" + this.parent().id + "/files/" + this._id
	)
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

WorkpieceSchema.methods.addFile = function (name, mimeType, visibility, data) {
	const l = this.files.push({
		name: name,
		size: data.length,
		mimeType: mimeType,
		visibility: visibility,
		data: data,
	})
	return this.files[l - 1]
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
		const template =
			this.rightSplit._state === "accepted"
				? SplitTemplates.ACCEPTED
				: SplitTemplates.REJECTED

		await this.emailRightHolders(template)
		if (!this.isOwnerPartOfRightHolders()) await this.emailOwner(template)
	}
}

module.exports = mongoose.model("Workpiece", WorkpieceSchema)

module.exports.RightTypes = RightTypes

module.exports.File = mongoose.model("WorkpieceFile", WorkpieceFileSchema)
