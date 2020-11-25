module.exports.split = {
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

module.exports.splitRequestBody = {
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

module.exports.rightSplit = {
	type: "object",
	properties: {
		_state: {
			type: "string",
			enum: ["draft", "voting", "accepted", "rejected"],
		},
		copyright: {
			type: "array",
			items: this.split,
		},
		interpretation: {
			type: "array",
			items: this.split,
		},
		recording: {
			type: "array",
			items: this.split,
		},
	},
}

module.exports.rightSplitRequestBody = {
	type: "object",
	properties: {
		copyright: {
			type: "array",
			items: this.splitRequestBody,
		},
		interpretation: {
			type: "array",
			items: this.splitRequestBody,
		},
		recording: {
			type: "array",
			items: this.splitRequestBody,
		},
	},
	additionalProperties: false,
}

module.exports.rightSplitVoteBody = {
	copyright: {
		type: "string",
		enum: ["accepted", "rejected"],
	},
	interpretation: {
		type: "string",
		enum: ["accepted", "rejected"],
	},
	recording: {
		type: "string",
		enum: ["accepted", "rejected"],
	},
}
