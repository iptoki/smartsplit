const fp = require("fastify-plugin")
const FJS = require("fast-json-stringify")

function plugin(fastify, opts, next) {
	fastify.decorateReply("schema", schema)
	fastify.decorateRequest("setTransactionResource", setTransactionResource)
	next()

	function schema(schema_object) {
		if (schema_object === undefined) {
			return this
		}
		this.type("application/json; charset=utf-8")
		return this.serializer(FJS(schema_object))
	}

	function setTransactionResource(resource) {
		if(!resource) return
		this.transaction.resource = resource
		this.transaction.resourceCollection = resource.constructor.modelName
	}
}

module.exports = fp(plugin)
