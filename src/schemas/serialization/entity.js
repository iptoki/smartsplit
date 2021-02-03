const EntityTypes = require("../../constants/entityTypes")
const CommonSchema = require("../commons")

const locale = {
	type: "object",
	properties: {
		fr: { type: "string" },
		en: { type: "string" },
	},
	additionalProperties: false,
}

const link = {
	type: "object",
	properties: {
		name: {
			type: "string",
		},
		id: {
			type: "string",
		},
		uri: CommonSchema.URL,
	},
	additionalProperties: false,
}

module.exports[EntityTypes.CONTENT_LANGUAGE] = {
	type: "object",
	properties: {
		entity_id: CommonSchema.uuid1,
		name: locale,
		altNames: {
			type: "array",
			items: {
				type: "string",
			},
		},
	},
	additionalProperties: false,
}

module.exports[EntityTypes.DIGITAL_DISTRIBUTOR] = {
	type: "object",
	properties: {
		entity_id: CommonSchema.uuid1,
		name: {
			type: "string",
		},
		icon: {
			type: "string",
		},
		localizedName: locale,
		domains: {
			type: "array",
			items: {
				type: "string",
			},
		},
		markets: {
			type: "array",
			items: {
				type: "string",
			},
		},
		streaming: {
			type: "boolean",
		},

		download: {
			type: "boolean",
		},
		other: {
			type: "boolean",
		},
		blockchain: {
			type: "boolean",
		},
	},
	additionalProperties: false,
}

module.exports[EntityTypes.INSTRUMENT] = {
	type: "object",
	properties: {
		entity_id: CommonSchema.uuid1,
		name: {
			type: "string",
		},
		links: {
			type: "array",
			items: link,
		},
		langs: locale,
	},
	additionalProperties: false,
}

module.exports[EntityTypes.MUSICAL_GENRE] = {
	type: "object",
	properties: {
		entity_id: CommonSchema.uuid1,
		name: {
			type: "string",
		},
		links: {
			type: "array",
			items: link,
		},
		langs: locale,
		parents: {
			type: "array",
			items: {
				type: "string",
			},
		},
	},
	additionalProperties: false,
}
