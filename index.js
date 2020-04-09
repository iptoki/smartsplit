const express = require("express")
require("express-async-errors")
const Swagger = require("swagger-ui-express")

// Load configuration
const Config = require("./src/config")

// Connect database
require("mongoose").connect(
	process.env["MONGODB_PATH"] || Config.mongodb.uri,
	{ useNewUrlParser: true, useUnifiedTopology: true }
)

// Load up API
const api = require("./src/app").api

// Start up server
const app = express()
app.use(require("cors")({maxAge: 30*60}))
app.use(require("morgan")("short"))
app.use(express.json({strict: false}))
app.use(express.urlencoded({extended: false}))

app.use("/docs", Swagger.serve, Swagger.setup(api.oapi))
app.get("/spec", function(req, res) {
	res.type("text/plain").send(JSON.stringify(api.oapi, null, 4))
})

app.use("/v1", api.router)
app.use("/v1", function(req, res) {
	res.status(404).json({
		code: "INVALID_ENDPOINT",
		message: "Invalid Request: no handler at this path",
		path: req.baseUrl + req.path
	})
})

app.listen(Config.listen.port, Config.listen.host)

console.log("Server ready and listening")
console.log(`Swagger documentation => http://${Config.listen.host || "localhost"}:${Config.listen.port}/docs`)
