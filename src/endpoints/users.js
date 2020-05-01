const { api, errorResponse } = require("../app")
const { body } = require("../autoapi")
const User = require("../models/user")
const JWTAuth = require("../service/JWTAuth")

const AuthSchema = require("../schemas/auth")
const UserSchema = require("../schemas/users")


api.get("/users/{user_id}", {
	tags: ["Users"],
	parameters: [UserSchema.id],
	summary: "Get a user's basic profile",
	hooks: { auth: true },
	responses: {
		200: UserSchema.user,
		404: UserSchema.UserNotFoundError,
	}
}, async function(req, res) {
	const user = req.params.user_id === "session"
	           ? await req.auth.requireUser()
	           : await User.findById(req.params.user_id)
	
	if(!user)
		throw new UserSchema.UserNotFoundError({user_id: req.params.user_id})
	
	return user
})


api.get("/users/{user_id}/avatar", {
	tags: ["Users"],
	parameters: [UserSchema.id],
	summary: "Get a user's avatar",
	hooks: { auth: true },
	responses: {
		404: UserSchema.UserNotFoundError,
	}
}, async function(req, res) {
	const user = req.params.user_id === "session"
	           ? await req.auth.requireUser()
	           : await User.findById(req.params.user_id)
	
	if(!user)
		throw new UserSchema.UserNotFoundError({user_id: req.params.user_id})
	
	res.contentType("image/jpeg") // hardcoded for the moment
	res.send(user.avatar)
})


api.post("/users/", {
	tags: ["Users"],
	summary: "Create a new user",
	requestBody: body({allOf: [UserSchema.user, {
		required: ["email", "password", "locale"]
	}]}),
	responses: {
		200: UserSchema.user,
		409: UserSchema.ConflictingUserError,
	}
}, async function(req, res) {
	if(req.body.user_id === "")
		delete req.body.user_id
	
	let user = await User.findOne().byBody(req.body)
	
	if(user) {
		// If the user exists, check that the password is correct
		if(! (await user.verifyPassword(req.body.password)))
			throw new UserSchema.ConflictingUserError({
				user_id: req.body.user_id,
				email: req.body.email
			})
		
		// Check passed, let through to resubmit the welcome email
	} else {
		user = new User(req.body)
		if(req.body.avatar)
			user.setAvatar(Buffer.from(req.body.avatar, "base64"))
		await user.setEmail(req.body.email, false /* skip email check */)
		await user.setPassword(req.body.password)
		await user.save()
	}
	
	await user.emailWelcome()
		.catch(e => console.error(e, "Error sending welcome email"))

	return user
})


api.post("/users/activate", {
	tags: ["Users"],
	summary: "Activates a user account",
	requestBody: UserSchema.activateAccountSchema,
	responses: {
		200: AuthSchema.sessionInfo,
		403: UserSchema.InvalidActivationTokenError,
		412: UserSchema.AccountAlreadyActivatedError,
	}
}, async function(req, res) {
	const user = await User.findOne().byActivationToken(req.body.token)
	
	if(user && user.isActive)
		throw new UserSchema.AccountAlreadyActivatedError()
	
	if(!user || !user.canActivate)
		throw new UserSchema.InvalidActivationTokenError()
	
	user.accountStatus = "active"
	await user.save()
	
	return { accessToken: JWTAuth.createToken(user), user }
})


api.patch("/users/{user_id}", {
	tags: ["Users"],
	parameters: [UserSchema.id],
	summary: "Updates a user",
	requestBody: UserSchema.user,
	hooks: { auth: true },
	responses: {
		200: UserSchema.user,
		403: UserSchema.UserForbidden
	}
}, async function(req, res) {
	const user = await req.auth.requireUser()
	let passwordChanged = false

	// Check access
	if(req.params.user_id !== user._id && req.params.user_id !== "session")
		throw new UserForbidden({
			authorized_user_id: user._id,
			user_id: req.params.user_id
		})
	
	// Update user data
	if(req.body.email)
		await user.setEmail(req.body.email)
	
	if(req.body.password)
		passwordChanged = await user.setPassword(req.body.password)
	
	if(req.body.avatar)
		user.setAvatar(Buffer.from(req.body.avatar, "base64"))

	for(let field of ["firstName", "lastName", "artistName", "avatarUrl", "locale"])
		if(req.body[field])
			user[field] = req.body[field]
	
	//user.avatar = require("fs").readFileSync("/home/blyat/Pictures/img.png")
	//console.log(user.avatar)
	await user.save()
	
	// Send notification if password changed and saved successfully
	if(passwordChanged)
		user.emailPasswordChanged().catch(e => {
			console.error("Error sending 'password changed' email:", e)
		})
	
	return user
})


api.post("/users/request-password-reset", {
	tags: ["Users"],
	summary: "Requests a password reset: sends an email with a reset token/link to the user",
	requestBody: UserSchema.requestPasswordReset,
	responses: {
		200: { description: "Password reset email sent successfully" },
		404: UserSchema.UserNotFoundError,
	}
}, async function(req, res) {
	const user = await User.findOne().byEmail(req.body.email)
	
	if(!user)
		throw new UserSchema.UserNotFoundError({email: req.body.email})
	
	await user.emailPasswordReset()
	res.status(200).end()
})


api.post("/users/change-password", {
	tags: ["Users"],
	summary: "Changes the user's password and returns an new access token. All previous access tokens will be invalidated. Requires either `token` or `currentPassword` to be provided to authorize the password change.",
	requestBody: UserSchema.passwordChange,
	security: [{}],
	hooks: { auth: true },
	responses: {
		200: AuthSchema.sessionInfo,
		403: errorResponse("Failed to confirm password change. If `token` was supplied, an error code of `user_invalid_reset_token` is returned. Otherwise, a valid `currentPassword` needs to be provided, or a `user_invalid_current_password` error will be returned.")
	}
}, async function(req, res) {
	let user
	
	if(req.body.token) {
		user = await User.findOne().byPasswordResetToken(req.body.token)
		
		if(!user)
			throw new UserSchema.InvalidResetToken({token: req.body.token})
	} else {
		user = await req.auth.requireUser()
		
		if(!req.body.currentPassword || ! await user.verifyPassword(req.body.currentPassword))
			throw new UserSchema.InvalidCurrentPassword()
	}
	
	await user.setPassword(req.body.password, true)
	
	if(user.accountStatus === "email-verification-pending")
		user.accountStatus = "active"
	
	await user.save()
	
	user.emailPasswordChanged().catch(e => {
		console.error("Error sending 'password changed' email:", e)
	})
	
	return { accessToken: JWTAuth.createToken(user), user }
})
