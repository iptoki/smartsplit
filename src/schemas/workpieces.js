const Workpiece = require("../models/workpiece")

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

const splitRequestBody = {
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
	required: ["copyright", "interpretation", "recording"],
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

module.exports.file = {
	type: "object",
	properties: {
		file_id: {
			type: "string",
		},
		name: {
			type: "string",
		},
		mimeType: {
			type: "string",
		},
		size: {
			type: "number",
		},
		visibility: {
			type: "string",
			enum: ["public", "hidden", "private"],
		},
		fileUrl: {
			type: "string",
		},
	},
}

module.exports.fileRequestBody = {
	type: "object",
	properties: {
		name: {
			type: "string",
		},
		visibility: {
			type: "string",
			enum: ["public", "hidden", "private"],
			default: "private",
		},
		mimeType: {
			type: "string",
		},
		data: {
			type: "string",
		},
	},
}

module.exports.workpiece = {
	type: "object",
	properties: {
		workpiece_id: {
			type: "string",
		},
		title: {
			type: "string",
		},
		owner: {
			type: "string",
		},
		rightHolders: {
			type: "array",
			items: {
				type: "string",
				format: "uuid",
				example: "e87b56fe-1ce0-4ec7-8393-e18dc7415041",
			},
		},
		entityTags: {
			type: "array",
			items: {
				type: "string",
				format: "uuid",
				example: "e87b56fe-1ce0-4ec7-8393-e18dc7415041",
			},
		},
		rightSplit: this.rightSplit,
		archivedSplits: {
			type: "array",
			items: this.rightSplit,
		},
		files: {
			type: "array",
			items: this.file,
		},
	},
}

module.exports.workpieceRequestBody = {
	type: "object",
	properties: {
		title: {
			type: "string",
			default: "ExampleTitle",
		},
	},
}
