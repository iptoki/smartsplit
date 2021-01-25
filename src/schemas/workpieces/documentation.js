const UserSchema = require("../users")
const EntitiesSchema = require("../entities")

module.exports.file = {
	type: "object",
	properties: {
		file_id: {
			type: "string",
		},
		filename: { type: "string" },
		metadata: {
			type: "object",
			properties: {
				encoding: { type: "string" },
				mimetype: { type: "string" },
				visibility: {
					type: "string",
					enum: ["public", "hidden", "private"],
				},
			},
		},
		uploadDate: {
			type: "string",
			format: "date-time",
		},
		size: {
			type: "number",
		},
		url: {
			type: "string",
		},
	},
}

// module.exports.externalFile = {
// 	type: "object",
// 	properties: {
// 		url: {
// 			type: "string",
// 		},
// 		public: {
// 			type: "boolean",
// 		},
// 	},
// }

module.exports.performerTool = {
	type: "object",
	properties: {
		instrument: EntitiesSchema.instrument,
		role: {
			type: "string",
		},
		notes: {
			type: "string",
		},
	},
}

module.exports.performer = {
	type: "object",
	properties: {
		user: {
			anyOf: [{ type: "string" }, UserSchema.userPublicProfile],
		},
		type: {
			type: "string",
			enum: ["mainArtist", "featured", "groupMember","session"],
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
}

module.exports.record = {
	type: "object",
	properties: {
		studio: {
			type: "string",
		},
		engineers: {
			type: "array",
			items: {
				anyOf: [{ type: "string" }, UserSchema.userPublicProfile],
			},
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
			items: {
				anyOf: [{ type: "string" }, UserSchema.userPublicProfile],
			},
		},
		composers: {
			type: "array",
			items: {
				anyOf: [{ type: "string" }, UserSchema.userPublicProfile],
			},
		},
		publishers: {
			type: "array",
			items: {
				anyOf: [{ type: "string" }, UserSchema.userPublicProfile],
			},
		},
		iswc: {
			type: "string",
		},
	},
}

module.exports.performance = {
	type: "object",
	properties: {
		conductor: {
			anyOf: [{ type: "string" }, UserSchema.userPublicProfile],
		},
		performers: {
			type: "array",
			items: this.performer,
		},
	},
}

module.exports.recording = {
	type: "object",
	properties: {
		directors: {
			type: "array",
			items: {
				anyOf: [{ type: "string" }, UserSchema.userPublicProfile],
			},
		},
		producers: {
			type: "array",
			items: {
				anyOf: [{ type: "string" }, UserSchema.userPublicProfile],
			},
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
	},
}

module.exports.files = {
	type: "object",
	properties: {
		art: {
			type: "array",
			items: this.file,
		},
		audio: {
			type: "array",
			items: this.file,
		},
		scores: {
			type: "array",
			items: this.file,
		},
		midi: {
			type: "array",
			items: this.file,
		},
		lyrics: {
			type: "array",
			items: this.file,
		},
	},
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
		mainGenre: EntitiesSchema["musical-genre"],
		secondaryGenres: {
			type: "array",
			items: EntitiesSchema["musical-genre"],
		},
		influences: {
			type: "array",
			items: {
				type: "string",
			},
		},
	},
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
}

module.exports.documentationField = {
	anyOf: [
		this.creation,
		this.performance,
		this.recording,
		this.release,
		this.files,
		this.info,
		this.lyrics,
		this.streaming,
	],
}

module.exports.fileRequestBody = {
	type: "object",
	properties: {
		filename: {
			type: "string",
		},
		visibility: {
			type: "string",
			enum: ["public", "hidden", "private"],
		},
		type: {
			type: "string",
			enum: ["art", "audio", "scores", "midi", "lyrics"],
		},
	},
	additionalProperties: false,
}
