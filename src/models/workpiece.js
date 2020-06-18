const mongoose = require("mongoose")
const uuid = require("uuid").v4
const User = require("./user")
const UserSchema = require("../schemas/users")

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
				example: "guitarist"
			}
		},
		vote: {
			type: "string",
			enum: ["undecided","accepted","rejected"],
			example: "accepted",
		},
		comment: {
			type: "string",
			example: "this is a comment"
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
			enum: ["draft","voting","accepted","rejected"],
			example: "accepted",
			readOnly: true,
		},
		copyright: {
			type: "array",
			items: splitAPISpec
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


const splitSchema = new mongoose.Schema({
	rightHolder: {
		type: String,
		ref: "User",
	},
	roles: [String],
	vote: {
		type: String,
		enum: ["undecided","accepted","rejected"],
	},
	comment: String,
	shares: Number,
}, { _id: false })


const rightSplitSchema = new mongoose.Schema({
	_state: {
		type: String,
		enum: ["draft","voting","accepted","rejected"],
	},
	copyright: [splitSchema],
	interpretation: [splitSchema],
	recording: [splitSchema],
}, { _id: false })


const WorkpieceSchema = new mongoose.Schema({
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
		type: rightSplitSchema,
		api: rightSplitAPISpec,
	},

	archivedSplits: {
		type: [rightSplitSchema],
		api: {
			type: "array",
			items: rightSplitAPISpec,
		},
	},

}, { timestamps: true })


WorkpieceSchema.methods.setRightSplit = async function (body) {
	this.rightSplit = {
		_state: "draft",
		copyright: [],
		interpretation: [],
		recording: [],
	}
	this.rightHolders = []

	for(type of ["copyright", "interpretation", "recording"]) {
		for(entry of body[type]) {
			if(! await User.exists({_id: entry.rightHolder}))
				throw new UserSchema.UserNotFoundError({user_id: entry.rightHolder})

			if(!this.rightHolders.includes(entry.rightHolder))
				this.rightHolders.push(entry.rightHolder)

			this.rightSplit[type].push({
				rightHolder: entry.rightHolder,
				roles: entry.roles,
				vote: this.owner === entry.rightHolder ? "accepted" : "undecided",
				shares: entry.shares,
			})
		}
	}
}

module.exports = mongoose.model("Workpiece", WorkpieceSchema)