// Load configuration
const Config = require("./src/config")
const JWTAuth = require("./src/service/JWTAuth")

const fastify = require("fastify")({
	logger: Config.logger,
	ajv: {
		customOptions: {
			removeAdditional: false, // remove additional properties
			useDefaults: true, // replace missing properties and items with the values from corresponding default keyword
			coerceTypes: true, // change data type of data to match type keyword
			nullable: true, // support keyword "nullable" from Open API 3 specification.
		},
		// plugins: [
		// 	require("ajv-merge-patch")[(require("ajv-keywords"), "instanceof")],
		// ],
	},
})

// Connect database
const mongoose = require("mongoose")
mongoose
	.connect(process.env["MONGODB_PATH"] || Config.mongodb.uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		Object.defineProperty(mongoose, "bucket", {
			value: {
				protectedWork: new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
					bucketName: "protectedWork",
				}),
			},
		})
	})

// Register plugins
fastify.register(require("fastify-formbody"), {
	bodyLimit: Config.http.entityMaxSize,
})

// Register CORS middlewares
fastify.register(require("fastify-cors"), {
	maxAge: 30 * 60,
})

// Register multipart support plugin
fastify.register(require("fastify-multipart"), {
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
fastify.register(require("fastify-oas"), require("./swagger-config"))

// Add Global Auth hook
fastify.addHook("preValidation", function (req, res, next) {
	JWTAuth.bearerTokenMiddleware(req, res)
	next()
})

// Register routes
fastify.register(require("./src/routes/index"), { prefix: "/v1" })

// Register custom plugins
fastify.register(require("./src/plugins/dynamic-response-schema"))

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
