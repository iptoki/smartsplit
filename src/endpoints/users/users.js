const { api, errorResponse } = require("../../app")
const { body }               = require("../../autoapi")
const User                   = require("../../models/user")
const EmailVerification      = require("../../models/emailVerification")
const JWTAuth                = require("../../service/JWTAuth")
const RequestUtil            = require("../../utils/request")
const AuthSchema             = require("../../schemas/auth")
const UserSchema             = require("../../schemas/users")


async function getUser({ req, res, user }) {
	return user
}


async function getUserAvatar({ req, res, user }) {
	res.contentType("image/jpeg") // hardcoded for the moment
	res.send(user.avatar)
}


async function createUser(req, res) {
	if(await User.findOne().byEmail(req.body.email))
		throw new UserSchema.ConflictingUserError({ email: req.body.email })

	let email = await EmailVerification.findOne().byEmail(req.body.email).populate("user")

	if(email){
		if(!(await email.user.verifyPassword(req.body.password) || email.user.isActive))
			throw new UserSchema.ConflictingUserError({ email: req.body.email })

		user = email.user
	}
	else {
		user = new User(req.body)

		await user.addPendingEmail(req.body.email, false)
		await user.setPassword(req.body.password)

		if(req.body.avatar)
			user.setAvatar(Buffer.from(req.body.avatar, "base64"))

		if(req.body.phoneNumber)
			await user.setMobilePhone(req.body.phoneNumber, false)

		await user.save()
	}

	await user.emailWelcome(req.body.email)
		.catch(e => console.error(e, "Error sending welcome email"))

	return user
}


async function activateUserAccount(req, res) {
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
}


async function updateUser({req, res, user}) {
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
}


async function changeUserPassword(req, res) {
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
}


async function verifyUserMobilePhone({req, res, user}) {
	if(!user.mobilePhone)
		throw new Error("User doesn't have a mobile phone")

	if(user.mobilePhone.status === "verified")
		throw new UserSchema.MobilePhoneAlreadyActivatedError()

	if(! await user.verifyMobilePhone(req.body.verificationCode))
		throw new UserSchema.InvalidVerificationCodeError()

	res.status(204).end()
}

async function deleteUserAccount({req, res, user}) {
	if(user.isDeleted)
		throw new UserSchema.AccountAlreadyDeletedError()

	await user.deleteAccount()
	   
	res.status(204).end()
}

module.exports = {
	getUser,
	getUserAvatar,
	createUser,
	activateUserAccount,
	updateUser,
	changeUserPassword,
	verifyUserMobilePhone,
	deleteUserAccount,
}