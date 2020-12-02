async function routes(fastify, options) {
	fastify.register(require("./auth"))
	fastify.register(require("./lists"))
	fastify.register(require("./rightHolders"))
	fastify.register(require("./users/routes"))
	fastify.register(require("./workpieces/routes"))
}

module.exports = routes
