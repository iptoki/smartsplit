const mongoose = require("mongoose")
const uuid = require("uuid").v4
const User = require("../user")
const Config = require("../../config")
const { UserNotFound } = require("../../routes/errors")

const ExternalFileSchema = new mongoose.Schema(
	{
		url: String,
		public: Boolean,
	},
	{ _id: false }
)

const FileSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			alias: "file_id",
		},
		length: {
			type: Number,
			alias: "size",
		},
		chunkSize: Number,
		uploadDate: Date,
		filename: String,
		md5: String,
		metadata: new mongoose.Schema(
			{
				encoding: String,
				mimetype: String,
				visibility: {
					type: String,
					enum: ["public", "hidden", "private"],
				},
			},
			{ _id: false }
		),
	},
	{ strict: false, toJSON: { virtuals: true } }
)

const GFSFile = new mongoose.model("GFSFile", FileSchema, "protectedWork.files")

const RecordSchema = new mongoose.Schema(
	{
		studio: String,
		engineers: [
			{
				type: String,
				ref: "User",
			},
		],
		date: new mongoose.Schema(
			{
				from: Date,
				to: Date,
			},
			{ _id: false }
		),
		notes: [String],
	},
	{ _id: false }
)

const PerformerToolSchema = new mongoose.Schema(
	{
		instrument: {
			type: String,
			ref: "Entity",
		},
		role: {
			type: String,
			ref: "",
		},
		notes: String,
	},
	{ _id: false }
)

const PerformerSchema = new mongoose.Schema(
	{
		user: {
			type: String,
			ref: "User",
		},
		type: {
			type: String,
			enum: ["principale", "featured", "bandMember"],
		},
		isSinger: Boolean,
		isMusician: Boolean,
		vocals: [PerformerToolSchema],
		instruments: [PerformerToolSchema],
	},
	{ _id: false }
)

const CreationSchema = new mongoose.Schema(
	{
		date: String,
		authors: [
			{
				type: String,
				ref: "User",
			},
		],
		composers: [
			{
				type: String,
				ref: "User",
			},
		],
		publishers: [
			{
				type: String,
				ref: "User",
			},
		],
		iswc: String,
	},
	{ _id: false }
)

const PerformanceSchema = new mongoose.Schema(
	{
		conductor: {
			type: String,
			ref: "User",
		},
		performers: [PerformerSchema],
	},
	{ _id: false }
)

const RecordingSchema = new mongoose.Schema(
	{
		directors: [
			{
				type: String,
				ref: "User",
			},
		],
		producers: [
			{
				type: String,
				ref: "User",
			},
		],
		isrc: String,
		recording: [RecordSchema],
		mixing: [RecordSchema],
		mastering: [RecordSchema],
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
		art: [
			{
				type: String,
				ref: GFSFile,
			},
		],
		audio: [ExternalFileSchema],
		scores: [ExternalFileSchema],
		midi: [ExternalFileSchema],
	},
	{ _id: false }
)

const InfoSchema = new mongoose.Schema(
	{
		length: String,
		BPM: Number,
		mainGenre: {
			type: String,
			ref: "Entity",
		},
		secondaryGenres: [
			{
				type: String,
				ref: "Entity",
			},
		],
		influences: [String],
	},
	{ _id: false }
)

const LyricsSchema = new mongoose.Schema(
	{
		text: String,
		languages: [String],
		access: {
			type: String,
			enum: ["public", "private", "limited"],
		},
	},
	{ _id: false }
)

const StreamingSchema = new mongoose.Schema(
	{
		links: [
			new mongoose.Schema(
				{
					platform: String,
					url: String,
				},
				{ _id: false }
			),
		],
	},
	{ _id: false }
)

const DocumentationSchema = new mongoose.Schema(
	{
		creation: {
			type: CreationSchema,
			default: {},
		},
		performance: {
			type: PerformanceSchema,
			default: {},
		},
		recording: {
			type: RecordingSchema,
			default: {},
		},
		release: {
			type: ReleaseSchema,
			default: {},
		},
		files: {
			type: FilesSchema,
			default: {},
		},
		info: {
			type: InfoSchema,
			default: {},
		},
		lyrics: {
			type: LyricsSchema,
			default: {},
		},
		streaming: [StreamingSchema],
	},
	{ _id: false }
)

FileSchema.virtual("url").get(function () {
	return (
		Config.apiUrl +
		"/workpieces/" +
		this.parent().id +
		"/documentation/files/" +
		this._id
	)
})

DocumentationSchema.methods.addFile = function (data) {
	const file_id = uuid()
	if (data.fields.visibility === undefined) data.fields.visibility = {}
	const options = {
		metadata: {
			encoding: data.encoding,
			mimetype: data.mimetype,
			visibility: data.fields.visibility.value || "private",
		},
	}
	data.file.pipe(
		mongoose.bucket.protectedWork.openUploadStreamWithId(
			file_id,
			data.filename,
			options
		)
	)
	const length = this.files.art.push(file_id)
	return this.files.art[length - 1]
}

DocumentationSchema.methods.deleteFile = async function (file_id) {
	if (!this.files.art.includes(file_id)) throw new Error("file not found")
	this.files.art.filter((id) => id === file_id)
	await mongoose.bucket.protectedWork.delete(file_id)
}

DocumentationSchema.methods.updateCreation = async function (data) {
	for (let field of ["date", "iswc"])
		if (field !== undefined) this.creation[field] = data[field]
	for (field of ["authors", "composers", "publishers"])
		if (Array.isArray(data[field])) {
			for (const uid of data[field])
				if (!(await User.exists({ _id: uid }))) throw UserNotFound
			this.creation[field] = data[field]
		}
}

DocumentationSchema.methods.updatePerformance = async function (data) {
	if (data.conductor !== undefined) this.performance.conductor = data.conductor
	if (Array.isArray(data.performers)) {
		// TODO
	}
}

DocumentationSchema.methods.updateRecording = async function (data) {
	if (Array.isArray(data.directors)) {
		for (const uid of data.directors)
			if (!(await User.exists({ _id: uid }))) throw UserNotFound
		this.recording.directors = data.directors
	}
	// TODO `recording` `mixing` `mastering`
}

DocumentationSchema.methods.updateRelease = async function (data) {
	for (let field of ["date", "label", "format", "support"])
		if (field !== undefined) this.release[field] = data[field]
}

DocumentationSchema.methods.updateFiles = async function (data) {
	for (let field of ["audio", "scores", "midi"])
		if (field !== undefined) this.info[field] = data[field]
}

DocumentationSchema.methods.updateInfo = async function (data) {
	for (let field of ["length", "BPM", "influences"])
		if (field !== undefined) this.info[field] = data[field]

	// TODO `mainGenre` `secondaryGenres`
}

DocumentationSchema.methods.updateLyrics = async function (data) {
	for (let field of ["text", "languages", "access"])
		if (field !== undefined) this.lyrics[field] = data[field]
}

DocumentationSchema.methods.updateStreaming = async function (data) {
	if (Array.isArray(data.links)) this.streaming = data.links
}

module.exports = DocumentationSchema
