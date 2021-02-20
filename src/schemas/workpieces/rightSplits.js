const UserSchema = require("../users")

const createUpdateCopyrightSplit = {
	type: "object",
	properties: {
		rightHolder: { type: "string" },
		roles: {
			type: "array",
			items: { type: "string" },
		},
		shares: { type: "number" },
	},
	additionalProperties: false,
}

const createUpdatePerformanceSplit = {
	type: "object",
	properties: {
		rightHolder: { type: "string" },
		roles: {
			type: "array",
			items: { type: "string" },
		},
		status: {
			type: "string",
			enum: ["principal", "featured", "bandMember", "session"],
		},
		shares: { type: "number" },
	},
	additionalProperties: false,
}

const createUpdateRecordingSplit = {
	type: "object",
	properties: {
		rightHolder: { type: "string" },
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
		shares: { type: "number" },
	},
	additionalProperties: false,
}

const createUpdateLabel = {
	type: "object",
	properties: {
		rightHolder: { type: "string" },
		agreementDuration: { type: "string" },
		notifViaEmail: { type: "boolean" },
		notifViaText: { type: "boolean" },
		shares: { type: "number" },
	},
	additionalProperties: false,
}

const createUpdateRightSplit = {
	type: "object",
	properties: {
		isPublic: { type: "boolean" },
		copyrightDividingMethod: {
			type: "string",
			enum: ["manual", "role", "equal"],
		},
		label: createUpdateLabel,
		copyright: {
			type: "array",
			items: createUpdateCopyrightSplit,
		},
		performance: {
			type: "array",
			items: createUpdatePerformanceSplit,
		},
		recording: {
			type: "array",
			items: createUpdateRecordingSplit,
		},
	},
	additionalProperties: false,
}

const copyrightSplit = {
	type: "object",
	properties: {
		...createUpdateCopyrightSplit.properties,
		rightHolder: UserSchema.serialization.collaborator,
		vote: {
			type: "string",
			enum: ["undecided", "accepted", "rejected"],
		},
		comment: { type: "string" },
	},
	additionalProperties: false,
}

const performanceSplit = {
	type: "object",
	properties: {
		...createUpdatePerformanceSplit.properties,
		rightHolder: UserSchema.serialization.collaborator,
		vote: {
			type: "string",
			enum: ["undecided", "accepted", "rejected"],
		},
		comment: { type: "string" },
	},
	additionalProperties: false,
}

const recordingSplit = {
	type: "object",
	properties: {
		...createUpdateRecordingSplit.properties,
		rightHolder: UserSchema.serialization.collaborator,
		vote: {
			type: "string",
			enum: ["undecided", "accepted", "rejected"],
		},
		comment: { type: "string" },
	},
	additionalProperties: false,
}

const label = {
	type: "object",
	properties: {
		...createUpdateLabel.properties,
		rightHolder: UserSchema.serialization.collaborator,
		vote: {
			type: "string",
			enum: ["undecided", "accepted", "rejected"],
		},
		comment: { type: "string" },
	},
	additionalProperties: false,
}

const privacy = {
	type: "object",
	properties: {
		rightHolder: UserSchema.serialization.collaborator,
		vote: {
			type: "string",
			enum: ["undecided", "accepted", "rejected"],
		},
		comment: { type: "string" },
	},
	additionalProperties: false,
}

const rightSplit = {
	type: "object",
	properties: {
		_state: {
			type: "string",
			enum: ["draft", "voting", "accepted", "rejected"],
		},
		version: { type: "number" },
		owner: UserSchema.serialization.collaborator,
		isPublic: { type: "boolean" },
		copyrightDividingMethod: {
			type: "string",
			enum: ["manual", "role", "equal"],
		},
		label,
		copyright: {
			type: "array",
			items: copyrightSplit,
		},
		performance: {
			type: "array",
			items: performanceSplit,
		},
		recording: {
			type: "array",
			items: recordingSplit,
		},
		privacy: {
			type: "array",
			items: privacy,
		},
	},
	additionalProperties: false,
}

const vote = {
	type: "object",
	properties: {
		vote: {
			type: "string",
			enum: ["accepted", "rejected"],
		},
		comment: { type: "string" },
	},
	additionalProperties: false,
}

const voteRightSplit = {
	type: "object",
	properties: {
		copyright: vote,
		performance: vote,
		recording: vote,
		label: vote,
		privacy: vote,
	},
	additionalProperties: false,
}

const submitRightSplit = {
	type: "object",
	items: {
		type: "object",
		patternProperties: {
			"^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$": {
				type: "string",
			},
		},
	},
	additionalProperties: false,
}

module.exports = {
	serialization: {
		rightSplit,
	},
	validation: {
		voteRightSplit,
		submitRightSplit,
		createUpdateRightSplit,
	},
}
