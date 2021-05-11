const CollaboratorSchema = require('./users').serialization.collaborator

const validation = {
	create: {
		type: 'object',
		required: ['rightHolder_id', 'editor_id', 'shares'],
		properties: {
			rightHolder_id: { type: 'string' },
			editor_id: { type: 'string' },
			shares: { type: 'integer', maximum: 50, minimum: 0 },
		},
		additionalProperties: false,
	},
	patch: {
		type: 'object',
		properties: {
			editor_id: { type: 'string' },
			shares: { type: 'integer', maximum: 50, minimum: 0 },
		},
		additionalProperties: false,
	},
	vote: {
		type: 'object',
		required: ['vote'],
		properties: {
			vote: { type: 'string', enum: ['accepted', 'rejected'] },
		},
		additionalProperties: false,
	},
	submit: {
		type: 'object',
		properties: {
			email: { type: 'string' },
		},
		additionalProperties: false,
	},
}

const serialization = {
	editorSplit: {
		type: 'object',
		properties: {
			rightHolder_id: { type: 'string' },
			editor_id: { type: 'string' },
			editor: { ...CollaboratorSchema, nullable: true },
			shares: { type: 'integer' },
			_state: {
				type: 'string',
				enum: ['draft', 'pending', 'accepted', 'rejected'],
			},
		},
		additionalProperties: false,
	},
}

const routes = {
	create: {
		tags: ['workpiece_editorSplit'],
		description: 'Create a new editorSplit',
		params: {
			workpiece_id: { type: 'string' },
		},
		body: validation.create,
		response: {
			201: serialization.editorSplit,
		},
		security: [{ bearerAuth: [] }],
	},
	getResource: {
		tags: ['workpiece_editorSplit'],
		description: "Get a rightHolder's editorSplit",
		params: {
			workpiece_id: { type: 'string' },
			rightHolder_id: { type: 'string' },
		},
		response: {
			200: serialization.editorSplit,
		},
		security: [{ bearerAuth: [] }],
	},
	patch: {
		tags: ['workpiece_editorSplit'],
		description: "Update a rightHolder's editorSplit",
		params: {
			workpiece_id: { type: 'string' },
			rightHolder_id: { type: 'string' },
		},
		body: validation.patch,
		response: {
			200: serialization.editorSplit,
		},
		security: [{ bearerAuth: [] }],
	},
	remove: {
		tags: ['workpiece_editorSplit'],
		description: "Delete a rightHolder's editorSplit",
		params: {
			workpiece_id: { type: 'string' },
			rightHolder_id: { type: 'string' },
		},
		response: {
			204: {},
		},
		security: [{ bearerAuth: [] }],
	},
	submit: {
		tags: ['workpiece_editorSplit'],
		description: "Submit a rightHolder's editorSplit to the editor",
		params: {
			workpiece_id: { type: 'string' },
			rightHolder_id: { type: 'string' },
		},
		body: validation.submit,
		response: {
			200: serialization.editorSplit,
		},
		security: [{ bearerAuth: [] }],
	},
	vote: {
		tags: ['workpiece_editorSplit'],
		description: "Vote a rightHolder's editorSplit",
		params: {
			workpiece_id: { type: 'string' },
			rightHolder_id: { type: 'string' },
		},
		body: validation.vote,
		response: {
			200: serialization.editorSplit,
		},
		security: [{ bearerAuth: [] }],
	},
}

module.exports = {
	serialization,
	validation,
	routes,
}
