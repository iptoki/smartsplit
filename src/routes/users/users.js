const User = require("../../models/user")
const { UserTemplates } = require("../../models/notifications/templates")
const EmailVerification = require("../../models/emailVerification")
const UserSchema = require("../../schemas/users")
const AuthSchema = require("../../schemas/auth")
const Errors = require("../errors")
const JWTAuth = require("../../service/JWTAuth")

/************************ Routes ************************/

async function routes(fastify, options) {
	fastify.route({
		method: "GET",
		url: "/users/:user_id",
		schema: {
			tags: ["users"],
			description: "Get a user by ID",
			params: {
				user_id: {
					type: "string",
				},
			},
			response: {
				200: UserSchema.user,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.getAuthUser,
		handler: getUser,
		preSerialization: preSerializeUser,
	})

	fastify.route({
		method: "GET",
		url: "/users/:user_id/avatar",
		schema: {
			tags: ["users"],
			description: "Get a user's avatar by ID",
			params: {
				user_id: {
					type: "string",
				},
			},
		},
		reponse: {
			200: {},
		},
		handler: getUserAvatar,
	})

	fastify.route({
		method: "POST",
		url: "/users/",
		schema: {
			tags: ["users"],
			description: "Create a new user in the system",
			body: {
				allOf: [UserSchema.userRequestBody],
				required: ["email", "password"],
			},
			response: {
				201: UserSchema.user,
			},
		},
		handler: createUser,
	})

	fastify.route({
		method: "POST",
		url: "/users/activate",
		schema: {
			tags: ["users"],
			description: "Activate a user's account",
			body: {
				type: "object",
				required: ["token"],
				properties: {
					token: {
						type: "string",
					},
				},
				additionalProperties: false,
			},
			response: {
				200: AuthSchema.sessionInfo,
			},
		},
		handler: activateUserAccount,
	})

	fastify.route({
		method: "PATCH",
		url: "/users/:user_id",
		schema: {
			tags: ["users"],
			description: "Update a user by ID",
			params: {
				user_id: {
					type: "string",
				},
			},
			body: UserSchema.userRequestBody,
			response: {
				200: UserSchema.user,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: updateUser,
	})

	fastify.route({
		method: "POST",
		url: "/users/request-password-reset",
		schema: {
			tags: ["users"],
			description: "Send a password reset email",
			body: {
				type: "object",
				required: ["email"],
				properties: {
					email: {
						type: "string",
					},
				},
				additionalProperties: false,
			},
			response: {
				204: {},
			},
		},
		handler: requestPasswordReset,
	})

	fastify.route({
		method: "POST",
		url: "/users/change-password",
		schema: {
			tags: ["users"],
			description: "Update the user password",
			body: {
				type: "object",
				required: ["password"],
				properties: {
					token: {
						type: "string",
					},
					currentPassword: {
						type: "string",
					},
					password: {
						type: "string",
					},
				},
				additionalProperties: false,
			},
			response: {
				200: AuthSchema.sessionInfo,
			},
			security: [{ bearerAuth: [] }],
		},
		handler: changeUserPassword,
	})

	fastify.route({
		method: "POST",
		url: "/users/verify-mobile-phone",
		schema: {
			tags: ["users"],
			description: "Verify the user's phone number",
			body: {
				type: "object",
				required: ["verificationCode"],
				properties: {
					verificationCode: {
						type: "number",
					},
				},
				additionalProperties: false,
			},
			response: {
				204: {},
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: verifyUserMobilePhone,
	})

	fastify.route({
		method: "POST",
		url: "/users/invite-new-user",
		schema: {
			tags: ["users"],
			description:
				"Deprecated, you should use POST /users/:user_id/collaborators/. Invite a new user",
			body: {
				type: "object",
				required: ["email"],
				properties: {
					firstName: {
						type: "string",
					},
					lastName: {
						type: "string",
					},
					artistName: {
						type: "string",
					},
					email: {
						type: "string",
					},
				},
				additionalProperties: false,
			},
			response: {
				201: UserSchema.user,
			},
		},
		handler: inviteNewUser,
	})

	fastify.route({
		method: "DELETE",
		url: "/users/:user_id",
		schema: {
			tags: ["users"],
			description: "Delete a user's account by ID",
			params: {
				user_id: {
					type: "string",
				},
			},
			response: {
				204: {},
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.authorizeUserAccess,
		handler: deleteUserAccount,
	})
}

/************************ Handlers ************************/

async function preSerializeUser(req, res, user) {
	if (res.userPublicSchema) {
		const fastJson = require("fast-json-stringify")
		const stringify = fastJson(UserSchema.userPublicProfile)
		if (user.professional_identity && !user.professional_identity.public)
			user.professional_identity = undefined
		return JSON.parse(stringify(user))
	}
	return user
}

const getUser = async function (req, res) {
	if (req.authUser && req.authUser._id === req.params.user_id)
		return req.authUser

	const user = await User.findById(req.params.user_id)

	if (!user) throw Errors.UserNotFound

	if (
		!req.authUser ||
		(req.authUser && !req.authUser.hasAccessToUser(user._id))
	)
		res.userPublicSchema = true

	return user
}

async function getUserAvatar(req, res) {
	const user = await getUser(req, res)
	res.header("Content-Type", "image/jpeg") // hardcoded for the moment
	return user.avatar
}

async function createUser(req, res) {
	if (await User.findOne().byEmail(req.body.email)) throw Errors.ConflictingUser

	let user
	let emailVerif = await EmailVerification.findOne()
		.byEmail(req.body.email)
		.populate("user")

	if (emailVerif) {
		if (!emailVerif.user) await emailVerif.remove()
		else if (await emailVerif.user.verifyPassword(req.body.password))
			user = emailVerif.user
	}

	if (!user) {
		user = new User({
			firstName: req.body.email.split("@")[0],
			...req.body,
		})

		emailVerif = await user.addPendingEmail(req.body.email)

		await user.setPassword(req.body.password)

		if (req.body.avatar) user.setAvatar(Buffer.from(req.body.avatar, "base64"))

		if (req.body.phoneNumber) await user.setMobilePhone(req.body.phoneNumber)

		if (req.body.professional_identity)
			user.setProfessionalIdentity(req.body.professional_identity)

		if (req.body.collaborators)
			await user.addCollaborators(req.body.collaborators)

		await user.save()
		await emailVerif.save()
	}

	await user.sendNotification(UserTemplates.ACTIVATE_ACCOUNT, {
		to: { name: user.fullName, email: emailVerif._id },
	})

	res.code(201)
	return user
}

async function activateUserAccount(req, res) {
	const email = await EmailVerification.findOne().byActivationToken(
		req.body.token
	)

	const user = email.user

	if (email && user.isActive) throw Errors.AccountAlreadyActivated

	if (!email || !user.canActivate) throw Errors.InvalidActivationToken

	user.accountStatus = "active"
	user.emails.push(email._id)

	await user.save()
	await EmailVerification.deleteOne({ _id: email._id })

	return { accessToken: JWTAuth.createToken(user), user: user }
}

async function updateUser(req, res) {
	const user = await getUser(req, res)

	let passwordChanged = false

	// Update user data
	if (req.body.email) {
		const emailVerif = await user.addPendingEmail(req.body.email)
		await emailVerif.save()
		await user.sendNotification(UserTemplates.ACTIVATE_EMAIL, {
			to: { name: user.fullName, email: emailVerif._id },
		})
	}

	if (req.body.phoneNumber) await user.setMobilePhone(req.body.phoneNumber)

	if (req.body.password)
		passwordChanged = await user.setPassword(req.body.password)

	if (req.body.professional_identity)
		user.setProfessionalIdentity(req.body.professional_identity)

	if (req.body.avatar) user.setAvatar(Buffer.from(req.body.avatar, "base64"))

	if (req.body.collaborators)
		await user.addCollaborators(req.body.collaborators)

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

async function requestPasswordReset(req, res) {
	let user = await User.findOne().byEmail(req.body.email)

	if (!user) {
		const email = await EmailVerification.findOne()
			.byEmail(req.body.email)
			.populate("user")

		if (!email) throw Errors.UserNotFound

		user = email.user
	}

	await user.sendNotification(UserTemplates.PASSWORD_RESET, {
		to: { name: user.fullName, email: req.body.email },
	})

	res.code(204).send()
}

async function changeUserPassword(req, res) {
	let user

	if (req.body.token) {
		user = await User.findOne().byPasswordResetToken(req.body.token)

		if (!user) throw Errors.InvalidResetToken
	} else {
		user = await JWTAuth.requireAuthUser(req, res)

		if (
			!req.body.currentPassword ||
			!(await user.verifyPassword(req.body.currentPassword))
		)
			throw Errors.InvalidCurrentPassword
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

async function verifyUserMobilePhone(req, res) {
	if (!req.authUser.mobilePhone) throw Errors.UserMobilePhoneNotFound

	if (req.authUser.mobilePhone.code === "verified")
		throw Errors.MobilePhoneAlreadyActivated

	if (!(await req.authUser.verifyMobilePhone(req.body.verificationCode)))
		throw Errors.InvalidVerificationCode

	res.code(204).send()
}

async function deleteUserAccount(req, res) {
	const user = await getUser(req, res)

	if (user.isDeleted) throw Errors.AccountAlreadyDeleted

	await user.deleteAccount()

	res.code(204).send()
}

// !! DEPRECATED !!
async function inviteNewUser(req, res) {
	if (await User.findOne().byEmail(req.body.email)) throw Errors.ConflictingUser

	const user = new User({
		firstName: req.body.firstName || req.body.email.split("@")[0],
		lastName: req.body.lastName,
		accountStatus: "split-invited",
	})

	const emailVerif = await user.addPendingEmail(req.body.email)

	await user.save()
	await emailVerif.save()

	await user.sendNotification(UserTemplates.SPLIT_INVITED, {
		to: { name: user.fullName, email: emailVerif._id },
	})

	res.code(201)
	return user
}

module.exports = {
	getUser,
	routes,
}
