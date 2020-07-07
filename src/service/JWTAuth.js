const JWT = require("../utils/jwt")
const Config = require("../config")
const User = require("../models/user")
const AutoAPI = require("../autoapi")

/**
 * Exception type that will be thrown in case of authentication errors
 */
class AuthError extends AutoAPI.Error {
	constructor(status, data, ...args) {
		super(status, data, ...args)
	}
}

/**
 * Creates an access token for a user
 */
const createToken = function (user, expires = "3 hours") {
	return JWT.create(
		"session",
		{
			user_id: user.user_id,
			user_password: user.password,
			//rightHolders: user.rightHolders,
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
const expressMiddleware = function (req, res, next) {
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

	/**
	 * Returns the User model instance of an admin, if applicable)
	 */
	Object.defineProperty(req.auth, "admin", {
		get: function () {
			if (!req.auth.data || !req.auth.data.user_id) return Promise.resolve(null)
			else
				return User.findOne({
					_id: req.auth.data.user_id,
					"permissions.admin": true,
				})
		},
	})

	next("route")
}

/**
 * Requires the request to contain an authenticated user, and returns the User model
 * @throws AuthError if there is no authenticated user
 */
const requireUser = async function () {
	const user = await this.req.auth.user

	if (!user || user.password !== this.req.auth.data.user_password)
		throw new AuthError(401, {
			code: "AUTH:INVALID_AUTH_TOKEN",
			message: "This request requires an authenticated user",
		})

	this.authUser = user
	if (this.req.params.user_id === "session") this.req.params.user_id = user._id

	return user
}

/**
 * Requires the request to contain a user with administrator priviledges, and returns the User model
 * @throws AuthError if there is no authenticated admin
 */
const requireAdmin = async function () {
	const admin = await this.req.auth.admin

	if (!admin || admin.password !== this.req.auth.data.user_password)
		throw new AuthError(401, {
			code: "AUTH:INVALID_AUTH_TOKEN",
			message: "This request requires an authenticated admin",
		})

	this.authUser = admin
	return admin
}

const authorizeUserAccess = async function () {
	if (
		!(
			this.req.params.user_id === this.authUser._id ||
			this.authUser.isAdmin ||
			this.authUser.hasAccessToUser(this.req.params.user_id)
		)
	) {
		throw new AuthError(401, {
			code: "AUTH: PERMISSION_DENIED",
			message: "The authorized user is not allowed to access this user",
		})
	}
}

const loadAuthUser = async function () {
	try {
		return await requireUser.call(this)
	} catch (e) {
		if (!(e instanceof AuthError)) throw e
	}
}

module.exports = {
	createToken,
	decodeToken,
	expressMiddleware,
	requireUser,
	requireAdmin,
	authorizeUserAccess,
	loadAuthUser,
	Error: AuthError,
}
