const mongoose = require("mongoose")
const uuid = require("uuid").v4
const Config = require("../config")
const PasswordUtil = require("../utils/password")
const JWT = require("../utils/jwt")
const EmailVerification = require("../models/emailVerification")
const { sendTemplateTo, normalizeEmailAddress } = require("../utils/email")
const { generateRandomCode } = require("../utils/random")
const { sendSMSTo } = require("../service/twilio")

const JWT_RESET_TYPE = "user:password-reset"
const JWT_ACTIVATE_TYPE = "user:activate"
const JWT_SPLIT_TYPE = "right-split"

/**
 * Represents a user's notification preferences in the system
 */
const NotificationsSchema = new mongoose.Schema(
	{
		general_interations: {
			type: Array,
			default: ["email", "push"],
		},
		administrative_messages: {
			type: Array,
			default: ["email", "push"],
		},
		account_login: {
			type: Array,
			default: [],
		},
		smartsplit_blog: {
			type: Array,
			default: [],
		},
		smartsplit_promotions: {
			type: Array,
			default: [],
		},
		partner_promotions: {
			type: Array,
			default: [],
		},
	},
	{ _id: false }
)

/**
 * Represents a user's permission set in the system
 */
const PermissionSchema = new mongoose.Schema(
	{
		admin: Boolean,
		users: [String],
	},
	{ _id: false }
)

/**
 * Represents a user / login in the system
 */
const UserSchema = new mongoose.Schema({
	_id: {
		type: String,
		alias: "user_id",
		default: uuid,
		api: {
			type: "string",
			format: "uuid",
			example: "e87b56fe-1ce0-4ec7-8393-e18dc7415041",
			readOnly: true,
		},
	},

	emails: {
		type: [String],
		lowercase: true,
		trim: true,
		api: {
			type: "array",
			items: {
				type: "string",
				format: "email",
			},
			readOnly: true,
		},
	},

	password: {
		type: String, // bcrypt
		api: {
			type: "string",
			writeOnly: true,
			format: "password",
			example: "Biquette#1!",
		},
	},

	accountStatus: {
		type: String,
		default: "email-verification-pending",
		enum: [
			"invalid",
			"email-verification-pending",
			"split-invited",
			"active",
			"deleted",
		],
		api: {
			type: "string",
			readOnly: true,
			example: "active",
		},
	},

	firstName: {
		type: String,
		api: {
			type: "string",
			example: "John",
		},
	},

	lastName: {
		type: String,
		api: {
			type: "string",
			example: "Doe",
		},
	},

	artistName: {
		type: String,
		api: {
			type: "string",
			example: "Johnny",
		},
	},

	avatar: Buffer,

	locale: {
		type: String,
		default: "en",
		enum: ["fr", "en"],
		api: {
			type: "string",
			enum: ["en", "fr"],
			example: "fr",
			default: "en",
		},
	},

	mobilePhone: {
		number: String,
		status: {
			type: String,
			enum: ["verified", "unverified"],
		},
		verificationCode: {
			code: Number,
			createdAt: Date,
		},
		api: {
			type: "object",
			properties: {
				number: {
					type: "string",
					example: "+15555555555",
				},
				status: {
					type: "string",
					enum: ["verified", "unverified"],
					example: "verified",
				},
			},
			readOnly: true,
		},
	},

	notifications: {
		type: NotificationsSchema,
		api: {
			type: "object",
			properties: {
				general_interations: {
					type: "array",
					items: {
						type: "string",
						enum: ["email", "push", "sms"],
					},
					default: ["email", "push"],
				},
				administrative_messages: {
					type: "array",
					items: {
						type: "string",
						enum: ["email", "push", "sms"],
					},
					default: ["email", "push"],
				},
				account_login: {
					type: "array",
					items: {
						type: "string",
						enum: ["email", "push", "sms"],
					},
					default: [],
				},
				smartsplit_blog: {
					type: "array",
					items: {
						type: "string",
						enum: ["email", "push", "sms"],
					},
					default: [],
				},
				smartsplit_promotions: {
					type: "array",
					items: {
						type: "string",
						enum: ["email", "push", "sms"],
					},
					default: [],
				},
				partner_promotions: {
					type: "array",
					items: {
						type: "string",
						enum: ["email", "push", "sms"],
					},
					default: [],
				},
			},
		},
	},

	permissions: {
		type: PermissionSchema,
		default: {},
		api: {
			type: "object",
			properties: {
				admin: {
					type: "boolean",
				},
				users: {
					type: "array",
					items: {
						type: "string",
						format: "uuid",
					},
				},
			},
			readOnly: true,
		},
	},

	//rightHolders: [{type: String, ref: "RightHolder", default: []}],
})

