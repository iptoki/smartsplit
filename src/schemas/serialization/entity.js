module.exports["content-language"] = {
	type: "object",
	properties: {
		entity_id: {
			type: "string",
		},
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

module.exports["digital-distributor"] = {
	type: "object",
	properties: {
		entity_id: {
			type: "string",
		},
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

module.exports.instrument = {
	type: "object",
	properties: {
		entity_id: {
			type: "string",
		},
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

module.exports["musical-genre"] = {
	type: "object",
	properties: {
		entity_id: {
			type: "string",
		},
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
		uri: {
			type: "string",
		},
	},
	additionalProperties: false,
}
