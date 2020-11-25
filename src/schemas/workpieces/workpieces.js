const DocumentationSchema = require("./documentation").documentation
const RightSplitSchema = require("./rightSplits").rightSplit

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
		rightSplit: RightSplitSchema,
		archivedSplits: {
			type: "array",
			items: RightSplitSchema,
		},
		documentation: DocumentationSchema,
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
	additionalProperties: false,
}
