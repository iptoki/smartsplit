const { public_user } = require("../user")
const EntitySchema = require("../entity")
const EntityTypes = require("../../constants/entityTypes")
const FileSchema = require("../file")

module.exports.performerTool = {
	type: "object",
	properties: {
		instrument: EntitySchema.instrument,
		role: {
			type: "string",
		},
		notes: {
			type: "string",
		},
	},
	additionalProperties: false,
}

module.exports.performer = {
	type: "object",
	properties: {
		user: public_user,
		type: {
			type: "string",
			enum: ["mainArtist", "featured", "groupMember", "session"],
		},
		isSinger: {
			type: "boolean",
		},
		isMusician: {
			type: "boolean",
		},
		vocals: {
			type: "array",
			items: this.performerTool,
		},
		instruments: {
			type: "array",
			items: this.performerTool,
		},
	},
	additionalProperties: false,
}

module.exports.record = {
	type: "object",
	properties: {
		studio: {
			type: "string",
		},
		engineers: {
			type: "array",
			items: public_user,
		},
		date: {
			type: "object",
			properties: {
				from: {
					type: "string",
					format: "date",
				},
				to: {
					type: "string",
					format: "date",
				},
			},
		},
		notes: {
			type: "array",
			items: {
				type: "string",
			},
		},
	},
	additionalProperties: false,
}

module.exports.creation = {
	type: "object",
	properties: {
		date: {
			type: "string",
			format: "date",
		},
		authors: {
			type: "array",
			items: public_user,
		},
		composers: {
			type: "array",
			items: public_user,
		},
		publishers: {
			type: "array",
			items: public_user,
		},
		iswc: {
			type: "string",
		},
	},
	additionalProperties: false,
}

module.exports.performance = {
	type: "object",
	properties: {
		conductor: public_user,
		performers: {
			type: "array",
			items: this.performer,
		},
	},
	additionalProperties: false,
}

module.exports.recording = {
	type: "object",
	properties: {
		directors: {
			type: "array",
			items: public_user,
		},
		producers: {
			type: "array",
			items: public_user,
		},
		isrc: {
			type: "string",
		},
		recording: {
			type: "array",
			items: this.record,
		},
		mixing: {
			type: "array",
			items: this.record,
		},
		mastering: {
			type: "array",
			items: this.record,
		},
	},
	additionalProperties: false,
}

module.exports.release = {
	type: "object",
	properties: {
		date: {
			type: "string",
			format: "date",
		},
		label: {
			type: "string",
		},
		format: {
			type: "string",
		},
		support: {
			type: "string",
		},
		distributor: {
			type: "string",
		},
		upc: {
			type: "string",
		},
	},
	additionalProperties: false,
}

module.exports.files = {
	type: "object",
	properties: {
		art: {
			type: "array",
			items: FileSchema,
		},
		audio: {
			type: "array",
			items: FileSchema,
		},
		scores: {
			type: "array",
			items: FileSchema,
		},
		midi: {
			type: "array",
			items: FileSchema,
		},
		lyrics: {
			type: "array",
			items: FileSchema,
		},
	},
	additionalProperties: false,
}

module.exports.info = {
	type: "object",
	properties: {
		length: {
			type: "string",
		},
		BPM: {
			type: "number",
		},
		mainGenre: EntitySchema[EntityTypes.MUSICAL_GENRE],
		secondaryGenres: {
			type: "array",
			items: EntitySchema[EntityTypes.MUSICAL_GENRE],
		},
		influences: {
			type: "array",
			items: {
				type: "string",
			},
		},
	},
	additionalProperties: false,
}

module.exports.lyrics = {
	type: "object",
	properties: {
		text: {
			type: "string",
		},
		languages: {
			type: "array",
			items: {
				type: "string",
			},
		},
		access: {
			type: "string",
			enum: ["public", "private", "limited"],
			default: "private",
		},
	},
	additionalProperties: false,
}

module.exports.streaming = {
	type: "object",
	properties: {
		links: {
			type: "array",
			items: {
				type: "object",
				properties: {
					platform: {
						type: "string",
					},
					url: {
						type: "string",
					},
				},
			},
		},
	},
	additionalProperties: false,
}

module.exports.documentation = {
	type: "object",
	properties: {
		creation: this.creation,
		performance: this.performance,
		recording: this.recording,
		release: this.release,
		files: this.files,
		info: this.info,
		lyrics: this.lyrics,
		streaming: this.streaming,
	},
	additionalProperties: false,
}
