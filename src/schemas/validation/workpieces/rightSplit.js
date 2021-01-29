const UserSchema = require("../users")
const RightSplitSchema = require("../../serialization/workpiece/rightSplit")

module.exports.copyrightSplit = {
	$patch: { source: RightSplitSchema.copyrightSplit },
	with: [
		{ op: "remove", path: "/properties/vote" },
		{
			op: "replace",
			path: "/properties/rightHolder",
			value: { type: "string" },
		},
	],
}

module.exports.performanceSplit = {
	$patch: { source: RightSplitSchema.performanceSplit },
	with: [
		{ op: "remove", path: "/properties/vote" },
		{
			op: "replace",
			path: "/properties/rightHolder",
			value: { type: "string" },
		},
	],
}

module.exports.recordingSplit = {
	$patch: { source: RightSplitSchema.recordingSplit },
	with: [
		{ op: "remove", path: "/properties/vote" },
		{
			op: "replace",
			path: "/properties/rightHolder",
			value: { type: "string" },
		},
	],
}

module.exports.rightSplit = {
	type: "object",
	properties: {
		copyright: {
			type: "array",
			items: this.copyrightSplit,
		},
		performance: {
			type: "array",
			items: this.performanceSplit,
		},
		recording: {
			type: "array",
			items: this.recordingSplit,
		},
	},
	additionalProperties: false,
}

module.exports.vote = {
	type: "object",
	properties: {
		copyright: {
			type: "string",
			enum: ["accepted", "rejected"],
		},
		performance: {
			type: "string",
			enum: ["accepted", "rejected"],
		},
		recording: {
			type: "string",
			enum: ["accepted", "rejected"],
		},
	},
	additionalProperties: false,
}
