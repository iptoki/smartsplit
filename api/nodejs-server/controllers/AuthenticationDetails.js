const User = require("../models/user")
const JWTAuth = require("../service/JWTAuth")

/** Connecte un utilisateur avec son courriel et mot de passe */
module.exports.postAuth = async function(req, res) {
	const body = req.swagger.params["body"].value
	const user = await User.findOne().byEmail(body.username)
	
	if(!user || !(await user.verifyPassword(body.password)))
		return res.status(401).json({
			error: "Invalid credentials"
		})
	
	// TODO: Plus tard, ça serait mieux de créer des sessions server-side, mais JWT plus facile à utiliser pour là.
	// const session = user.createSession(3*60*60*1000)
	// await session.save()
	
	res.json({
		accessToken: JWTAuth.createUserToken(user)
	})
}

/** Retourne un nouveau jeton d'accès mis à jours à partir du jeton existant */
module.exports.getRefreshToken = async function(req, res) {
	res.json({
		accessToken: JWTAuth.createUserToken(
			await req.auth.user
		)
	})
}

module.exports.postAuthVerifyPassword = async function(req, res) {
	res.status(501).end("Not Implemented, yet")
}
