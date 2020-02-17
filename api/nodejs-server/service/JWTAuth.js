const jwt = require('jsonwebtoken')
const {getParameterA} = require("../utils/utils")
const User = require("../models/user")
let JWT_SECRET

getParameterA("SECRET_JWS_API")
	.then(secret => JWT_SECRET = secret)
	.catch(e => {
		console.error("Erreur lors de l'obtention du secret JWT pour les jetons d'accès à l'API!", e)
		process.exit(-1)
	})

/** Type d'exception qui sera levé si un fonction nécessite des permissions que l'utilisateur n'a pas */
class AuthError extends Error {
	constructor(status, data, ...args) {
		super(data.error || "Unauthorized", ...args)
		this.httpStatus = status || 401 // Unauthorized
		this.data = data
	}
}

/** Crée un jeton d'accès pour l'utilisateur */
module.exports.createUserToken = function(user, expires = "3 hours") {
	return module.exports.createToken({
		user: user._id,
		rightHolders: user.rightHolders,
	}, expires)
}

/** Crée un jeton d'accès avec des données */
const createToken = module.exports.createToken = function(data, expires) {
	return jwt.sign(data, JWT_SECRET, {expiresIn: expires})
}

/** Décode un jeton d'accès et retourne son contenu */
const decodeToken = module.exports.decodeToken = function(token) {
	return jwt.verify(token, JWT_SECRET)
}

/**
 * Middleware express.js qui ajoute un objet `auth` à la requête qui permets de réaliser diverses opérations de vérification
 */
module.exports.expressMiddleware = function(req, res, next) {
	let tokenData = null
	req.auth = {}
	
	/** Retourne les données contenues dans le jeton d'accès */
	Object.defineProperty(req.auth, "data", {
		get: function() {
			if(tokenData === null) try {
				let authHeader = (req.headers.authorization || "").split(" ")

				if(authHeader[0] === "Bearer")
					tokenData = decodeToken(authHeader[1])
				else
					tokenData = false
			} catch(e) {
				tokenData = false
			}
			
			return tokenData || null
		}
	})
	
	/** Retourne une requête de l'object utilisateur de la base de donnée */
	Object.defineProperty(req.auth, "user", {
		get: function() {
			return User.findById(req.auth.requireUser())
		}
	})
	
	/** Rejette la requête si l'utilisateur n'est pas identifié */
	req.auth.requireUser = function() {
		if(!req.auth.data || !req.auth.data.user)
			throw new AuthError(401, {
				error: "This request requires an authenticated user"
			})
		
		return req.auth.data.user
	}
	
	/** Rejette la requête sur l'utilisateur de l'API n'a pas accès à au moins un des ayant droits demandés */
	req.auth.requireRightHolder = function(...rightHolderIds) {
		req.auth.requireUser()
		
		const userRHs = req.auth.data.rightHolders
		
		for(rightHolderId of rightHolderIds) {
			if(userRHs.includes(rightHolderId))
				return rightHolderId
		}
		
		throw new AuthError(403, {
			error: "The current user doesn't have access to any of the required right holders",
			userId: req.auth.data.user,
			rightHolderIds: rightHolderIds
		})
	}
	
	next("route")
}

module.exports.Error = AuthError
