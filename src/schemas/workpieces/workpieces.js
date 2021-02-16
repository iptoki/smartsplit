const DocumentationSchema = require("./documentation").documentation
const RightSplitSchema = require("./rightSplits").rightSplit
const UserSchema = require("../users")

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
			anyOf: [{ type: "string" }, UserSchema.collaboratorProfile],
		},
		rightHolders: {
			type: "array",
			items: {
				anyOf: [{ type: "string" }, UserSchema.collaboratorProfile],
			},
		},
		version: {
			type: "number",
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