/**
 * Define a virtual property that makes a reference to EmailVerification documents
 */
UserSchema.virtual("pendingEmails", {
	ref: "EmailVerification",
	localField: "_id",
	foreignField: "user",
})

/**
 * Returns the full name of the user (Firstname + Lastname)
 */
UserSchema.virtual("fullName").get(function () {
	if (this.firstName && this.lastName)
		return this.firstName + " " + this.lastName

	if (this.firstName) return this.firstName

	return null
})

/**
 * Returns the primary email of this user
 */
UserSchema.virtual("primaryEmail").get(function () {
	if (this.emails.length) return this.emails[0]
	return null
})

/**
 * Returns an email object of {name, email} to send email to/from this user
 */
UserSchema.virtual("$email").get(function () {
	return {
		name: this.fullName || this.primaryEmail,
		email: this.primaryEmail,
	}
})

/**
 * Returns the user's avatarUrl
 */
UserSchema.virtual("avatarUrl").get(function () {
	if (!this.avatar) return null
	return Config.apiUrl + "/users/" + this._id + "/avatar"
})

/**
 * Returns whether the current user is an administrator
 */
UserSchema.virtual("isAdmin").get(function () {
	return this.permissions.admin === true
})

/**
 * Returns whether the current account status is active
 */
UserSchema.virtual("isActive").get(function () {
	return this.accountStatus === "active"
})

/**
 * Returns whether the current account status is deleted
 */
UserSchema.virtual("isDeleted").get(function () {
	return this.accountStatus === "deleted"
})

/**
 * Returns whether this account can be activated with an account activation token
 */
UserSchema.virtual("canActivate").get(function () {
	return [
		undefined,
		null,
		"email-verification-pending",
		"split-invited",
	].includes(this.accountStatus)
})

/**
 * Looks up the database for an existing user with either the ID or email address
 */
UserSchema.query.byBody = function (body) {
	if (!body.email)
		throw new Error("Can't query by body without an email address")

	return this.where({
		$or: [{ _id: body.user_id }, { emails: normalizeEmailAddress(body.email) }],
	})
}

/**
 * Filters account that are considered active
 */
UserSchema.query.byActive = function () {
	this.where({
		accountStatus: "active",
	})
}

/**
 * Looks up the database for a user by email address
 */
UserSchema.query.byEmail = function (email) {
	return this.where({ emails: normalizeEmailAddress(email) })
}

/**
 * Looks up the database for a user by mobile phone
 */
UserSchema.query.byMobilePhone = function (number) {
	return this.where({ "mobilePhone.number": number })
}

/**
 * Looks up a user by a password reset token.
 */
UserSchema.query.byPasswordResetToken = function (token) {
	const data = JWT.decode(JWT_RESET_TYPE, token)

	if (!data)
		// no way to easily make it just return `null`
		return this.where({ _id: null }).skip(1).limit(0)
	else
		return this.where({
			_id: data.user_id,
			password: data.user_password,
		})
}

/**
 * Looks up a user by an account activation token.
 */
UserSchema.query.byActivationToken = function (token) {
	const data = JWT.decode(JWT_ACTIVATE_TYPE, token)

	if (!data) return this.where({ _id: false }).skip(1).limit(0)
	else
		return this.where({
			_id: data.user_id,
			password: data.user_password,
		})
}

/**
 * Adds an email address of a user as pending
 */
UserSchema.methods.hasAccessToUser = function (user_id) {
	if (
		Array.isArray(this.permissions.users) &&
		this.permissions.users.includes(user_id)
	)
		return true

	return false
}

