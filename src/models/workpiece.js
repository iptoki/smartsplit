const mongoose = require("mongoose")
const uuid = require("uuid").v4

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
			example: "accepted"
		},
		copyright: {
			type: "array",
			items: splitAPISpec
		},
		interpretation: {
			type: "array",
			items: splitAPISpecm
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
	_state: String,
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

	title : {
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