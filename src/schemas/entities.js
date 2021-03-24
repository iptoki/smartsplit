const EntityTypes = require("../constants/entityTypes")

const adminFields = {
	users: {
		oneOf: [
			{
				type: "boolean",
				enum: [false],
			},
			{
				type: "array",
				items: { type: "string" },
			},
		],
	},
	adminReview: { type: "string" },
}

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
		name: { type: "string" },
		id: { type: "string" },
		uri: { type: "string" },
	},
	additionalProperties: false,
}

const contentLanguage = {
	type: "object",
	properties: {
		entity_id: { type: "string" },
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

const digitalDistributor = {
	type: "object",
	properties: {
		entity_id: { type: "string" },
		name: { type: "string" },
		icon: { type: "string" },
		localizedName: locale,
		domains: {
			type: "array",
			items: { type: "string" },
		},
		markets: {
			type: "array",
			items: { type: "string" },
		},
		streaming: { type: "boolean" },
		download: { type: "boolean" },
		other: { type: "boolean" },
		blockchain: { type: "boolean" },
	},
	additionalProperties: false,
}

const instrument = {
	type: "object",
	properties: {
		entity_id: { type: "string" },
		name: { type: "string" },
		links: {
			type: "array",
			items: link,
		},
		langs: locale,
	},
	additionalProperties: false,
}

const musicalGenre = {
	type: "object",
	properties: {
		entity_id: { type: "string" },
		name: { type: "string" },
		links: {
			type: "array",
			items: link,
		},
		langs: locale,
		parents: {
			type: "array",
			items: { type: "string" },
		},
	},
	additionalProperties: false,
}

const createUpdateContentLanguage = {
	type: "object",
	properties: {
		...contentLanguage.properties,
		...adminFields,
	},
	additionalProperties: false,
}

const createUpdateDigitalDistributor = {
	type: "object",
	properties: {
		...digitalDistributor.properties,
		...adminFields,
	},
	additionalProperties: false,
}

const createUpdateInstrument = {
	type: "object",
	properties: {
		...instrument.properties,
		...adminFields,
	},
	additionalProperties: false,
}

const createUpdateMusicalGenre = {
	type: "object",
	properties: {
		...musicalGenre.properties,
		...adminFields,
	},
	additionalProperties: false,
}

delete createUpdateInstrument.properties.entity_id
delete createUpdateMusicalGenre.properties.entity_id
delete createUpdateContentLanguage.properties.entity_id
delete createUpdateDigitalDistributor.properties.entity_id

const createUpdateEntity = {
	oneOf: [
		createUpdateInstrument,
		createUpdateMusicalGenre,
		createUpdateContentLanguage,
		createUpdateDigitalDistributor,
	],
}

module.exports = {
	serialization: {
		[EntityTypes.INSTRUMENT]: instrument,
		[EntityTypes.MUSICAL_GENRE]: musicalGenre,
		[EntityTypes.CONTENT_LANGUAGE]: contentLanguage,
		[EntityTypes.DIGITAL_DISTRIBUTOR]: digitalDistributor,
	},
	validation: {
		createUpdateEntity,
	},
}
