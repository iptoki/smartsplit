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
}
