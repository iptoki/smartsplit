// Load configuration
const Config = require('./src/config')
const fastify = require('fastify')({ logger: Config.logger })
const Errors = require('./src/errors')

// Load mongoose ODM
const mongoose = require('./src/service/mongoose')

// Register plugins
fastify.register(require('fastify-formbody'), {
	bodyLimit: Config.http.entityMaxSize,
})

// Register CORS middlewares
fastify.register(require('fastify-cors'), {
	maxAge: 30 * 60,
})

// Register multipart support plugin
fastify.register(require('fastify-multipart'), {
	limits: {
		// fieldNameSize: int, // Max field name size in bytes
		// fieldSize: int,     // Max field value size in bytes
		// fields: int,        // Max number of non-file fields
		fileSize: 512000000, // Max file size
		files: 1, // Max number of file fields
		// headerPairs: int    // Max number of header key=>value pairs
	},
})

// Register swagger for auto documentation with OAS 3.0
fastify.register(require('fastify-oas'), require('./swagger-config'))

// Register custom plugins
fastify.register(require('./src/plugins/decorators'))

// Add Global Auth hook
fastify.addHook('preValidation', function (req, res, next) {
	require('./src/service/JWTAuth').bearerTokenMiddleware(req, res)
	next()
})

const TransactionHooks = require('./src/service/dbTransactionHook')

// Add Global transaction recorder hook
fastify.addHook('onRequest', TransactionHooks.onRequest)
fastify.addHook('preHandler', TransactionHooks.preHandler)
fastify.addHook('onResponse', TransactionHooks.onResponse)
fastify.addHook('onError', TransactionHooks.onError)

// Register routes
fastify.register(require('./src/routes/index'), { prefix: '/v1' })

// Start up server
fastify.listen(Config.listen.port, Config.listen.host, function (err, address) {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
	console.log('Server ready and listening')
	console.log(
		`Swagger documentation => http://${Config.listen.host || 'localhost'}:${
			Config.listen.port
		}/docs`
	)
})
