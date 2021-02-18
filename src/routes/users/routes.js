async function routes(fastify, options) {
	fastify.register(require("./users").routes)
	fastify.register(require("./emails"))
	fastify.register(require("./collaborators"))
}

module.exports = routes