/**
 * Adds an email address of a user as pending
 */
UserSchema.methods.addPendingEmail = async function (
	email,
	sendVerifEmail = true
) {
	email = normalizeEmailAddress(email)

	if (await this.model("User").findOne().byEmail(email))
		throw new Error("Email already used")

	let date = new Date(Date.now() - 60 * 60 * 1000)

	// Throw if an entry already exists and was created less than an hour ago
	let emailVerif = await EmailVerification.findOne({
		_id: email,
		createdAt: { $gte: date },
	})
	if (emailVerif && emailVerif.user !== this._id)
		throw new Error("Email already used")
	// Delete it otherwise
	else await EmailVerification.deleteOne({ _id: email })

	emailVerif = new EmailVerification({
		_id: email,
		user: this._id,
	})
	await emailVerif.save()

	if (sendVerifEmail)
		await this.emailLinkEmailAccount(email).catch((e) =>
			console.error(e, "Error sending email verification")
		)

	if (
		Array.isArray(this.pendingEmails) &&
		!this.pendingEmails.find((item) => item.email === emailVerif._id)
	)
		this.pendingEmails.push(emailVerif)

	return emailVerif
}

/**
 * Remove a pending email address of the user
 */
UserSchema.methods.removePendingEmail = async function (email) {
	email = normalizeEmailAddress(email)

	if (!this.pendingEmails.find((e) => e.email === email)) return false

	await EmailVerification.deleteOne().byEmailUserId(email, this._id)

	if (Array.isArray(this.pendingEmails))
		this.pendingEmails.filter((e) => e.email === email)

	return true
}

/**
 * Remove an email address of the user
 */
UserSchema.methods.removeEmail = async function (email) {
	email = normalizeEmailAddress(email)

	if (!this.emails.includes(email)) return false

	if (this.emails.length === 1) throw new EmailSchema.DeleteNotAllowedError()

	this.emails.splice(this.emails.indexOf(email), 1)
	await this.save()

	return true
}

/**
 * Sets the user's password
 */
UserSchema.methods.setPassword = async function (password, force = false) {
	if (!force && (await this.verifyPassword(password))) return false

	this.password = await PasswordUtil.hash(password)
	return true
}

/**
 * Sets the user's mobile phone
 */
UserSchema.methods.setMobilePhone = async function (number, verified = false) {
	const user = await this.model("User").findOne().byMobilePhone(number)

	if (user && (user._id !== this._id || this.mobilePhone.status === "verified"))
		throw new Error("This phone number is already used")

	const verificationCode = !verified
		? { code: generateRandomCode(), createdAt: new Date() }
		: null

	this.mobilePhone = {
		number: number,
		status: verified ? "verified" : "unverified",
		verificationCode: verificationCode,
	}

	const text =
		this.locale === "en" // TODO: i18n
			? "Your Smartsplit activation code is "
			: "Votre code d'activation Smartsplit est "

	if (!verified)
		await this.sendSMS(
			true,
			text + this.mobilePhone.verificationCode.code
		).catch((e) => console.error(e, "Error sending verification code SMS"))
}

/**
 * Delete the user's account
 */
UserSchema.methods.deleteAccount = async function () {
	this.accountStatus = "deleted"
	this.password = undefined
	this.email = undefined
	this.firstName = undefined
	this.lastName = undefined
	this.artistName = undefined
	this.avatar = undefined
	this.locale = "en"
	await this.save()
}

/*
 * Sets the user's avatar
 */
UserSchema.methods.setAvatar = async function (avatar) {
	if (avatar.length > 1024 * 1024 * 4 /* 4 MB */)
		throw new Error("Maximum file size is 4 MB")

	this.avatar = avatar
}

/**
 * Verifies the password of the current user
 */
UserSchema.methods.verifyPassword = async function (password) {
	return await PasswordUtil.verify(password, this.password)
}

/**
 * Verifies the verification code of the user's mobile phone
 */
