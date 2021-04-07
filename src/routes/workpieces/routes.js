async function routes(fastify, options) {
	fastify.register(require('./workpieces').routes)
	fastify.register(require('./tasks'))
	fastify.register(require('./rightSplits'))
	fastify.register(require('./documentation'))
	fastify.register(require('./editorSplits'))
}

module.exports = routes
