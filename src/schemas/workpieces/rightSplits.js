const UserSchema = require("../users")

module.exports.copyrightSplit = {
	type: "object",
	properties: {
		rightHolder: UserSchema.collaboratorProfile,
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
		rightHolder: UserSchema.collaboratorProfile,
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
		rightHolder: UserSchema.collaboratorProfile,
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

module.exports.label = {
	type: "object",
	properties: {
		rightHolder: UserSchema.collaboratorProfile,
		agreementDuration: {
			type: "string",
		},
		notifViaEmail: {
			type: "boolean",
		},
		notifViaText: {
			type: "boolean",
		},
		shares: {
			type: "number",
		},
		vote: {
			type: "string",
			enum: ["undecided", "accepted", "rejected"],
		},
		comment: {
			type: "string",
		},
	},
}

module.exports.privacy = {
	type: "object",
	properties: {
		rightHolder: UserSchema.collaboratorProfile,
		vote: {
			type: "string",
			enum: ["undecided", "accepted", "rejected"],
		},
		comment: {
			type: "string",
		},
	},
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
		owner: UserSchema.collaboratorProfile,
		isPublic: {
			type: "boolean",
		},
		copyrightDividingMethod: {
			type: "string",
			enum: ["manual", "role", "equal"],
		},
		label: this.label,
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
		privacy: {
			type: "array",
			items: this.privacy,
		},
	},
}

module.exports.labelRequestBody = {
	type: "object",
	properties: {
		rightHolder: {
			type: "string",
		},
		agreementDuration: {
			type: "string",
		},
		notifViaEmail: {
			type: "boolean",
		},
		notifViaText: {
			type: "boolean",
		},
		shares: {
			type: "number",
		},
	},
	additionalProperties: false,
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
		shares: {
			type: "number",
		},
	},
	additionalProperties: false,
}

module.exports.rightSplitRequestBody = {
	type: "object",
	properties: {
		isPublic: {
			type: "boolean",
		},
		copyrightDividingMethod: {
			type: "string",
			enum: ["manual", "role", "equal"],
		},
		label: this.labelRequestBody,
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

module.exports.vote = {
	type: "object",
	properties: {
		vote: {
			type: "string",
			enum: ["accepted", "rejected"],
		},
		comment: {
			type: "string",
		},
	},
	additionalProperties: false,
}

module.exports.rightSplitVoteBody = {
	type: "object",
	properties: {
		copyright: this.vote,
		performance: this.vote,
		recording: this.vote,
		label: this.vote,
		privacy: this.vote,
	},
	additionalProperties: false,
}

module.exports.rightSplitSubmitBody = {
	type: "array",
	items: {
		type: "object",
		properties: {
			user_id: {
				type: "string",
			},
			email: {
				type: "string",
			},
		},
	},
	additionalProperties: false,
}
