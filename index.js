// Load configuration
const Config = require("./src/config")
const JWTAuth = require("./src/service/JWTAuth")

const fastify = require("fastify")({ logger: Config.logger })

// Connect database
require("mongoose").connect(process.env["MONGODB_PATH"] || Config.mongodb.uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})

// Register plugins
fastify.register(require("fastify-formbody"), {
	bodyLimit: Config.http.entityMaxSize,
})

fastify.register(require("fastify-cors"), {
	maxAge: 30 * 60,
})

// Register swagger for auto documentation with OAS 3.0
fastify.register(require("fastify-oas"), require("./swagger-config"))

// Add Global Auth hook
fastify.addHook("preValidation", function (req, res, next) {
	JWTAuth.bearerTokenMiddleware(req, res)
	next()
})

// Register routes
fastify.register(require("./src/routes/index"), { prefix: "/v1" })

// Start up server
fastify.listen(Config.listen.port, Config.listen.host, function (err, address) {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
	console.log("Server ready and listening")
	console.log(
		`Swagger documentation => http://${Config.listen.host || "localhost"}:${
			Config.listen.port
		}/docs`
	)
})
