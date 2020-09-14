const JWTAuth = require("../service/JWTAuth")
const User = require("../models/user")
const AuthSchema = require("../schemas/auth")
const Errors = require("./errors")

async function routes(fastify, options) {
	fastify.route({
		method: "GET",
		url: "/auth/check",
		schema: {
			response: {
				200: { type: "boolean" },
			},
		},
		handler: checkToken,
	})

	fastify.route({
		method: "GET",
		url: "/auth/refresh",
		schema: {
			response: {
				200: AuthSchema.sessionInfo,
			},
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: refreshToken,
	})

	fastify.route({
		method: "POST",
		url: "/auth/login",
		schema: {
			body: AuthSchema.login,
			response: {
				200: AuthSchema.sessionInfo,
			},
		},
		handler: login,
	})
}

async function login(req, res) {
	const user = await User.findOne().byEmail(req.body.email)

	if (!user || !(await user.verifyPassword(req.body.password)))
		throw Errors.InvalidCredentials

	if (!user.isActive) throw Errors.AccountNotActive

	return {
		accessToken: JWTAuth.createToken(user, req.body.expires),
		user: user,
	}
}

async function checkToken(req, res) {
	return req.authUser ? true : false
}

async function refreshToken(req, res) {
	return {
		accessToken: JWTAuth.createToken(
			req.authUser,
			req.auth.data.duration
		),
		user: req.authUser,
	}
}

module.exports = routes
