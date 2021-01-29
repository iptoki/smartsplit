const DocumentationSchema = require("./documentation").documentation
const RightSplitSchema = require("./rightSplit").rightSplit

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
			},
		},
		entityTags: {
			type: "array",
			items: {
				type: "string",
			},
		},
		rightSplit: RightSplitSchema,
		archivedSplits: {
			type: "array",
			items: RightSplitSchema,
		},
		documentation: DocumentationSchema,
	},
	additionalProperties: false,
}
