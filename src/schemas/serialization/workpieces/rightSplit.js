const { public_user } = require("../user")

module.exports.copyrightSplit = {
	type: "object",
	properties: {
		rightHolder: public_user,
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
	additionalProperties: false,
}

module.exports.performanceSplit = {
	type: "object",
	properties: {
		rightHolder: public_user,
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
	additionalProperties: false,
}

module.exports.recordingSplit = {
	type: "object",
	properties: {
		rightHolder: public_user,
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
	additionalProperties: false,
}
