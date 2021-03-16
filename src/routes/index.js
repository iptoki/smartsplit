async function routes(fastify, options) {
	fastify.register(require("./auth"))
	fastify.register(require("./entities"))
	fastify.register(require("./addresses"))
	fastify.register(require("./users/routes"))
	fastify.register(require("./workpieces/routes"))
	fastify.register(require("./payments/routes"))
}

module.exports = routes
