const AutoAPI = require("./autoapi")
const initialSpec = require("../openapi")
const JWTAuth = require("./service/JWTAuth")

// Initialize the API generator
const api = new AutoAPI(initialSpec)
api.router.use(JWTAuth.expressMiddleware)

// Define `accessToken` authentication in Swagger
api.securityScheme("accessToken", {
	type: "http",
	description: "Authentication by a JWT Access Token obtained from the API",
	scheme: "bearer",
	bearerFormat: "jwt"
})


/**
 * Basic error schema for generic errors
 */
const errorSchema = api.schema("error", {
	type: "object",
	properties: {
		code: {
			type: "string",
			summary: "A string code constant that can be used to uniquely identify the cause of the error to the client",
			example: "EXAMPLE:GENERIC_FAILURE"
		},
		
		message: {
			type: "string",
			summary: "A human readable error message describing the error",
			example: "Something went wrong and the request could not be processed."
		}
	}
})


/**
 * Returns an error Response Object for a generic error with the supplied description
 */
function error(id, status, description, schema, defdata) {
	const args = [
		status,
		description,
		schema || errorSchema,
		{ code: id, ...defdata }
	]
	
	if(id)
		return api.error(id, ...args)
	else
		return AutoAPI.error(...args)
}


/**
 * Builds a generic error response with the description string
 */
function errorResponse(description) {
	const schema = Object.create(errorSchema)
	schema.description = description
	return AutoAPI.response(schema)
}
		

/**
 * Error class for Invalid
 */
const InvalidAccessTokenError =
	AutoAPI.error(401, "This endpoint requires a valid Access Token", errorSchema)


/**
 * Hook to simplify adding basic authentication to APIs, with the corresponding
 * error responses (if enabled).
 */
api.hook("auth", function(spec, addResponse) {
	if(!spec.responses)
		spec.responses = {}
	
	if(!spec.security)
		spec.security = []
	
	if(addResponse !== false)
		spec.responses[401] = InvalidAccessTokenError
	
	spec.security.push({accessToken: true})
})

// Export everything that will be needed by endpoints and schemas
module.exports = {
	api,
	error,
	errorResponse,
	InvalidAccessTokenError,
	APIError: AutoAPI.Error
}

// Load up the endpoints
require("./endpoints/auth")
require("./endpoints/users")

// Generic error handler
api.router.use(function(err, req, res, next) {
	if(!err)
		next("route")
	
	res.status(500).json(err.json || {
		code: "INTERNAL_ERROR",
		message: "An internal error has occured and a response couldn't be generated."
	})
	
	console.error("Uncaught API Error", err)
})
