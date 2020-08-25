const fastify = require('fastify')({ logger: false })

// Load configuration
const Config = require("./src/config")

// Connect database
require("mongoose").connect(process.env["MONGODB_PATH"] || Config.mongodb.uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})

// Register plugins
fastify.register(require('fastify-formbody'), {
	bodyLimit: Config.http.entityMaxSize,
})

fastify.register(require('fastify-cors'), { 
	maxAge: 30 * 60
})

fastify.register(require('fastify-swagger'), {
  routePrefix: '/docs',
  swagger: {
    info: {
      title: 'Smartsplit API',
      description: 'Swagger API for smartsplit project',
      version: '0.1.0'
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here'
    },
    host: 'localhost',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
  exposeRoute: true
})

// Register spec endpoint
fastify.get("/spec", function (req, res) {
	res.send(fastify.swagger())
})

// Register routes
//fastify.register(require("./src/endpoints/users/index"))
//fastify.register(require("./src/endpoints/auth"))
//fastify.register(require("./src/endpoints/lists"))
//fastify.register(require("./src/endpoints/rightHolders"))
//fastify.register(require("./src/endpoints/workpieces"))

// Start up server
fastify.listen(Config.listen.port, Config.listen.host, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})

console.log("Server ready and listening")
console.log(
	`Swagger documentation => http://${Config.listen.host || "localhost"}:${
		Config.listen.port
	}/docs`
)