UserSchema.methods.verifyMobilePhone = async function (code) {
	if (!this.mobilePhone.verificationCode) return false

	const expireDate = new Date(
		this.mobilePhone.verificationCode.createdAt.getTime() +
			24 * 60 * 60 * 1000 /* 24h */
	)

	if (expireDate < new Date() || this.mobilePhone.verificationCode.code != code)
		return false

	this.mobilePhone.status = "verified"
	this.mobilePhone.verificationCode = null
	await this.save()

	return true
}

/**
 * Creates a password reset token for the user
 */
UserSchema.methods.createPasswordResetToken = function (expires) {
	return JWT.create(
		JWT_RESET_TYPE,
		{
			user_id: this._id,
			user_password: this.password,
		},
		expires
	)
}

/**
 * Verifies a password reset token for the user
 */
UserSchema.methods.verifyPasswordResetToken = function (token) {
	const data = JWT.decode(JWT_RESET_TYPE, token)
	return data && data.user_id == this._id
}

/**
 * Creates an activation token to verify the user's email address
 */
UserSchema.methods.createActivationToken = function (
	email,
	expires = "2 weeks"
) {
	const token = JWT.create(
		JWT_ACTIVATE_TYPE,
		{
			user_id: this.user_id,
			user_password: this.password,
			activate_email: normalizeEmailAddress(email),
		},
		expires
	)
	console.log("token", token)
	return token
}

/**
 * Sends the welcome email to the user
 */
UserSchema.methods.emailWelcome = async function (email, expires = "2 weeks") {
	const token = this.createActivationToken(email, expires)

	// console.log(token) // Temporary helper

	return await sendTemplateTo(
		"user:activate-account",
		this,
		{ to: { name: email, email: email } },
		{ activateAccountUrl: Config.clientUrl + "/user/activate/" + token }
	)
}

/**
 * Sends an activation email to link a new email to the user account
 */
UserSchema.methods.emailLinkEmailAccount = async function (
	email,
	expires = "2 weeks"
) {
	const token = this.createActivationToken(email, expires)

	console.log(token) // Temporary helper

	return await sendTemplateTo(
		"user:activate-email",
		this,
		{ to: { name: this.fullName, email: email } },
		{ linkEmailAccountUrl: Config.clientUrl /* TODO see with frontend */ }
	)
}

/**
 * Sends the password reset email to the user
 */
UserSchema.methods.emailPasswordReset = async function (
	email,
	expires = "2 hours"
) {
	const token = this.createPasswordResetToken(expires)

	return await sendTemplateTo(
		"user:password-reset",
		this,
		{ to: { name: this.fullName, email: email } },
		{ resetPasswordUrl: Config.clientUrl + "/user/change-password/" + token }
	)
}

/**
 * Sends the password changed notification to the user
 */
UserSchema.methods.emailPasswordChanged = async function () {
	return await sendTemplateTo("user:password-changed", this, {}, {})
}

/**
 * Sends the right split created notification to the user
 */
UserSchema.methods.emailRightSplitVoting = async function (expires = "2 weeks") {
	return await sendTemplateTo("right-split:created", this, {}, {})
}

/**
 * Sends the right split completed and accepted notification to the user
 */
UserSchema.methods.emailRightSplitAccepted = async function (expires = "2 weeks") {
	return await sendTemplateTo("right-split:accepted", this, {}, {})
}

/*
 * Sends a notification to the user through the medium set in the user's preferences
 */
UserSchema.methods.sendNotification = async function (notificationType, data, options) {
	await this.sendSMS(notificationType, data)
	await this.sendEmail(notificationType, data, options)
	await this.sendPush(notificationType, data)
}

/**
 * Sends an SMS to the user
 */
UserSchema.methods.sendSMS = async function (notificationType, message) {
	if (notificationType === true) return await sendSMSTo(this, message, false)
	else throw new Error("notificationType not implemented yet")
}

/**
 * Sends an Email to the user
 */
UserSchema.methods.sendEmail = async function (notificationType, data, options) {
	throw new Error("not implemented yet")
}

/**
 * Sends a Push notification to the user
 */
UserSchema.methods.sendPush = async function (notificationType, data, options) {
	throw new Error("not implemented yet")
}

module.exports = mongoose.model("User", UserSchema)
