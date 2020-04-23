/**
 * Generates an expressjs request handler, adding body validation and output
 * filtering based on the provided Path Object specification
 */
function expressRequestHandler(handler, spec) {
	return async function(req, res, ...args) {
		let result
		
		try {
			validate(req.body, spec)
			result = await handler(req, res, ...args)
			
			if(result === undefined || result === res)
				return
		}
		catch(error) {
			res.status(error.httpStatus || 500)
			
			if(error.json)
				result = error.json
			else
				result = {error: error.message}
			
			if(error.log !== false)
				console[error.log || "error"].call(console, error)
		}
		
		let responseSchema = getResponseSchema(spec, res.statusCode)
			
		if(responseSchema)
			result = filter(result, responseSchema)
		
		res.json(result)
	}
}

/**
 * Finds and returns the Content Object macthing the returned status code from
 * the Response Object
 */
function getResponseSchema(spec, status) {
	return (spec.responses
	     && spec.responses[status]
	     && spec.responses[status].content
	     && spec.responses[status].content["application/json"]
	     && spec.responses[status].content["application/json"].schema
	)
}


/**
 * Validates a body against a Schema specification
 */
function validate(body, spec) {
	// TODO
}


/**
 * Filters outgoing data to the provided Schema Object specification
 */
function filter(data, schema) {
	return Filters[schema.type] ? Filters[schema.type](data, schema) : data
}

/**
 * Maps Schema Types to a filtering functions (data, schema) => value
 */
const Filters = {}

/**
 * Filters all of an object's properties according to the properties specification
 */
Filters.object = function(data, schema) {
	// If no properties specified, it's a free-form object
	if(!schema.properties)
		return data
	
	const output = {}
	
	for(let key in schema.properties) {
		let prop = schema.properties[key]
		
		if(prop.writeOnly)
			continue
		
		output[key] = filter(data[prop.aliasFrom || key], prop)
	}
	
	return output
}

/**
 * Filters all of an array's values according to the items specification
 */
Filters.array = function(data, schema) {
	return data.map(item => filter(item, schema.items))
}


module.exports = {
	expressRequestHandler,
	validate,
	filter,
	Filters
}
