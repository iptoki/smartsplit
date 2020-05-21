const User              = require("../../models/user")
const EmailVerification = require("../../models/emailVerification")
const JWTAuth           = require("../../service/JWTAuth")
const UserSchema        = require("../../schemas/users")


async function getUserAvatar() {
	this.res.contentType("image/jpeg") // hardcoded for the moment
	this.res.send(this.user.avatar)
}


async function createUser() {
	if(await User.findOne().byEmail(this.req.body.email))
		throw new UserSchema.ConflictingUserError({ email: this.req.body.email })

	let user
	let email = await EmailVerification.findOne().byEmail(this.req.body.email).populate("user")

	if(email){
		if(!(await email.user.verifyPassword(this.req.body.password) || email.user.isActive))
			throw new UserSchema.ConflictingUserError({ email: this.req.body.email })

		user = email.user
	}
	else {
		user = new User(this.req.body)

		await user.addPendingEmail(this.req.body.email, false)
		await user.setPassword(this.req.body.password)

		if(this.req.body.avatar)
			user.setAvatar(Buffer.from(this.req.body.avatar, "base64"))

		if(this.req.body.phoneNumber)
			await user.setMobilePhone(this.req.body.phoneNumber, false)

		await user.save()
	}

	await user.emailWelcome(this.req.body.email)
		.catch(e => console.error(e, "Error sending welcome email"))

	return user
}


async function activateUserAccount() {
	const email = await EmailVerification.findOne().byActivationToken(this.req.body.token)

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


async function updateUser() {
	let passwordChanged = false

	// Update user data
	if(this.req.body.email)
		await this.user.addPendingEmail(this.req.body.email)
	
	if(this.req.body.phoneNumber)
		await this.user.setMobilePhone(this.req.body.phoneNumber, false)

	if(this.req.body.password)
		passwordChanged = await this.user.setPassword(this.req.body.password)

	if(this.req.body.avatar)
		this.user.setAvatar(Buffer.from(this.req.body.avatar, "base64"))
	
	for(let field of ["firstName", "lastName", "artistName", "locale", "notifications"])
		if(this.req.body[field])
			this.user[field] = this.req.body[field]
	
	await this.user.save()
	
	// Send notification if password changed and saved successfully
	if(passwordChanged)
		user.emailPasswordChanged().catch(e => {
			console.error("Error sending 'password changed' email:", e)
		})
	
	return this.user
}


async function changeUserPassword() {
	let user
	
	if(this.req.body.token) {
		user = await User.findOne().byPasswordResetToken(this.req.body.token)
		
		if(!user)
			throw new UserSchema.InvalidResetToken({token: this.req.body.token})
	} else {
		user = await JWTAuth.requireUser.call(this)
		
		if(!this.req.body.currentPassword || ! await user.verifyPassword(this.req.body.currentPassword))
			throw new UserSchema.InvalidCurrentPassword()
	}
	
	await user.setPassword(this.req.body.password, true)
	
	if(user.accountStatus === "email-verification-pending")
		user.accountStatus = "active"
	
	await user.save()
	
	user.emailPasswordChanged().catch(e => {
		console.error("Error sending 'password changed' email:", e)
	})
	
	return { accessToken: JWTAuth.createToken(user), user }
}


async function verifyUserMobilePhone() {
	if(!this.authUser.mobilePhone)
		throw new Error("User doesn't have a mobile phone")

	if(this.authUser.mobilePhone.status === "verified")
		throw new UserSchema.MobilePhoneAlreadyActivatedError()

	if(! await this.authUser.verifyMobilePhone(this.req.body.verificationCode))
		throw new UserSchema.InvalidVerificationCodeError()

	this.res.status(204).end()
}

async function deleteUserAccount() {
	if(this.user.isDeleted)
		throw new UserSchema.AccountAlreadyDeletedError()

	await this.user.deleteAccount()
	   
	this.res.status(204).end()
}

module.exports = {
	getUserAvatar,
	createUser,
	activateUserAccount,
	updateUser,
	changeUserPassword,
	verifyUserMobilePhone,
	deleteUserAccount,
}
