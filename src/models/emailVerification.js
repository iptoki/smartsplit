const mongoose = require('mongoose')
const JWT = require('../utils/jwt')
const { normalizeEmailAddress } = require('../utils/email')

const JWT_ACTIVATE_TYPE = 'user:activate'
/**
 * Represents an email with pending verification in the system
 */
const EmailVerificationSchema = new mongoose.Schema({
	_id: {
		type: String,
		alias: 'email',
		lowercase: true,
		trim: true,
	},

	user: {
		type: String,
		ref: 'User',
	},

	createdAt: {
		type: Date,
		expires: '2w', // Two weeks
		default: Date.now,
	},
})

/**
 * Looks up the database for emails by user_id
 */
EmailVerificationSchema.query.byUserId = function (user_id) {
	return this.where({
		user_id: user_id,
	})
}

/**
 * Looks up the database for emails by email
 */
EmailVerificationSchema.query.byEmail = function (email) {
	return this.where({
		_id: normalizeEmailAddress(email),
	})
}

/**
 * Looks up the database for emails by email and user id
 */
EmailVerificationSchema.query.byEmailUserId = function (email, user_id) {
	return this.where({
		_id: normalizeEmailAddress(email),
		user: user_id,
	})
}

/**
 * Looks up an email by activation token.
 */
EmailVerificationSchema.query.byActivationToken = async function (
	token,
	checkPassword = true
) {
	const data = JWT.decode(JWT_ACTIVATE_TYPE, token)

	if (!data) return this.where({ _id: false }).skip(1).limit(0)

	const email = await this.where({
		_id: data.user_email,
		user: data.user_id,
	}).populate('user')

	if (checkPassword && (!email || email.user.password !== data.user_password))
		return this.where({ _id: false }).skip(1).limit(0)

	return email
}

module.exports = mongoose.model('EmailVerification', EmailVerificationSchema)
