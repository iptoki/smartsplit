const User = require("../../models/user")
const { UserTemplates } = require("../../models/notifications/templates")
const EmailVerification = require("../../models/emailVerification")
const JWTAuth = require("../../service/JWTAuth")

module.exports.getUser = async function (req, res) {
	const user =
		req.params.user_id === "session"
			? await JWTAuth.requireUser(req, res)
			: await User.findById(req.params.user_id)

	if (!user)
		throw Errors.UserNotFound

	return user
}

module.exports.getUserWithPendingEmails = async function (req, res) {
	const user = await this.getUser(req, res)
	await user.populate("pendingEmails").execPopulate()
	return user
}

module.exports.getUserAvatar = async function (req, res) {
	const user = await this.getUser(req, res)
	res.contentType("image/jpeg") // hardcoded for the moment
	res.send(user.avatar)
}

module.exports.createUser = async function (req, res) {
	if (await User.findOne().byEmail(req.body.email))
		throw Errors.ConflictingUser

	let user
	let email = await EmailVerification.findOne()
		.byEmail(req.body.email)
		.populate("user")

	if (email) {
		if (!email.user) await email.remove()
		if (await email.user.verifyPassword(req.body.password))
			user = email.user
	}

	if (!user) {
		user = new User({
			...req.body,
			user_id: undefined,
			accountStatus: undefined,
		})

		if (!(await user.addPendingEmail(req.body.email, false)))
			throw Errors.ConflictingUser

		await user.setPassword(req.body.password)

		if (req.body.avatar)
			user.setAvatar(Buffer.from(req.body.avatar, "base64"))

		if (req.body.phoneNumber)
			await user.setMobilePhone(req.body.phoneNumber)

		await user.save()
	}

	await user.sendNotification(UserTemplates.ACTIVATE_ACCOUNT, {
		to: { name: user.fullName, email: req.body.email },
	})

	return user
}

module.exports.activateUserAccount = async function (req, res) {
	const email = await EmailVerification.findOne().byActivationToken(
		req.body.token
	)

	if (email && email.user.isActive)
		throw Errors.AccountAlreadyActivated

	if (!email || !email.user.canActivate)
		throw Errors.InvalidActivationToken

	email.user.accountStatus = "active"
	email.user.emails.push(email._id)

	await email.user.save()
	await EmailVerification.deleteOne({ _id: email._id })

	return { accessToken: JWTAuth.createToken(email.user), user: email.user }
}

module.exports.updateUser = async function (req, res) {
	const user = await this.getUser(req, res)

	let passwordChanged = false

	// Update user data
	if (req.body.email) {
		if (!(await user.addPendingEmail(req.body.email)))
			throw Errors.ConflictingEmail
	}

	if (req.body.phoneNumber)
		await user.setMobilePhone(req.body.phoneNumber)

	if (req.body.password)
		passwordChanged = await user.setPassword(req.body.password)

	if (req.body.avatar)
		user.setAvatar(Buffer.from(req.body.avatar, "base64"))

	for (let field of [
		"firstName",
		"lastName",
		"artistName",
		"locale",
		"notifications",
	])
		if (req.body[field]) user[field] = req.body[field]

	await user.save()

	// Send notification if password changed and saved successfully
	if (passwordChanged) user.sendNotification(UserTemplates.PASSWORD_CHANGED)

	return user
}

module.exports.requestPasswordReset = async function (req, res) {
	let user = await User.findOne().byEmail(req.body.email)

	if (!user) {
		const email = await EmailVerification.findOne()
			.byEmail(req.body.email)
			.populate("user")

		if (!email)
			throw Errors.UserNotFound

		user = email.user
	}

	await user.sendNotification(UserTemplates.PASSWORD_RESET, {
		to: { name: user.fullName, email: req.body.email },
	})

	res.code(204).send()
}

module.exports.changeUserPassword = async function (req, res) {
	let user

	if (req.body.token) {
		user = await User.findOne().byPasswordResetToken(req.body.token)

		if (!user)
			throw Errors.InvalidReset
	} else {
		user = await JWTAuth.requireUser(req, res)

		if (
			!req.body.currentPassword ||
			!(await user.verifyPassword(req.body.currentPassword))
		)
			throw Errors.InvalidCurrent
	}

	await user.setPassword(req.body.password, true)

	if (user.accountStatus === "email-verification-pending") {
		user.accountStatus = "active"
		const data = user.decodePasswordResetToken(req.body.token)
		if (await user.removePendingEmail(data.user_email))
			user.emails.push(data.user_email)
	}

	await user.save()

	await user.sendNotification(UserTemplates.PASSWORD_CHANGED)

	return { accessToken: JWTAuth.createToken(user), user }
}

module.exports.verifyUserMobilePhone = async function (req, res) {
	if (!req.authUser.mobilePhone)
		throw Errors.UserMobilePhoneNotFound

	if (req.authUser.mobilePhone.code === "verified")
		throw Errors.MobilePhoneAlreadyActivated

	if (!(await req.authUser.verifyMobilePhone(req.body.verificationCode)))
		throw Errors.InvalidVerificationCode

	res.code(204).send()
}

module.exports.deleteUserAccount = async function (req, res) {
	const user = await this.getUser(req, res)

	if (user.isDeleted) throw Errors.AccountAlreadyDeleted

	await user.deleteAccount()

	res.code(204).send()
}

module.exports.inviteNewUser = async function (req, res) {
	if (await User.findOne().byEmail(req.body.email))
		throw Errors.ConflictingUser

	const user = new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		accountStatus: "split-invited",
	})

	if (!(await user.addPendingEmail(req.body.email, false)))
		throw Errors.ConflictingUser

	await user.save()

	await user.sendNotification(UserTemplate.SPLIT_INVITED, {
		to: { name: user.fullName, email: req.body.email },
	})

	return user
}

module.exports.getUserEmails = async function (req, res) {
	const user = await this.getUserWithPendingEmails(req, res)

	return user.emails
		.map((e) => ({ email: e, status: "active" }))
		.concat(
			user.pendingEmails.map((e) => ({
				email: e.email,
				status: "pending",
			}))
		)
}

module.exports.createUserEmail = async function (req, res) {
	const user = await this.getUserWithPendingEmails(req, res)
	const email = await user.addPendingEmail(req.body.email)

	if (!email)
		throw Errors.ConflictingEmail

	return user.emails
		.map((e) => ({ email: e, status: "active" }))
		.concat(
			user.pendingEmails.map((e) => ({
				email: e.email,
				status: "pending",
			}))
		)
}

module.exports.activateUserEmail = async function (req, res) {
	const user = await this.getUserWithPendingEmails(req, res)

	if (user.emails.includes(normalizeEmailAddress(req.params.email)))
		throw Errors.EmailAlreadyActivated

	const email = user.pendingEmails.find(
		(item) => item.email === normalizeEmailAddress(req.params.email)
	)

	if (!email)
		throw Errors.EmailNotFound

	if (!(await email.verifyActivationToken(req.body.token)))
		throw Errors.InvalidActivationToken

	await EmailVerification.deleteOne({ _id: email._id })

	user.emails.push(email._id)
	await user.save()

	res.code(204).send()
}

module.exports.deleteUserEmail = async function (req, res) {
	const user = await this.getUserWithPendingEmails(req, res)
	
	if (!(await user.removeEmail(req.params.email))) {
		if (!(await user.removePendingEmail(req.params.email))) {
			throw Errors.EmailNotFound
		}
	}

	res.code(204).send()
}