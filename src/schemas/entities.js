module.exports.locale = {
	type: "object",
	properties: {
		fr: { type: "string" },
		en: { type: "string" },
	},
}

module.exports.genericEntityFields = {
	entity_id: {
		type: "string",
	},
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

module.exports["content-language"] = {
	type: "object",
	properties: {
		...this.genericEntityFields,
		name: this.locale,
		altNames: {
			type: "array",
			items: {
				type: "string",
			},
		},
	},
}

module.exports["digital-distributor"] = {
	type: "object",
	properties: {
		...this.genericEntityFields,
		name: {
			type: "string",
		},
		icon: {
			type: "string",
		},
		localizedName: this.locale,
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
}

module.exports.instruments = {
	type: "object",
	properties: {
		...this.genericEntityFields,
		name: this.locale,
		uris: {
			type: "array",
			items: {
				type: "string",
			},
		},
		parents: {
			type: "array",
			items: {
				type: "string",
			},
		},
	},
}

module.exports["musical-genre"] = {
	type: "object",
	properties: {
		...this.genericEntityFields,
		name: this.locale,
		uris: {
			type: "array",
			items: {
				type: "string",
			},
		},
		parents: {
			type: "array",
			items: {
				type: "string",
			},
		},
	},
}

module.exports.list = {
	type: "array",
	items: this.entity,
}

module.exports.entity = {
	anyOf: [
		this["content-language"],
		this["digital-distributor"],
		this.instrument,
		this["musical-genre"],
	],
}

const entityRequestBody = JSON.parse(JSON.stringify(this.entity))

for (schema of entityRequestBody.anyOf) {
	delete schema.properties.entity_id
	schema.additionalProperties = false
}

module.exports.entityRequestBody = entityRequestBody
