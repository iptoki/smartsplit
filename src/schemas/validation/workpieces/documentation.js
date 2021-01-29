const DocumentationSchema = require("../../serialization/workpieces/documentation")

const performerTool = {
	$patch: { source: DocumentationSchema.performerTool },
	with: [
		{
			op: "replace",
			path: "/properties/instrument",
			value: { type: "string" },
		},
	],
}

const performer = {
	$patch: { source: DocumentationSchema.performer },
	with: [
		{
			op: "replace",
			path: "/properties/instrument",
			value: { type: "string" },
		},
		{ op: "replace", path: "/properties/vocals", value: performerTool },
		{ op: "replace", path: "/properties/instruments", value: performerTool },
	],
}

const record = {
	$patch: { source: DocumentationSchema.record },
	with: [
		{
			op: "replace",
			path: "/properties/engineers/items",
			value: { type: "string" },
		},
	],
}

module.exports.creation = {
	$patch: { source: DocumentationSchema.creation },
	with: [
		{
			op: "replace",
			path: "/properties/authors/items",
			value: { type: "string" },
		},
		{
			op: "replace",
			path: "/properties/composers/items",
			value: { type: "string" },
		},
		{
			op: "replace",
			path: "/properties/publishers/items",
			value: { type: "string" },
		},
	],
}

module.exports.performance = {
	$patch: { source: DocumentationSchema.performance },
	with: [
		{ op: "replace", path: "/properties/performers/items", value: performer },
		{ op: "replace", path: "/properties/conductor", value: { type: "string" } },
	],
}

module.exports.recording = {
	$patch: { source: DocumentationSchema.recording },
	with: [
		{
			op: "replace",
			path: "/properties/directors/items",
			value: { type: "string" },
		},
		{
			op: "replace",
			path: "/properties/producers/items",
			value: { type: "string" },
		},
		{ op: "replace", path: "/properties/recording/items", value: record },
		{ op: "replace", path: "/properties/mixing/items", value: record },
		{ op: "replace", path: "/properties/mastering/items", value: record },
	],
}

module.exports.release = {
	$patch: { source: DocumentationSchema.release },
	with: [
		{
			op: "replace",
			path: "/properties/date",
			value: {
				oneOf: [
					{ type: "string", format: "date" },
					{ type: "string", enum: [""] },
				],
			},
		},
	],
}

module.exports.info = {
	$patch: { source: DocumentationSchema.info },
	with: [
		{ op: "replace", path: "/properties/mainGenre", value: { type: "string" } },
		{
			op: "replace",
			path: "/properties/secondaryGenres/items",
			value: { type: "string" },
		},
	],
}

module.exports.lyrics = DocumentationSchema.lyrics

module.exports.streaming = DocumentationSchema.streaming

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

module.exports.documentationField = {
	oneOf: [
		this.creation,
		this.performance,
		this.recording,
		this.release,
		this.info,
		this.lyrics,
		this.streaming,
	],
}

module.exports.file = {
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
