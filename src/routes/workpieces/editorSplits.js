const { EditorSplitNotFound, ConflictingEditorSplit } = require('../../errors')
const JWTAuth = require('../../service/JWTAuth')
const EditorSplit = require('../../models/editorSplit')
const { EditorSplitTemplates } = require('../../models/notificationTemplates')
const EditorSplitSchema = require('../../schemas/editorSplits')

async function permissionHook(req, res) {
	await JWTAuth.requireAuthUser(req, res)
	// check authUser permission over the rightHolder's editorSplit in the future?
	if (
		req.authUser.id !== (req.params.rightHolder_id || req.body.rightHolder_id)
	)
		throw EditorSplitNotFound
}

async function routes(fastify, options) {
	fastify.route({
		method: 'POST',
		url: '/workpieces/:workpiece_id/editorSplits/',
		schema: EditorSplitSchema.routes.create,
		preValidation: permissionHook,
		handler: async function createEditorSplit(req, res) {
			res.code(201)
			if (
				await EditorSplit.exists({
					workpiece_id: req.params.workpiece_id,
					rightHolder_id: req.body.rightHolder_id,
				})
			)
				throw ConflictingEditorSplit
			const editorSplit = EditorSplit.create({ ...req.body, ...req.params })
			return await editorSplit.save()
		},
	})

	fastify.route({
		method: 'GET',
		url: '/workpieces/:workpiece_id/editorSplits/:rightHolder_id',
		schema: EditorSplitSchema.routes.getResource,
		preValidation: permissionHook,
		handler: async function getEditorSplitsByRightHolder(req, res) {
			return await EditorSplit.ensureExistsAndRetrieve(req.params)
		},
	})

	fastify.route({
		method: 'PATCH',
		url: '/workpieces/:workpiece_id/editorSplits/:rightHolder_id',
		schema: EditorSplitSchema.routes.patch,
		preValidation: permissionHook,
		handler: async function patchEditorSplit(req, res) {
			const editorSplit = await EditorSplit.ensureExistsAndRetrieve(req.params)
			editorSplit.update(req.body)
			return await editorSplit.save()
		},
	})

	fastify.route({
		method: 'DELETE',
		url: '/workpieces/:workpiece_id/editorSplits/:rightHolder_id',
		schema: EditorSplitSchema.routes.remove,
		preValidation: permissionHook,
		handler: async function deleteEditorSplit(req, res) {
			const editorSplit = await EditorSplit.ensureExistsAndRetrieve(req.params)
			await editorSplit.remove()
			res.code(204).send()
		},
	})

	fastify.route({
		method: 'POST',
		url: '/workpieces/:workpiece_id/editorSplits/:rightHolder_id/submit',
		schema: EditorSplitSchema.routes.submit,
		preValidation: permissionHook,
		handler: async function submit(req, res) {
			const editorSplit = await EditorSplit.ensureExistsAndRetrieve(req.params)
			editorSplit.update({ _state: 'pending' })
			await editorSplit.save()
			const email = req.body.email || editorSplit.editor.email
			editorSplit.editor.sendNotification(EditorSplitTemplates.CREATED, {
				to: { email, name: editorSplit.editor.fullName },
			})
			return editorSplit
		},
	})

	fastify.route({
		method: 'POST',
		url: '/workpieces/:workpiece_id/editorSplits/:rightHolder_id/vote',
		schema: EditorSplitSchema.routes.vote,
		preValidation: JWTAuth.requireAuthUser,
		handler: async function vote(req, res) {
			const editorSplit = await EditorSplit.ensureExistsAndRetrieve({
				...req.params,
				editor_id: req.authUser.id,
			})
			editorSplit.update({ _state: req.body.vote })
			return await editorSplit.save()
		},
	})
}

module.exports = routes
