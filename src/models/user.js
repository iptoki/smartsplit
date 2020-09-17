const mongoose = require("mongoose")
const uuid = require("uuid").v4
const Config = require("../config")
const PasswordUtil = require("../utils/password")
const JWT = require("../utils/jwt")
const EmailVerification = require("../models/emailVerification")
const Notification = require("../models/notifications/notification")
const { sendTemplateTo, normalizeEmailAddress } = require("../utils/email")
const { generateRandomCode } = require("../utils/random")
const { sendSMSTo } = require("../service/twilio")
const {
	UserTemplates,
	generateTemplate,
} = require("../models/notifications/templates")

const JWT_RESET_TYPE = "user:password-reset"
const JWT_ACTIVATE_TYPE = "user:activate"
const JWT_SPLIT_TYPE = "right-split"

/**
 * Represents a user's mobile phone in the system
 */
const MobilePhoneSchema = new mongoose.Schema(
	{
		number: String,
		status: {
			type: String,
			enum: ["verified", "unverified"],
		},
		verificationCode: {
			code: Number,
			createdAt: Date,
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
const UserSchema = new mongoose.Schema(
	{
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
			type: MobilePhoneSchema,
		},

		notifications: {
			type: Notification.Schema,
			default: {},
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
	},
	{ toJSON: { virtuals: true } }
)

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

UserSchema.virtual("user_id").get(function () {
	return this._id
})

UserSchema.virtual("rightHolder_id").get(function () {
	return this._id
})

/**
 * Returns the primary email of this user
 */
UserSchema.virtual("email").get(function () {
	if (this.emails.length) return this.emails[0]
	return null
})

/**
 * Returns an email object of {name, email} to send email to/from this user
 */
UserSchema.virtual("$email").get(function () {
	return {
		name: this.fullName || this.email,
		email: this.email,
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
 * Adds an email address of the user as pending and returns the email object if successfully created, null otherwise
 */
UserSchema.methods.addPendingEmail = async function (
	email,
	sendVerifEmail = true
) {
	email = normalizeEmailAddress(email)

	if (await this.model("User").findOne().byEmail(email)) return null

	let date = new Date(Date.now() - 60 * 60 * 1000)

	// Seach for an entry created less than an hour ago with the specified email address
	let emailVerif = await EmailVerification.findOne({
		_id: email,
		createdAt: { $gte: date },
	}).populate("user")

	// An entry exist
	if (emailVerif) {
		if (!emailVerif.user) await emailVerif.remove()
		if (emailVerif.user !== this._id) return null
	}
	// Delete it otherwise
	else await EmailVerification.deleteOne({ _id: email })

	emailVerif = new EmailVerification({
		_id: email,
		user: this._id,
	})

	await emailVerif.save()

	if (sendVerifEmail)
		await this.sendNotification(UserTemplates.ACTIVATE_EMAIL, {
			to: { name: this.fullName, email: email },
		})

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

	const verificationCode = { code: generateRandomCode(), createdAt: new Date() }

	this.mobilePhone = {
		number: number,
		status: "unverified",
		verificationCode: { code: generateRandomCode(), createdAt: new Date() },
	}

	await this.sendSMS(UserTemplates.VERIFY_MOBILE_PHONE, false)
}

/**
 * Delete the user's account
 */
UserSchema.methods.deleteAccount = async function () {
	await EmailVerification.deleteMany({ user: this._id })
	this.accountStatus = "deleted"
	this.password = undefined
	this.emails = undefined
	this.firstName = undefined
	this.lastName = undefined
	this.artistName = undefined
	this.avatar = undefined
	this.mobilePhone = undefined
	this.permissions = undefined
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
UserSchema.methods.createPasswordResetToken = function (expires = "2 hours") {
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
 * Decode a password reset token for the user
 */
UserSchema.methods.decodePasswordResetToken = function (token) {
	const data = JWT.decode(JWT_RESET_TYPE, token)
	if (!data || data.user_id !== this._id) return null
	return data
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

/*
 * Sends a notification to the user through the medium set in the user's preferences
 */
UserSchema.methods.sendNotification = async function (
	templateName,
	options = {}
) {
	await this.sendSMS(templateName)
	await this.sendEmail(templateName, options)
	await this.sendPush(templateName)
}

/**
 * Sends an SMS to the user
 */
UserSchema.methods.sendSMS = async function (
	templateName,
	verifiedOnly = true
) {
	const template = generateTemplate(templateName, "sms", this)

	if (
		!template ||
		!this.notifications[template.notificationType].includes("sms")
	)
		return null

	return await sendSMSTo(this, template.message, verifiedOnly)
}

/**
 * Sends an Email to the user
 */
UserSchema.methods.sendEmail = async function (templateName, options = {}) {
	const template = generateTemplate(templateName, "email", this, options)

	if (
		!template ||
		!this.notifications[template.notificationType].includes("email")
	)
		return null

	return await sendTemplateTo(template.id, this, options, template.data)
}

/**
 * Sends a Push notification to the user
 */
UserSchema.methods.sendPush = async function (templateName) {
	const template = generateTemplate(templateName, "push", this)

	if (
		!template ||
		!this.notifications[template.notificationType].includes("push")
	)
		return null

	return "push not implemented"
}

module.exports = mongoose.model("User", UserSchema)
