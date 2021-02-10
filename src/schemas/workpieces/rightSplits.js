const UserSchema = require("../users")

module.exports.copyrightSplit = {
	type: "object",
	properties: {
		rightHolder: {
			anyOf: [{ type: "string" }, UserSchema.userPublicProfile],
		},
		roles: {
			type: "array",
			items: {
				type: "string",
			},
		},
		vote: {
			type: "string",
			enum: ["undecided", "accepted", "rejected"],
		},
		comment: {
			type: "string",
		},
		shares: {
			type: "number",
		},
	},
}

module.exports.performanceSplit = {
	type: "object",
	properties: {
		rightHolder: {
			anyOf: [{ type: "string" }, UserSchema.userPublicProfile],
		},
		roles: {
			type: "array",
			items: {
				type: "string",
			},
		},
		status: {
			type: "string",
			enum: ["principal", "featured", "bandMember", "session"],
		},
		vote: {
			type: "string",
			enum: ["undecided", "accepted", "rejected"],
		},
		comment: {
			type: "string",
		},
		shares: {
			type: "number",
		},
	},
}

module.exports.recordingSplit = {
	type: "object",
	properties: {
		rightHolder: {
			anyOf: [{ type: "string" }, UserSchema.userPublicProfile],
		},
		function: {
			type: "string",
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
			type: "string",
			enum: ["undecided", "accepted", "rejected"],
		},
		comment: {
			type: "string",
		},
		shares: {
			type: "number",
		},
	},
}

module.exports.copyrightSplitRequestBody = {
	type: "object",
	properties: {
		rightHolder: {
			type: "string",
		},
		roles: {
			type: "array",
			items: {
				type: "string",
			},
		},
		comment: {
			type: "string",
		},
		shares: {
			type: "number",
		},
	},
	additionalProperties: false,
}

module.exports.performanceSplitRequestBody = {
	type: "object",
	properties: {
		rightHolder: {
			type: "string",
		},
		roles: {
			type: "array",
			items: {
				type: "string",
			},
		},
		status: {
			type: "string",
			enum: ["principal", "featured", "bandMember", "session"],
		},
		comment: {
			type: "string",
		},
		shares: {
			type: "number",
		},
	},
	additionalProperties: false,
}

module.exports.recordingSplitRequestBody = {
	type: "object",
	properties: {
		rightHolder: {
			type: "string",
		},
		function: {
			type: "string",
			enum: [
				"producer",
				"autoProducer",
				"directorProducer",
				"techProducer",
				"studio",
				"illustratorDesigner",
			],
		},
		comment: {
			type: "string",
		},
		shares: {
			type: "number",
		},
	},
	additionalProperties: false,
}

module.exports.rightSplit = {
	type: "object",
	properties: {
		_state: {
			type: "string",
			enum: ["draft", "voting", "accepted", "rejected"],
		},
		version: {
			type: "number",
		},
		owner: {
			anyOf: [{ type: "string" }, UserSchema.userPublicProfile],
		},
		privacy: {
			type: "string",
			enum: ["private", "public"],
		},
		copyrightDividingMethod: {
			type: "string",
			enum: ["manual", "role", "equal"],
		},
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
}

module.exports.rightSplitRequestBody = {
	type: "object",
	properties: {
		privacy: {
			type: "string",
			enum: ["private", "public"],
		},
		copyrightDividingMethod: {
			type: "string",
			enum: ["manual", "role", "equal"],
		},
		copyright: {
			type: "array",
			items: this.copyrightSplitRequestBody,
		},
		performance: {
			type: "array",
			items: this.performanceSplitRequestBody,
		},
		recording: {
			type: "array",
			items: this.recordingSplitRequestBody,
		},
	},
	additionalProperties: false,
}

module.exports.rightSplitVoteBody = {
	type: "object",
	properties: {	
		copyright: {
			vote: {
				type: "string",
				enum: ["accepted", "rejected"],
			},
			comment: {
				type: "string",
			},
		},
		performance: {
			vote: {
				type: "string",
				enum: ["accepted", "rejected"],
			},
			comment: {
				type: "string",
			},
		},
		recording: {
			vote: {
				type: "string",
				enum: ["accepted", "rejected"],
			},
			comment: {
				type: "string",
			},
		},
	},
	additionalProperties: false,
}
