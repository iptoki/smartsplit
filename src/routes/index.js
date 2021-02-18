async function routes(fastify, options) {
	fastify.register(require("./auth"))
	fastify.register(require("./entities"))
	fastify.register(require("./users/routes"))
	fastify.register(require("./workpieces/routes"))
}

module.exports = routes
