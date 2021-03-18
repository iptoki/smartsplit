const JWT = require("../utils/jwt")
const Config = require("../config")
const User = require("../models/user")
const Errors = require("../routes/errors")

/**
 * Creates an access token for a user
 */
const createToken = function (user, expires = "3 hours") {
	return JWT.create(
		"session",
		{
			user_id: user.user_id,
			user_password: user.password,
			duration: expires,
		},
		expires
	)
}

/**
 * Decodes an access token and returns its contents
 */
const decodeToken = function (token) {
	return JWT.decode("session", token)
}

/**
 * express middleware that adds an `auth` property to all requests, allowing easy
 * and straightforward access validation.
 *
 * TODO: Maybe the OpenAPI integration can handle this for most cases?
 */
const bearerTokenMiddleware = function (req, res) {
	let tokenData = undefined
	req.auth = {}

	/**
	 * Returns the data in the authorization access token
	 */
	Object.defineProperty(req.auth, "data", {
		get: function () {
			if (tokenData === undefined) {
				let authHeader = (req.headers.authorization || "").split(" ")

				if (authHeader[0] === "Bearer") tokenData = decodeToken(authHeader[1])
				else tokenData = null
			}

			return tokenData
		},
	})

	/**
	 * Returns the User model instance, if applicable)
	 */
	Object.defineProperty(req.auth, "user", {
		get: function () {
			if (!req.auth.data || !req.auth.data.user_id) return Promise.resolve(null)
			else return User.findById(req.auth.data.user_id)
		},
	})
}

/**
 * Requires the request to contain an authenticated user, and returns the User model
 * @throws AuthError if there is no authenticated user
 */
const requireAuthUser = async function (req, res) {
	const user = await req.auth.user

	if (!user || user.password !== req.auth.data.user_password)
		throw Errors.InvalidAuthToken

	req.authUser = user
	if (req.params.user_id === "session") req.params.user_id = user._id

	return user
}

/**
 * Requires the request to contain a user with administrator priviledges, and returns the User model
 * @throws AuthError if there is no authenticated admin
 */
const requireAuthAdmin = async function (req, res) {
	const user = await requireAuthUser(req, res)
	if(!user.permissions.isAdmin) throw Errors.UserForbidden
	return user
}

const authorizeUserAccess = async function (req, res) {
	const authUser = await requireAuthUser(req, res)
	if (
		!(
			req.params.user_id === authUser._id ||
			authUser.isAdmin ||
			authUser.hasAccessToUser(req.params.user_id)
		)
	)
		throw Errors.UnauthorizedUserAccess
}

const getAuthUser = async function (req, res) {
	try {
		return await requireAuthUser(req, res)
	} catch (err) {
		if (err.statusCode !== 401 || req.params.user_id === "session") throw err
		return
	}
}
module.exports = {
	createToken,
	decodeToken,
	bearerTokenMiddleware,
	requireAuthUser,
	requireAuthAdmin,
	authorizeUserAccess,
	getAuthUser,
}
