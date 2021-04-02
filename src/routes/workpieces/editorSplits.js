const { EditorSplitNotFound } = require('../../errors')
const JWTAuth = require('../../service/JWTAuth')
const EditorSplit = require('../../models/editorSplit')
const { EditorSplitTemplates } = require('../../model/notificationTemplates')
const EditorSplitSchema = require('../../schemas/editorSplits')

/************************ Routes ************************/

async function routes(fastify, options) {
	fastify.route({
		method: 'POST',
		url: '/workpieces/:workpiece_id/editorSplits/',
		schema: {
			tags: ['workpiece_editorSplit'],
			description: 'Create a new editorSplit',
			params: {
				workpiece_id: { type: 'string' },
			},
			body: EditorSplitSchema.validation.createEditorSplit,
			response: {
				201: EditorSplitSchema.serialization.editorSplit,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: createEditorSplit,
	})

	fastify.route({
		method: 'GET',
		url: '/workpieces/:workpiece_id/editorSplits/:rightHolder_id',
		schema: {
			tags: ['workpiece_editorSplit'],
			description: "Get a rightHolder's editorSplit",
			params: {
				workpiece_id: { type: 'string' },
				rightHolder_id: { type: 'string' },
			},
			response: {
				200: EditorSplitSchema.serialization.editorSplit,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: getEditorSplitsByRightHolder,
	})

	fastify.route({
		method: 'PATCH',
		url: '/workpieces/:workpiece_id/editorSplits/:rightHolder_id',
		schema: {
			tags: ['workpiece_editorSplit'],
			description: "Update a rightHolder's editorSplit",
			params: {
				workpiece_id: { type: 'string' },
				rightHolder_id: { type: 'string' },
			},
			body: EditorSplitSchema.validation.patchEditorSplit,
			response: {
				200: EditorSplitSchema.serialization.editorSplit,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: patchEditorSplit,
	})

	fastify.route({
		method: 'DELETE',
		url: '/workpieces/:workpiece_id/editorSplits/:rightHolder_id',
		schema: {
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
		preValidation: JWTAuth.requireAuthUser,
		handler: deleteEditorSplit,
	})

	fastify.route({
		method: 'POST',
		url: '/workpieces/:workpiece_id/editorSplits/:rightHolder_id/submit',
		schema: {
			tags: ['workpiece_editorSplit'],
			description: "Submit a rightHolder's editorSplit to the editor",
			params: {
				workpiece_id: { type: 'string' },
				rightHolder_id: { type: 'string' },
			},
			body: EditorSplitSchema.validation.submit,
			response: {
				200: EditorSplitSchema.serialization.editorSplit,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: submit,
	})

	fastify.route({
		method: 'POST',
		url: '/workpieces/:workpiece_id/editorSplits/:rightHolder_id/vote',
		schema: {
			tags: ['workpiece_editorSplit'],
			description: "Vote a rightHolder's editorSplit",
			params: {
				workpiece_id: { type: 'string' },
				rightHolder_id: { type: 'string' },
			},
			body: EditorSplitSchema.validation.vote,
			response: {
				200: EditorSplitSchema.serialization.editorSplit,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: vote,
	})
}

/************************ Handlers ************************/

async function createEditorSplit(req, res) {
	// check authUser permission over the rightHolder's editorSplit in the future?
	if (req.authUser.id !== req.body.rightHolder_id) throw EditorSplitNotFound
	const editorSplit = new EditorSplit({ ...req.body, ...req.params })
	return await editorSplit.save()
}

async function getEditorSplitsByRightHolder(req, res) {
	// check authUser permission over the rightHolder's editorSplit in the future?
	if (req.authUser.id !== req.params.rightHolder_id) throw EditorSplitNotFound
	res.status(201)
	return await EditorSplit.ensureExistsAndRetrieve(req.params)
}

async function patchEditorSplit(req, res) {
	// check authUser permission over the rightHolder's editorSplit in the future?
	if (req.authUser.id !== req.params.rightHolder_id) throw EditorSplitNotFound
	const editorSplit = await EditorSplit.ensureExistsAndRetrieve(req.params)
	editorSplit.patch(req.body)
	return await editorSplit.save()
}

async function deleteEditorSplit(req, res) {
	// check authUser permission over the rightHolder's editorSplit in the future?
	if (req.authUser.id !== req.params.rightHolder_id) throw EditorSplitNotFound
	const { deletedCount } = await EditorSplit.deleteOne(
		EditorSplit.translateAliases(req.params)
	)
	if (deletedCount !== 1) throw EditorSplitNotFound
	res.code(204).send()
}

async function submit(req, res) {
	// check authUser permission over the rightHolder's editorSplit in the future?
	if (req.authUser.id !== req.params.rightHolder_id) throw EditorSplitNotFound
	const editorSplit = await EditorSplit.ensureExistsAndRetrieve(req.params)
	editorSplit._state = 'pending'
	await editorSplit.save()
	const email = req.body.email || editorSplit.editor.email
	editorSplit.editor.sendNotification(EditorSplitTemplates.CREATED, {
		to: { email, name: editor.fullName },
	})
	return editorSplit
}

async function vote(req, res) {
	const editorSplit = await EditorSplit.ensureExistsAndRetrieve({
		...req.params,
		editor_id: req.authUser.id,
	})
	editorSplit._state = req.body.vote
	return await editorSplit.save()
}

module.exports = routes
