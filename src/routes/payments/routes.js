async function routes(fastify, options) {
	fastify.register(require("./address"))
}
module.exports = routes
