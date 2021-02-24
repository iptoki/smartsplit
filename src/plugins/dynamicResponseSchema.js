const fp = require("fastify-plugin")
const FJS = require("fast-json-stringify")

function plugin(fastify, opts, next) {
	fastify.decorateReply("schema", schema)
	next()

	function schema(schema_object) {
		if (schema_object === undefined) {
			return this
		}
		this.type("application/json; charset=utf-8")
		return this.serializer(FJS(schema_object))
	}
}

module.exports = fp(plugin)
