async function routes(fastify, options) {
	fastify.register(require("./tasks"))
	fastify.register(require("./workpieces").routes)
	fastify.register(require("./rightSplits"))
	fastify.register(require("./documentation"))
}

module.exports = routes
