module.exports.file = {
	type: "object",
	properties: {
		file_id: {
			type: "string",
		},
		name: {
			type: "string",
		},
		mimeType: {
			type: "string",
		},
		size: {
			type: "number",
		},
		visibility: {
			type: "string",
			enum: ["public", "hidden", "private"],
		},
		url: {
			type: "string",
		},
	},
}

module.exports.externalFile = {
	type: "object",
	properties: {
		url: {
			type: "string",
		},
		public: {
			type: "boolean",
		},
	},
}

module.exports.musicGenre = {
	type: "object",
	properties: {
		id: {
			type: "string",
		},
		name: {
			type: "string",
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
				type: "string",
			},
		},
		date: {
			type: "string",
			format: "date",
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
				type: "string",
			},
		},
		composers: {
			type: "array",
			items: {
				type: "string",
			},
		},
		publishers: {
			type: "array",
			items: {
				type: "string",
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
		principle: {
			type: "array",
			items: {
				type: "string",
			},
		},
		accompanying: {
			type: "array",
			items: {
				type: "string",
			},
		},
	},
}

module.exports.recording = {
	type: "object",
	properties: {
		directors: {
			type: "array",
			items: {
				type: "string",
			},
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
			items: this.externalFile,
		},
		scores: {
			type: "array",
			items: this.externalFile,
		},
		midi: {
			type: "array",
			items: this.externalFile,
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
		mainGenre: this.musicGenre,
		secondaryGenres: {
			type: "array",
			items: this.musicGenre,
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
		texts: {
			type: "array",
			items: {
				type: "string",
			},
		},
		languages: {
			type: "array",
			items: {
				type: "string",
			},
		},
		public: {
			type: "boolean",
		},
	},
}

module.exports.streaming = {
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

module.exports.fileRequestBody = {
	type: "object",
	properties: {
		name: {
			type: "string",
		},
		visibility: {
			type: "string",
			enum: ["public", "hidden", "private"],
			default: "private",
		},
		mimeType: {
			type: "string",
		},
		data: {
			type: "string",
		},
	},
	additionalProperties: false,
}
