const { api, errorResponse } = require("../app")
const { body } = require("../autoapi")
const User = require("../models/user")
const EmailVerification = require("../models/emailVerification")
const JWTAuth = require("../service/JWTAuth")
const RequestUtil = require("../utils/request")
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
	const user = await RequestUtil.getUserWithPendingEmails(req)
	
	if(!user)
		throw new UserSchema.UserNotFoundError({user_id: req.params.user_id})
	
	return user
})


api.get("/users/{user_id}/avatar", {
	tags: ["Users"],
	parameters: [UserSchema.id],
	summary: "Get a user's avatar",
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
	
	let user = await User.findById(req.body.user_id)
	let email = await EmailVerification.findOne().byEmail(req.body.email).populate("user")

	if(user) {
		if( !(await user.verifyPassword(req.body.password))) {
			throw new UserSchema.ConflictingUserError({
				user_id: req.body.user_id,
				email: req.body.email
			})
		} else
			await user.addPendingEmail(req.body.email, false)
	}
	else if(email){
		if(!(await email.user.verifyPassword(req.body.password))) {
			throw new UserSchema.ConflictingUserError({
				user_id: req.body.user_id,
				email: req.body.email
			})
		} else
			user = email.user
	}
	else {
		user = new User(req.body)

		await user.addPendingEmail(req.body.email, false)

		if(req.body.avatar)
			user.setAvatar(Buffer.from(req.body.avatar, "base64"))

		await user.setPassword(req.body.password)
		if(req.body.phoneNumber)
			await user.setMobilePhone(req.body.phoneNumber, false)
		await user.save()
	}

	await user.emailWelcome(req.body.email)
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
	const email = await EmailVerification.findOne().byActivationToken(req.body.token)

	if(email && email.user.isActive)
		throw new UserSchema.AccountAlreadyActivatedError()
	
	if(!email || !email.user.canActivate)
		throw new UserSchema.InvalidActivationTokenError()
	
	email.user.accountStatus = "active"
	email.user.emails.push(email._id)
	await email.user.save()
	await EmailVerification.deleteOne({_id: email._id})
	
	return { accessToken: JWTAuth.createToken(email.user), user: email.user }
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
		await user.addPendingEmail(req.body.email)
	
	if(req.body.phoneNumber)
		await user.setMobilePhone(req.body.phoneNumber, false)

	if(req.body.password)
		passwordChanged = await user.setPassword(req.body.password)

	if(req.body.avatar)
		user.setAvatar(Buffer.from(req.body.avatar, "base64"))
	
	for(let field of ["firstName", "lastName", "artistName", "locale", "notifications"])
		if(req.body[field])
			user[field] = req.body[field]
	
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
	
	await user.emailPasswordReset(req.body.email)
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


api.post("/users/verify-mobile-phone", {
	tags: ["Users"],
	summary: "Verify the user's mobile phone",
	requestBody: UserSchema.verifyMobilePhone,
	hooks: { auth: true },
	responses: {
		200: {description: "Mobile phone successfully verified"},
		403: UserSchema.InvalidVerificationCodeError,
		412: UserSchema.MobilePhoneAlreadyActivatedError,
	}
}, async function(req, res) {
	const user = await req.auth.requireUser()

	if(!user.mobilePhone)
		throw new Error("User doesn't have a mobile phone")
	if(user.mobilePhone.status === "verified")
		throw new UserSchema.MobilePhoneAlreadyActivatedError()
	if(! await user.verifyMobilePhone(req.body.verificationCode))
		throw new UserSchema.InvalidVerificationCodeError()

	res.status(200).end()
})

api.delete("/users/{user_id}", {
	tags: ["Users"],
	parameters: [UserSchema.id],
	summary: "Delete the user account",
	hooks: { auth: true },
	responses: {
		200: {description: "Account deleted successfully"},
		404: UserSchema.UserNotFoundError,
		412: UserSchema.AccountAlreadyDeletedError 
	}
}, async function(req, res) {
	const user = req.params.user_id === "session"
	           ? await req.auth.requireUser()
	           : await User.findById(req.params.user_id)

	if(!user)
		throw new UserSchema.UserNotFoundError({user_id: req.params.user_id})      

	if(user.isDeleted)
		throw new UserSchema.AccountAlreadyDeletedError()

	await user.deleteAccount()
	   
	res.status(200).end()
})
