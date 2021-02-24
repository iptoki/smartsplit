async function routes(fastify, options) {
	fastify.register(require("./address"))
	fastify.register(require("./promoCode"))
	fastify.register(require("./product"))
}
module.exports = routes
