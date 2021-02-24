const DocumentationSchema = require("./documentation")
const RightSplitSchema = require("./rightSplits")
const UserSchema = require("../users")

const workpiece = {
	type: "object",
	properties: {
		workpiece_id: { type: "string" },
		title: { type: "string" },
		owner: UserSchema.serialization.collaborator,
		collaborators: {
			type: "array",
			items: {
				type: "object",
				properties: {
					user: UserSchema.serialization.collaborator,
					isRightHolder: { type: "boolean" },
					isInsideDoc: { type: "boolean" },
					permission: {
						type: "string",
						enum: ["admin", "read", "write"],
					},
				},
			},
		},
		version: { type: "number" },
		rightSplit: RightSplitSchema.serialization.rightSplit,
		archivedSplits: {
			type: "array",
			items: RightSplitSchema.serialization.rightSplit,
		},
		documentation: DocumentationSchema.serialization.documentation,
	},
	additionalProperties: false,
}

const createUpdateWorkpiece = {
	type: "object",
	properties: {
		title: { type: "string" },
	},
	additionalProperties: false,
}

module.exports = {
	serialization: {
		workpiece,
	},
	validation: {
		createUpdateWorkpiece,
	},
}
