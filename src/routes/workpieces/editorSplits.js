const { EditorSplitNotFound } = require('../../errors')
const JWTAuth = require('../../service/JWTAuth')
const EditorSplit = require('../../models/editorSplit')
const { EditorSplitTemplates } = require('../../models/notificationTemplates')
const EditorSplitSchema = require('../../schemas/editorSplits')

async function routes(fastify, options) {
	fastify.route({
		method: 'POST',
		url: '/workpieces/:workpiece_id/editorSplits/',
		schema: EditorSplitSchema.create,
		preValidation: JWTAuth.requireAuthUser,
		handler: async function createEditorSplit(req, res) {
			// check authUser permission over the rightHolder's editorSplit in the future?
			if (req.authUser.id !== req.body.rightHolder_id) throw EditorSplitNotFound
			const editorSplit = new EditorSplit({ ...req.body, ...req.params })
			return await editorSplit.save()
		},
	})

	fastify.route({
		method: 'GET',
		url: '/workpieces/:workpiece_id/editorSplits/:rightHolder_id',
		schema: EditorSplitSchema.routes.getResource,
		preValidation: JWTAuth.requireAuthUser,
		handler: async function getEditorSplitsByRightHolder(req, res) {
			// check authUser permission over the rightHolder's editorSplit in the future?
			if (req.authUser.id !== req.params.rightHolder_id)
				throw EditorSplitNotFound
			res.status(201)
			return await EditorSplit.ensureExistsAndRetrieve(req.params)
		},
	})

	fastify.route({
		method: 'PATCH',
		url: '/workpieces/:workpiece_id/editorSplits/:rightHolder_id',
		schema: EditorSplitSchema.routes.patch,
		preValidation: JWTAuth.requireAuthUser,
		handler: async function patchEditorSplit(req, res) {
			// check authUser permission over the rightHolder's editorSplit in the future?
			if (req.authUser.id !== req.params.rightHolder_id)
				throw EditorSplitNotFound
			const editorSplit = await EditorSplit.ensureExistsAndRetrieve(req.params)
			editorSplit.patch(req.body)
			return await editorSplit.save()
		},
	})

	fastify.route({
		method: 'DELETE',
		url: '/workpieces/:workpiece_id/editorSplits/:rightHolder_id',
		schema: EditorSplitSchema.routes.remove,
		preValidation: JWTAuth.requireAuthUser,
		handler: async function deleteEditorSplit(req, res) {
			// check authUser permission over the rightHolder's editorSplit in the future?
			if (req.authUser.id !== req.params.rightHolder_id)
				throw EditorSplitNotFound
			const { deletedCount } = await EditorSplit.deleteOne(
				EditorSplit.translateAliases(req.params)
			)
			if (deletedCount !== 1) throw EditorSplitNotFound
			res.code(204).send()
		},
	})

	fastify.route({
		method: 'POST',
		url: '/workpieces/:workpiece_id/editorSplits/:rightHolder_id/submit',
		schema: EditorSplitSchema.routes.submit,
		preValidation: JWTAuth.requireAuthUser,
		handler: async function submit(req, res) {
			// check authUser permission over the rightHolder's editorSplit in the future?
			if (req.authUser.id !== req.params.rightHolder_id)
				throw EditorSplitNotFound
			const editorSplit = await EditorSplit.ensureExistsAndRetrieve(req.params)
			editorSplit._state = 'pending'
			await editorSplit.save()
			const email = req.body.email || editorSplit.editor.email
			editorSplit.editor.sendNotification(EditorSplitTemplates.CREATED, {
				to: { email, name: editor.fullName },
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
			editorSplit._state = req.body.vote
			return await editorSplit.save()
		},
	})
}

module.exports = routes
