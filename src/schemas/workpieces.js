const DocumentationSchema = require("./documentation")
const RightSplitSchema = require("./rightSplits")
const Tasks = require("../constants/tasks")
const UserSchema = require("./users")

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
		purchases: {
			type: "array",
			items: { type: "string" },
		},
		tasks: {
			type: "object",
			properties: {
				[Tasks.Types.SOCAN]: { type: "string", enum: Tasks.Status.list },
				[Tasks.Types.SOCAN_DR]: { type: "string", enum: Tasks.Status.list },
				[Tasks.Types.SOPROQ]: { type: "string", enum: Tasks.Status.list },
				[Tasks.Types.ARTISTI]: { type: "string", enum: Tasks.Status.list },
				[Tasks.Types.BANQ]: { type: "string", enum: Tasks.Status.list },
				history: {
					type: "object",
					properties: {
						task: { type: "string", enum: Tasks.Types.list },
						from: { type: "string", enum: Tasks.Status.list },
						to: { type: "string", enum: Tasks.Status.list },
						updatedAt: { type: "string" },
					},
					additionalProperties: false,
				},
			},
			additionalProperties: false,
		},
		createdAt: { type: "string" },
		updatedAt: { type: "string" },
	},
	additionalProperties: false,
}

const createUpdateWorkpiece = {
	type: "object",
	properties: {
		title: { type: "string", minLength: 1 },
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
