const User = require("../models/user")
const { UserNotFound } = require("./errors")

/************************ Routes ************************/

async function routes(fastify, options) {
	fastify.route({
		method: "GET",
		url: "/rightHolders",
		schema: {
			querystring: {
				search_terms: {type: "string"},
				limit: {
					type: "integer",
					default: 50,
					minimum: 1,
					maximum: 250,
				},
				skip: {
					type: "integer",
					default: 0, 
					minimum: 0,
				}
			},
			response: {
				200: { type: "array", items: {$ref: "UserSchema#/definitions/rightHolder" } }
			}
		},
		handler: getRightHolders
	})

	fastify.route({
		method: "GET",
		url: "/rightHolders/:user_id",
		schema: {
			params: {
				user_id: {
					type: "string",
				}
			},
			response: {
				200: { $ref: "UserSchema#/definitions/rightHolder" },
			}
		},
		handler: getRightHolderById
	})
}

/************************ Handlers ************************/

async function getRightHolders(req, res) {
	let regex = ""
	if (req.query.search_terms) {
		let search_terms = [req.query.search_terms]
		if (req.query.search_terms.includes(" "))
			search_terms = search_terms.concat(req.query.search_terms.split(" "))
		regex = new RegExp(search_terms.join("|"))
	}

	return await User.find({
		$or: [
			{ firstName: { $regex: regex, $options: "i" } },
			{ lastName: { $regex: regex, $options: "i" } },
			{ artistName: { $regex: regex, $options: "i" } },
		],
	})
		.skip(parseInt(req.query.skip))
		.limit(parseInt(req.query.limit))
}

async function getRightHolderById(req, res) {
	const rightHolder = await User.findById(req.params.user_id)

	if (!rightHolder)
		throw UserNotFound

	return rightHolder
}

module.exports = routes