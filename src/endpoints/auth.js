const JWTAuth = require("../service/JWTAuth")
const User = require("../models/user")
const { api } = require("../app")

const UserSchema = require("../schemas/users")
const AuthSchema = require("../schemas/auth")

api.post("/auth/login", {
	tags: ["Authorization"],
	summary: "Trades an email and password against an access token for use with the API.",
	requestBody: AuthSchema.login,
	responses: {
		200: AuthSchema.sessionInfo,
		401: AuthSchema.InvalidCredentialsError,
		412: AuthSchema.AccountNotActiveError,
	}
}, async function(req, res) {
	const user = await User.findOne().byEmail(req.body.email)
	
	if(!user || !(await user.verifyPassword(req.body.password)))
		throw new AuthSchema.InvalidCredentialsError()
	
	if(!user.isActive)
		throw new AuthSchema.AccountNotActiveError({
			accountStatus: user.accountStatus
		})
	
	return {
		accessToken: JWTAuth.createToken(user),
		user: user
	}
})


api.get("/auth/check", {
	tags: ["Authorization"],
	summary: "Verifies an access token by returning `true` if it's valid, `false` otherwise.",
	hooks: { auth: false },
	responses: {
		200: AuthSchema.check
	}
}, async function(req, res) {
	try {
		await JWTAuth.requireUser.call(this, req, res)
		return true
	} catch(e) {
		if(e instanceof JWTAuth.Error)
			return false
		else
			throw e
	}
})


api.get("/auth/refresh", {
	tags: ["Authorization"],
	summary: "Uses an existing access token to obtain a new access token",
	hooks: { auth: true },
	responses: {
		200: AuthSchema.sessionInfo
	}
}, JWTAuth.requireUser, async function() {
	return {
		accessToken: JWTAuth.createToken(this.authUser),
		user: this.authUser
	}
})
