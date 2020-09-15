module.exports.locale = {
	type: "object",
	properties: {
		fr: { type: "string" },
		en: { type: "string" },
	},
}

module.exports.genericEntity = {
	type: "object",
	properties: {
		entity_id: {
			type: "string",
		},
		users: {
			oneOf: [
				{ const: false },
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
	},
}

module.exports.content_languages = {
	allOf: this.genericEntity,
	properties: {
		name: this.locale,
	},

	altNames: {
		type: "array",
		items: {
			type: "string",
		},
	},
}

module.exports.digital_distributors = {
	allOf: this.genericEntity,
	properties: {
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
	allOf: this.genericEntity,
	properties: {
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

module.exports.musical_genres = {
	allOf: this.genericEntity,
	properties: {
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
	oneOf: [
		this.content_languages,
		this.digital_distributors,
		this.instruments,
		this.musical_genres,
	],
}
