const EntityTypes = require("../../constants/entityTypes")
const EntitySchema = require("../serialization/entity")
const CommonSchema = require("../commons")

const adminOps = [
	{
		op: "add",
		path: "/properties/users",
		value: {
			oneOf: [
				{
					type: "boolean",
					enum: [false],
				},
				{
					type: "array",
					items: CommonSchema.uuid1,
				},
			],
		},
	},
	{
		op: "add",
		path: "/properties/adminReview",
		value: CommonSchema.string,
	},
]

const instrument = {
	$patch: {
		source: {...EntitySchema.instrument},
		with: [...adminOps, { op: "remove", path: "/properties/entity_id" }],
	},
}

const musical_genre = {
	$patch: {
		source: {...EntitySchema[EntityTypes.MUSICAL_GENRE]},
		with: [...adminOps, { op: "remove", path: "/properties/entity_id" }],
	},
}

const content_language = {
	$patch: {
		source: {...EntitySchema[EntityTypes.CONTENT_LANGUAGE]},
		with: [...adminOps, { op: "remove", path: "/properties/entity_id" }],
	},
}

const digital_distributor = {
	$patch: {
		source: {...EntitySchema[EntityTypes.DIGITAL_DISTRIBUTOR]},
		with: [...adminOps, { op: "remove", path: "/properties/entity_id" }],
	},
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
				items: CommonSchema.uuid1,
			},
		],
	},
	adminReview: {
		type: "string",
	},
}

module.exports.entity = {
	oneOf: [instrument/*, musical_genre, content_language, digital_distributor*/],
}
