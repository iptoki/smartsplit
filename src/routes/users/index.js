async function routes(fastify, options) {
	fastify.register(require("./users").routes)
	fastify.register(require("./emails"))
	fastify.register(require("./collaborators"))
	fastify.register(require("./contributors"))
}

module.exports = routes
