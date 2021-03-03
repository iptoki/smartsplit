const Transaction = require("../models/transaction")

function preHandler(req, res, next) {
	const transaction = new Transaction({
		request: {
			id: req.id,
			url: req.url,
			method: req.method,
			authorisation: req.headers.authorisation,
			userAgent: req.headers["user-agent"],
			params: req.params,
			querystring: req.querystring,
		},
		authUserId: req.authUser ? req.authUser._id : undefined,
		operation: getOp(req),
	})
	transaction.save()
	req.transaction = transaction
	next()
}

function onError(req, res, error, next) {
	req.transaction.response.errorMessage = error.message
	next()
}

function onResponse(req, res, next) {
	req.transaction.response.statusCode = res.statusCode
	req.transaction.save()
	next()
}

function getOp(req) {
	const op = req.context.schema.dbOperation
	if (op) return op
	if (req.method === "POST") return "insert"
	if (req.method === "DELETE") return "delete"
	if (["PATCH", "PUT"].includes(req.method)) return "update"
	return "noop"
}

module.exports = {
	preHandler,
	onResponse,
	onError,
}
