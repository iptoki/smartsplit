async function routes(fastify, options) {
	fastify.register(require("./promoCodes"))
	fastify.register(require("./products"))
	fastify.register(require("./purchases"))
}

module.exports = routes
