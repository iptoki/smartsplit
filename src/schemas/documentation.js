const UserSchema = require('./users')
const EntitySchema = require('./entities')
const EntityTypes = require('../constants/entityTypes')

const file = {
	type: 'object',
	properties: {
		file_id: {
			type: 'string',
		},
		filename: { type: 'string' },
		metadata: {
			type: 'object',
			properties: {
				encoding: { type: 'string' },
				mimetype: { type: 'string' },
				visibility: {
					type: 'string',
					enum: ['public', 'hidden', 'private'],
				},
				hashes: {
					type: 'object',
					properties: {
						md5: { type: 'string' },
						sha256: { type: 'string' },
					},
				},
				ethereum: {
					type: 'object',
					properties: {
						status: {
							type: 'string',
							default: 'NONE',
							enum: ['NONE', 'PROCESSING', 'PROCESSED', 'ERROR'],
						},
						transactionId: { type: 'string' },
						error: { type: 'string' },
					},
				},
			},
			additionalProperties: false,
		},
		uploadDate: {
			type: 'string',
			format: 'date-time',
		},
		size: { type: 'number' },
		url: { type: 'string' },
	},
	additionalProperties: false,
}

const performerTool = {
	type: 'object',
	properties: {
		instrument: EntitySchema.serialization.instrument,
		role: { type: 'string' },
		notes: { type: 'string' },
	},
	additionalProperties: false,
}

const performer = {
	type: 'object',
	properties: {
		user: UserSchema.serialization.collaborator,
		type: {
			type: 'string',
			enum: ['mainArtist', 'featured', 'groupMember', 'session'],
		},
		isSinger: { type: 'boolean' },
		isMusician: { type: 'boolean' },
		instruments: {
			type: 'array',
			items: performerTool,
		},
	},
	additionalProperties: false,
}

const record = {
	type: 'object',
	properties: {
		studio: { type: 'string' },
		engineers: {
			type: 'array',
			items: UserSchema.serialization.collaborator,
		},
		date: {
			type: 'object',
			properties: {
				from: {
					type: 'string',
					format: 'date',
				},
				to: {
					type: 'string',
					format: 'date',
				},
			},
			additionalProperties: false,
		},
		notes: {
			type: 'array',
			items: { type: 'string' },
		},
	},
	additionalProperties: false,
}

const creation = {
	type: 'object',
	properties: {
		date: { type: 'string' },
		authors: {
			type: 'array',
			items: UserSchema.serialization.collaborator,
		},
		composers: {
			type: 'array',
			items: UserSchema.serialization.collaborator,
		},
		publishers: {
			type: 'array',
			items: UserSchema.serialization.collaborator,
		},
		iswc: { type: 'string' },
	},
	additionalProperties: false,
}

const performance = {
	type: 'object',
	properties: {
		conductor: UserSchema.serialization.collaborator,
		performers: {
			type: 'array',
			items: performer,
		},
	},
	additionalProperties: false,
}

const recording = {
	type: 'object',
	properties: {
		directors: {
			type: 'array',
			items: UserSchema.serialization.collaborator,
		},
		producers: {
			type: 'array',
			items: UserSchema.serialization.collaborator,
		},
		isrc: { type: 'string' },
		recording: {
			type: 'array',
			items: record,
		},
		mixing: {
			type: 'array',
			items: record,
		},
		mastering: {
			type: 'array',
			items: record,
		},
	},
	additionalProperties: false,
}

const release = {
	type: 'object',
	properties: {
		date: { type: 'string' },
		label: { type: 'string' },
		format: { type: 'string' },
		support: { type: 'string' },
		distributor: { type: 'string' },
		upc: { type: 'string' },
	},
	additionalProperties: false,
}

const files = {
	type: 'object',
	properties: {
		art: {
			type: 'array',
			items: file,
		},
		audio: {
			type: 'array',
			items: file,
		},
		scores: {
			type: 'array',
			items: file,
		},
		midi: {
			type: 'array',
			items: file,
		},
		lyrics: {
			type: 'array',
			items: file,
		},
	},
	additionalProperties: false,
}

const info = {
	type: 'object',
	properties: {
		length: { type: 'string' },
		BPM: { type: 'number' },
		mainGenre: EntitySchema.serialization[EntityTypes.MUSICAL_GENRE],
		secondaryGenres: {
			type: 'array',
			items: EntitySchema.serialization[EntityTypes.MUSICAL_GENRE],
		},
		influences: {
			type: 'array',
			items: { type: 'string' },
		},
	},
	additionalProperties: false,
}

const lyrics = {
	type: 'object',
	properties: {
		text: { type: 'string' },
		languages: {
			type: 'array',
			items: { type: 'string' },
		},
		access: {
			type: 'string',
			enum: ['public', 'private', 'limited'],
			default: 'private',
		},
	},
	additionalProperties: false,
}

const streaming = {
	type: 'object',
	properties: {
		links: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					platform: { type: 'string' },
					url: { type: 'string' },
				},
				additionalProperties: false,
			},
		},
	},
	additionalProperties: false,
}

const documentation = {
	type: 'object',
	properties: {
		creation,
		performance,
		recording,
		release,
		files,
		info,
		lyrics,
		streaming,
	},
	additionalProperties: false,
}

const updateDocumentation = {
	type: 'object',
	properties: {
		creation: {
			type: 'object',
			properties: {
				...creation.properties,
				authors: {
					type: 'array',
					items: { type: 'string' },
				},
				composers: {
					type: 'array',
					items: { type: 'string' },
				},
				publishers: {
					type: 'array',
					items: { type: 'string' },
				},
			},
			additionalProperties: false,
		},
		performance: {
			type: 'object',
			properties: {
				...performance.properties,
				conductor: { type: 'string' },
				performers: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							...performer.properties,
							user: { type: 'string' },
							instruments: {
								type: 'object',
								properties: {
									...performerTool.properties,
									instrument: { type: 'string' },
								},
								additionalProperties: false,
							},
						},
						additionalProperties: false,
					},
				},
			},
			additionalProperties: false,
		},
		recording: {
			type: 'object',
			properties: {
				...recording.properties,
				directors: {
					type: 'array',
					items: { type: 'string' },
				},
				producers: {
					type: 'array',
					items: { type: 'string' },
				},
				recording: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							...record.properties,
							engineers: {
								type: 'array',
								items: { type: 'string' },
							},
						},
						additionalProperties: false,
					},
				},
				mixing: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							...record.properties,
							engineers: {
								type: 'array',
								items: { type: 'string' },
							},
						},
						additionalProperties: false,
					},
				},
				mastering: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							...record.properties,
							engineers: {
								type: 'array',
								items: { type: 'string' },
							},
						},
						additionalProperties: false,
					},
				},
			},
			additionalProperties: false,
		},
		info: {
			type: 'object',
			properties: {
				...info.properties,
				mainGenre: { type: 'string' },
				secondaryGenres: {
					type: 'array',
					items: { type: 'string' },
				},
			},
			additionalProperties: false,
		},
		release,
		lyrics,
		streaming,
	},
	additionalProperties: false,
}

const updateFile = {
	type: 'object',
	properties: {
		filename: { type: 'string' },
		visibility: {
			type: 'string',
			enum: ['public', 'hidden', 'private'],
		},
		type: {
			type: 'string',
			enum: ['art', 'audio', 'scores', 'midi', 'lyrics'],
		},
	},
	additionalProperties: false,
}

module.exports = {
	serialization: {
		documentation,
		file,
	},
	validation: {
		updateDocumentation,
		updateFile,
	},
}
