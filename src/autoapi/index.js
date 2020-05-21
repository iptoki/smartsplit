const express  = require("express")
const APIError = require("./error")
const JsonAPI  = require("./json")

/**
 * An OpenAPI specification and express router builder that combines the
 * documentation and implementation of endpoints and objects, allowing to
 * automatically document and validate data according to specification.
 */
class AutoAPI {
	/**
	 * Constructs the AutoAPI object, using an optional base OpenAPI specification
	 */
	constructor(oapiSpec) {
		// Clone the OpenAPI spec parts we'll be modifying
		const oapi = this.oapi = {...oapiSpec}
		this.paths = oapi.paths = {...oapi.paths}
		
		const defs = this.defs = oapi.components = {...oapi.components}
		defs.schemas         = {...defs.schemas}
		defs.responses       = {...defs.responses}
		defs.parameters      = {...defs.parameters}
		defs.examples        = {...defs.examples}
		defs.requestBodies   = {...defs.examples}
		defs.headers         = {...defs.headers}
		defs.securitySchemes = {...defs.securitySchemes}
		defs.links           = {...defs.links}
		defs.callbacks       = {...defs.callbacks}
		
		// Other internals
		this.hooks = {}
		this.router = express.Router()
	}
	
	/**
	 * Declares and document a route
	 */
	route(method, path, spec, ...handlers) {
		const { hooks, ...fltSpec } = spec
		
		if(path in this.paths === false)
			this.paths[path] = {}
		
		for(let hook in hooks)
			this.hooks[hook].call(this, fltSpec, hooks[hook])
		
		if(fltSpec.requestBody && fltSpec.requestBody.$body)
			fltSpec.requestBody = fltSpec.requestBody.$body
		
		for(let status in fltSpec.responses)
			if(fltSpec.responses[status].$response)
				fltSpec.responses[status] = fltSpec.responses[status].$response
		
		const operation = this.oapi.paths[path][method] = fltSpec
		
		this.router[method].call(this.router,
			path.replace(/\{([^}]+?)\}/g, ":$1"),
			JsonAPI.expressRequestHandler(pipeline(...handlers), fltSpec)
		)
	}
	
	/** Declares a GET endpoint */
	get(...args) {
		this.route("get", ...args)
	}
	
	/** Declares a POST endpoint */
	post(...args) {
		this.route("post", ...args)
	}
	
	/** Declares a PUT endpoint */
	put(...args) {
		this.route("put", ...args)
	}
	
	/** Declares a PATCH endpoint */
	patch(...args) {
		this.route("patch", ...args)
	}
	
	/** Declares a DELETE endpoint */
	delete(...args) {
		this.route("delete", ...args)
	}


	/**
	 * Adds a new component definition, returning a reference object.
	 * 
	 * The returned reference object has the supplied specification as a prototype,
	 * so it can be used with validators and serializers as-is to access the
	 * specification data without special cases while also avoiding duplication
	 * in the output OpenAPI specification.
	 */
	component(type, id, spec) {
		this.defs[type][id] = spec
		
		const ref = Object.create(spec, {
			$ref: {
				enumerable: true,
				value: "#/components/" + type + "/" + id
			},
			
			$spec: {
				enumerable: false,
				value: spec
			}
		})
		
		return ref
	}
	
	
	/**
	 * Adds a parameter component to the specification and returns its reference
	 * object.
	 * 
	 * Example:
	 *     // Will match a {user_id} parameter in the URL
	 *     const userIdParam = api.param("user_id")
	 *     api.get("/users/{user_id}", { parameters: [userIdParam] }, ...)
	 */
	param(id, spec) {
		return this.component("parameters", id, {
			in: "query",
			required: true,
			schema: {
				type: "string"
			},
			...spec
		})
	}

	
	/**
	 * Defines a new object schema and adds it to the OpenAPI specification.
	 */
	schema(id, spec) {
		const ref = this.component("schemas", id, {...spec})
		
		Object.defineProperties(ref, {
			$body: {
				enumerable: false,
				value: AutoAPI.body(ref)
			},
			
			$response: {
				enumerable: false,
				value: AutoAPI.response(ref)
			}
		})
		
		return ref
	}
	
	
	/**
	 * Creates a Schema Object based on a Mongoose Model
	 */
	static schemaFromModel(model, overrides = {}) {
		const spec = {
			type: "object",
			example: {},
			...overrides,
			properties: {...overrides.properties},
		}
		
		for(let key in model.schema.obj) {
			// Skip properties that have been overriden/already exist
			if(key in spec.properties)
				continue
			
			let apispec = model.schema.obj[key].api
			
			// If we don't have an API specification for this model field, skip
			if(!apispec)
				continue
			
			// If the Mongoose Model is an alias, add the aliasFrom so the
			// serializer can read the correct field
			if(model.schema.obj[key].alias) {
				Object.defineProperty(apispec, "aliasFrom", {
					enumerable: false,
					value: key
				})
				
				key = model.schema.obj[key].alias
			}
			
			spec.properties[key] = apispec
			
			if(apispec.example)
				spec.example[key] = apispec.example
		}
		
		return spec
	}
	
	/**
	 * Creates a new Schema Object from a Mongoose model and returns a reference
	 */
	schemaFromModel(id, model, overrides) {
		return this.schema(id, AutoAPI.schemaFromModel(model, overrides))
	}
	
	
	/**
	 * Builds a "Request Body" object with a Schema Object or reference
	 */
	static body(schema, overrides) {
		return {
			description: schema.description,
			required: true,
			content: {
				"application/x-www-form-urlencoded": {
					schema: schema
				},
				"multipart/form-data": {
					schema: schema
				},
				"application/json": {
					schema: schema
				}
			}
		}
	}
	
	/**
	 * Builds a "Request Body" reference object with a Schema Object or reference
	 */
	body(id, schema) {
		return this.component("requestBodies", id, AutoAPI.body(schema))
	}
	
	
	/**
	 * Builds a "Reponse Object" with a Schema Object or reference
	 */
	static response(schema) {
		return {
			description: schema.description,
			content: {
				"application/json": {
					schema: schema
				}
			}
		}
	}
	
	/**
	 * Builds a "Reponse Object" reference with a Schema Object or reference
	 */
	response(id, schema) {
		return this.component("responses", id, AutoAPI.response(schema))
	}
	
	
	/**
	 * Creates a new Security Scheme Object and return its reference
	 */
	securityScheme(id, spec) {
		return this.component("securitySchemes", id, spec)
	}
	
	
	/**
	 * Adds a hook function: hook functions are used with routes to add to or
	 * modify parts of the OpenAPI specification in routes.
	 * 
	 * For example: `aapi.get("/example", { hooks: { exampleHeaders: [1, 2] }})`
	 * 	will end up calling `fn(PathObject, [1, 2])`
	 * which can then modify the Path Object to add additional headers, parameters,
	 * responses, or any other transformations.
	 * 
	 * @param fn function(spec, value)
	 */
	hook(id, fn) {
		this.hooks[id] = fn
	}
	
	static Error = APIError
	
	
	/**
	 * Returns an Error type passing as a Schema Object to easily generate errors
	 * and their corresponding Response Object and Schema.
	 */
	static error(status, description, schema, defdata) {
		class AutoError extends AutoAPI.Error {
			constructor(data, ...args) {
				super(status, {
					...defdata,
					message:
					description,
					...data
				}, ...args)
			}
		}
		
		AutoError.$schema = {...schema, description}
		AutoError.$response = AutoAPI.response(AutoError.$schema)
		
		return AutoError
	}
	
	/**
	 * Creates an Error type passing as a Response Reference to generate Error
	 * classes with a corresponding Response Object and Schema
	 */
	error(id, status, description, schema, defdata) {
		const AutoError = AutoAPI.error(status, description, schema, defdata)
		AutoError.$response = this.response(id, AutoError.$schema)
		return AutoError
	}
}


/**
 * Creates a pipeline of functions, where the output of one goes to the
 * input of the next one
 */
function pipeline(...handlers) {
	return async function(...args) {
		let data = args
		const thisArg = {
			req: args[0],
			res: args[1]
		}
		for(let handler of handlers) {
			if(!Array.isArray(data))
				data = [data]
				
			data = await handler.apply(thisArg, data)
		}
		
		return data
	}
}

module.exports = AutoAPI
AutoAPI.AutoAPI = AutoAPI // For const { AutoAPI, schema } = require("autoapi")
AutoAPI.APIError = AutoAPI.Error = APIError
