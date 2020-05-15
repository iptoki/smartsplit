const JWT = require('../utils/jwt')
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

module.exports.Error = AuthError


/** 
 * Creates an access token for a user
 */
const createToken = module.exports.createToken = function(user, expires = "3 hours") {
	return JWT.create("session", {
		user_id: user.user_id,
		user_password: user.password,
		//rightHolders: user.rightHolders,
	}, expires)
}


/**
 * Decodes an access token and returns its contents
 */
const decodeToken = module.exports.decodeToken = function(token) {
	return JWT.decode("session", token)
}


/**
 * express middleware that adds an `auth` property to all requests, allowing easy
 * and straightforward access validation.
 * 
 * TODO: Maybe the OpenAPI integration can handle this for most cases?
 */
module.exports.expressMiddleware = function(req, res, next) {
	let tokenData = undefined
	req.auth = {}
	
	/**
	 * Returns the data in the authorization access token
	 */
	Object.defineProperty(req.auth, "data", {
		get: function() {
			if(tokenData === undefined) {
				let authHeader = (req.headers.authorization || "").split(" ")

				if(authHeader[0] === "Bearer")
					tokenData = decodeToken(authHeader[1])
				else
					tokenData = null
			}
			
			return tokenData
		}
	})
	
	/** 
	 * Returns the User model instance, if applicable)
	 */
	Object.defineProperty(req.auth, "user", {
		get: function() {
			if(!req.auth.data || !req.auth.data.user_id)
				return Promise.resolve(null)
			else
				return User.findById(req.auth.data.user_id)
		}
	})

	/** 
	 * Returns the User model instance of an admin, if applicable)
	 */
	Object.defineProperty(req.auth, "admin", {
		get: function() {
			if(!req.auth.data || !req.auth.data.user_id)
				return Promise.resolve(null)
			else
				return User.findById(req.auth.data.user_id)
		}
	})
	
	/**
	 * Requires the request to contain a user, and returns the User model
	 * @throws AuthError if there is no authenticated user
	 */
	req.auth.requireUser = async function() {
		const user = await req.auth.user
		
		if(!user || user.password !== req.auth.data.user_password)
			throw new AuthError(401, {
				code: "AUTH:INVALID_AUTH_TOKEN",
				message: "This request requires an authenticated user"
			})
		
		return user
	}
	
	/**
	 * Requires the request to contain a user with administrator priviledges, and returns the User model
	 * @throws AuthError if there is no authenticated admin
	 */
	req.auth.requireAdmin = async function() {
		const admin = await req.auth.admin
		
		if(!admin || admin.password !== req.auth.data.user_password)
			throw new AuthError(401, {
				code: "AUTH:INVALID_AUTH_TOKEN",
				message: "This request requires an authenticated admin"
			})
		
		return admin
	}

	/**
	 * Requires the request to contain a user that has access to at least one
	 * of the right holders received as arguments, returning the one that matched
	 */
	req.auth.requireRightHolder = function(...rightHolderIds) {
		req.auth.requireUser()
		
		const userRHs = req.auth.data.rightHolders
		
		for(rightHolderId of rightHolderIds) {
			if(userRHs.includes(rightHolderId))
				return rightHolderId
		}
		
		throw new AuthError(403, {
			code: "AUTH:MISSING_RIGHTHOLDER",
			message: "The current user doesn't have access to any of the required right holders",
			user_id: req.auth.data.user_id,
			rightHolderIds: rightHolderIds
		})
	}
	
	next("route")
}
