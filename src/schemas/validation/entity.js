const EntityTypes = require("../../constants/entityTypes")
const EntitySchema = require("../serialization/entity")

module.exports.entity = {
	oneOf: [instrument, musical_genre, content_language, digital_distributor],
}

module.exports.patch_entity = {
	$patch: { source: this.entity },
	with: [
		{ op: "add", path: "/properties/users", value: adminFields.users },
		{
			op: "add",
			path: "/properties/adminReview",
			value: adminFields.adminReview,
		},
	],
}

const instrument = {
	$patch: {
		source: EntitySchema.instrument,
	},
	with: [{ op: "remove", path: "/properties/entity_id" }],
}

const musical_genre = {
	$patch: {
		source: EntitySchema[EntityTypes.MUSICAL_GENRE],
	},
	with: [{ op: "remove", path: "/properties/entity_id" }],
}

const content_language = {
	$patch: {
		source: EntitySchema[EntityTypes.CONTENT_LANGUAGE],
	},
	with: [{ op: "remove", path: "/properties/entity_id" }],
}

const digital_distributor = {
	$patch: {
		source: EntitySchema[EntityTypes.DIGITAL_DISTRIBUTOR],
	},
	with: [{ op: "remove", path: "/properties/entity_id" }],
}

const adminFields = {
	users: {
		oneOf: [
			{
				type: "boolean",
				enum: [false],
			},
			{
				type: "array",
				items: {
					type: "string",
				},
			},
		],
	},
	adminReview: {
		type: "string",
	},
}
