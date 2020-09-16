async function routes(fastify, options) {
	fastify.register(require("./auth"))
	fastify.register(require("./lists"))
	fastify.register(require("./rightHolders"))
	//fastify.register(require("./users/index"))
	//fastify.register(require("./workpieces/index"))
}

module.exports = routes
