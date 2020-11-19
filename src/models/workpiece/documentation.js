const mongoose = require("mongoose")

const DocumentationSchema = new mongoose.Schema(
	{
		creation: CreationSchema,
		performance: PerformanceSchema,
		recording: RecordingSchema,
		release: ReleaseSchema,
		files: FilesSchema,
		info: InfoSchema,
		lyrics: LyricsSchema,
		streaming: [StreamingSchema],
	},
	{ _id: false }
)

const CreationSchema = new mongoose.Schema(
	{
		date: String,
		authors: {
			type: [String],
			ref: "User",
		},
		composers: {
			type: [String],
			ref: "User",
		},
		publishers: {
			type: [String],
			ref: "User",
		},
		iswc: String,
	},
	{ _id: false }
)

const PerformanceSchema = new mongoose.Schema(
	{
		principale: {
			type: [String],
			ref: "User",
		},
		accompanying: {
			type: [String],
			ref: "User",
		},
	},
	{ _id: false }
)

const RecordingSchema = new mongoose.Schema(
	{
		directors: {
			type: [String],
			ref: "User",
		},
		recording: [RecordSchema] 
		mixing: [RecordSchema]
		mastering: [RecordSchema]
	},
	{ _id: false }
)

const ReleaseSchema = new mongoose.Schema(
	{
		date: String,
		label: String,
		format: String,
		support: String,
	},
	{ _id: false }
)

const FilesSchema = new mongoose.Schema(
	{
		art: [FilesSchema]
		audio: [ExternalFileSchema]
		scores: [ExternalFileSchema]
		midi: [ExternalFileSchema]
	},
	{ _id: false }
)

const InfoSchema = new mongoose.Schema(
	{
		length: String,
		BPM: Number,
		mainGenre: {
			type: String,
			ref: "",
		},
		secondaryGenres: {
			type: [String],
			ref: "",
		},
		influences: [String],
	},
	{ _id: false }
)

const LyricsSchema = new mongoose.Schema(
	{
		texts: [String],
		languages: [String],
		public: Boolean,
	},
	{ _id: false }
)

const StreamingSchema = new mongoose.Schema(
	{
		platform: String,
		url: String,
	},
	{ _id: false }
)

const ExternalFileSchema = new mongoose.Schema(
	{
		url: String,
		public: Boolean,
	}	
	{ _id: false }
)

const FileSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			alias: "file_id",
			default: uuid,
		},
		name: {
			type: String,
		},
		mimeType: {
			type: String,
		},
		size: {
			type: Number,
		},
		visibility: {
			type: String,
			enum: ["public", "hidden", "private"],
		},
		data: Buffer,
	},
	{ toJSON: { virtuals: true } }	
)

const RecordSchema = new mongoose.Schema(
	{
		studio: {
			type: String,
			ref: "",
		},
		engineers: {
			type: [String],
			ref: "User",
		},
		date: String,
		notes: [String],
	}	
	{ _id: false }
)
