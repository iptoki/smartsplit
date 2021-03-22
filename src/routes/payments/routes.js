async function routes(fastify, options) {
	fastify.register(require("./promos"))
	fastify.register(require("./products"))
	fastify.register(require("./purchases"))
}

module.exports = routes
