const mongoose = require('mongoose')
const uuid = require('uuid').v4
const User = require('./user')
const Instrument = require('./entities/instrument')
const MusicalGenre = require('./entities/musicalGenre')
const EntityTypes = require('../constants/entityTypes')
const Config = require('../config')
const Errors = require('../errors')

// const ExternalFileSchema = new mongoose.Schema(
// 	{
// 		url: String,
// 		public: Boolean,
// 	},
// 	{ _id: false }
// )

const FileSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			alias: 'file_id',
		},
		length: {
			type: Number,
			alias: 'size',
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
					enum: ['public', 'hidden', 'private'],
				},
				version: {
					type: String,
					enum: ['idea', 'demo', 'rough-mix', 'master'],
				},
			},
			{ _id: false }
		),
	},
	{ strict: false, toJSON: { virtuals: true } }
)

const GFSFile = new mongoose.model('GFSFile', FileSchema, 'protectedWork.files')

const RecordSchema = new mongoose.Schema(
	{
		studio: String,
		engineers: [
			{
				type: String,
				ref: 'User',
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
			ref: EntityTypes.INSTRUMENT,
		},
		role: String,
		notes: String,
	},
	{ _id: false }
)

const PerformerSchema = new mongoose.Schema(
	{
		user: {
			type: String,
			ref: 'User',
		},
		type: {
			type: String,
			enum: ['mainArtist', 'featured', 'groupMember', 'session'],
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
				ref: 'User',
			},
		],
		composers: [
			{
				type: String,
				ref: 'User',
			},
		],
		publishers: [
			{
				type: String,
				ref: 'User',
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
			ref: 'User',
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
				ref: 'User',
			},
		],
		producers: [
			{
				type: String,
				ref: 'User',
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
		distributor: String,
		upc: String,
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
		audio: [
			{
				type: String,
				ref: GFSFile,
			},
		],
		scores: [
			{
				type: String,
				ref: GFSFile,
			},
		],
		midi: [
			{
				type: String,
				ref: GFSFile,
			},
		],
		lyrics: [
			{
				type: String,
				ref: GFSFile,
			},
		],
	},
	{ _id: false }
)

const InfoSchema = new mongoose.Schema(
	{
		length: String,
		BPM: Number,
		mainGenre: {
			type: String,
			ref: EntityTypes.MUSICAL_GENRE,
		},
		secondaryGenres: [
			{
				type: String,
				ref: EntityTypes.MUSICAL_GENRE,
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
			enum: ['public', 'private', 'limited'],
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
		streaming: {
			type: StreamingSchema,
			default: {},
		},
	},
	{ _id: false }
)

FileSchema.virtual('url').get(function () {
	return `${
		Config.apiUrl
	}/workpieces/${this.parent().id}/documentation/files/${this._id}`
})

DocumentationSchema.methods.getFileStream = function (file_id) {
	return mongoose.bucket.protectedWork.openDownloadStream(file_id)
}

DocumentationSchema.methods.getFile = async function (file_id) {
	return await GFSFile.findById(file_id)
}

DocumentationSchema.methods.addFile = async function (type, data) {
	const file_id = uuid()
	let visibility = 'private'
	if (data.fields !== undefined && data.fields.visibility !== undefined)
		visibility = data.fields.visibility.value
	const options = {
		metadata: {
			encoding: data.encoding,
			mimetype: data.mimetype,
			visibility: visibility,
		},
	}
	data.file.pipe(
		mongoose.bucket.protectedWork.openUploadStreamWithId(
			file_id,
			data.filename,
			options
		)
	)
	let file = null
	while (!file) {
		await new Promise((r) => setTimeout(r, 500))
		file = await this.getFile(file_id)
	}
	const length = this.files[type].push(file_id)
	return this.files[type][length - 1]
}

DocumentationSchema.methods.deleteFile = async function (file_id) {
	for (const type of ['art', 'audio', 'scores', 'midi', 'lyrics'])
		this.files[type] = this.files[type].filter((id) => id !== file_id)
	await mongoose.bucket.protectedWork.delete(file_id)
}

DocumentationSchema.methods.update = async function (data) {
	await Promise.all([
		this.updateCreation(data.creation || {}),
		this.updatePerformance(data.performance || {}),
		this.updateRecording(data.recording || {}),
		this.updateRelease(data.release || {}),
		this.updateInfo(data.info || {}),
		this.updateLyrics(data.lyrics || {}),
		this.updateStreaming(data.streaming || {}),
	])
}

DocumentationSchema.methods.updateCreation = async function (data) {
	for (const field of ['date', 'iswc', 'authors', 'composers', 'publishers'])
		if (data[field] !== undefined) this.creation[field] = data[field]

	let promises = []
	for (field of ['authors', 'composers', 'publishers']) {
		if (!Array.isArray(data[field])) continue
		for (const uid of data[field])
			promises.push(User.ensureExistsAndRetrieve(uid))
	}
	return Promise.all(promises)
}

DocumentationSchema.methods.updatePerformance = function (data) {
	for (const field of ['conductor', 'performers'])
		if (data[field] !== undefined) this.performance[field] = data[field]

	let promises = []
	if (Array.isArray(data.performers)) {
		for (const performer of data.performers) {
			promises.push(User.ensureExistsAndRetrieve(performer.user))
			for (field of ['instruments', 'vocals']) {
				if (!Array.isArray(performer[field])) continue
				for (const obj of performer[field])
					promises.push(Instrument.ensureExistsAndRetrieve(obj.instrument))
			}
		}
	}

	return Promise.all(promises)
}

DocumentationSchema.methods.updateRecording = function (data) {
	for (const field of [
		'directors',
		'producers',
		'recording',
		'mixing',
		'mastering',
		'isrc',
	]) {
		if (data[field] !== undefined) this.recording[field] = data[field]
	}

	let promises = []
	for (const field of ['directors', 'producers']) {
		if (!Array.isArray(data[field])) continue
		for (const uid of data[field])
			promises.push(User.ensureExistsAndRetrieve(uid))
	}
	for (const field of ['recording', 'mixing', 'mastering']) {
		if (!Array.isArray(data[field])) continue
		for (const obj of data[field]) {
			if (!Array.isArray(obj.engineers)) continue
			for (const uid of obj.engineers)
				promises.push(User.ensureExistsAndRetrieve(uid))
		}
	}

	return Promise.all(promises)
}

DocumentationSchema.methods.updateRelease = function (data) {
	for (const field of [
		'date',
		'label',
		'format',
		'support',
		'distributor',
		'upc',
	])
		if (data[field] !== undefined) this.release[field] = data[field]
}

DocumentationSchema.methods.updateInfo = function (data) {
	for (const field of [
		'length',
		'BPM',
		'influences',
		'mainGenre',
		'secondaryGenres',
	])
		if (data[field] !== undefined) this.info[field] = data[field]

	let promises = []
	if (data.mainGenre !== undefined)
		promises.push(MusicalGenre.ensureExistsAndRetrieve(data.mainGenre))
	if (Array.isArray(data.secondaryGenres)) {
		for (const genre of data.secondaryGenres)
			promises.push(MusicalGenre.ensureExistsAndRetrieve(genre))
	}

	return Promise.all(promises)
}

DocumentationSchema.methods.updateLyrics = function (data) {
	for (const field of ['text', 'languages', 'access'])
		if (data[field] !== undefined) this.lyrics[field] = data[field]
}

DocumentationSchema.methods.updateStreaming = function (data) {
	if (Array.isArray(data.links)) this.streaming.links = data.links
}

DocumentationSchema.methods.getPathsToPopulate = function () {
	return [
		...this.getFilesPathsToPopulate(),
		...this.getCreationPathsToPopulate(),
		...this.getPerformancePathsToPopulate(),
		...this.getRecordingPathsToPopulate(),
		...this.getInfoPathsToPopulate(),
	]
}

DocumentationSchema.methods.getFilesPathsToPopulate = function () {
	return [
		'documentation.files.art',
		'documentation.files.audio',
		'documentation.files.scores',
		'documentation.files.midi',
		'documentation.files.lyrics',
	]
}

DocumentationSchema.methods.getCreationPathsToPopulate = function () {
	return [
		'documentation.creation.authors',
		'documentation.creation.composers',
		'documentation.creation.publishers',
	]
}

DocumentationSchema.methods.getPerformancePathsToPopulate = function () {
	let paths = ['documentation.performance.conductor']
	const doc = this.performance.performers
	const path = 'documentation.performance.performers'
	for (let i = 0; i < doc.length; i++) {
		this.populate(`${path}.${i}.user`).execPopulate()
		for (let field of ['instruments', 'vocals']) {
			for (let j = 0; j < doc[i][field].length; j++) {
				paths.push(`${path}.${i}.${field}.${j}.instrument`)
				// paths.push(`${path}.${i}.${field}.${j}.role`)
			}
		}
	}
	return paths
}

DocumentationSchema.methods.getRecordingPathsToPopulate = function () {
	let paths = [
		'documentation.recording.directors',
		'documentation.recording.producers',
	]
	for (let field of ['recording', 'mixing', 'mastering']) {
		for (let i = 0; i < this.recording[field].length; i++)
			paths.push(`documentation.recording.${field}.${i}.engineers`)
	}
	return paths
}

DocumentationSchema.methods.getInfoPathsToPopulate = function () {
	return ['documentation.info.mainGenre', 'documentation.info.secondaryGenres']
}

module.exports = DocumentationSchema
