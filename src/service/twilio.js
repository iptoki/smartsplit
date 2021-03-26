const Config = require('../config')
const User = require('../models/user')

let client
try {
	client = require('twilio')(Config.twilio.accountSid, Config.twilio.authToken)
} catch (err) {
	console.error(
		`Invalid credentials for Twilio account, sending SMS won't work, check your config.js file: ${err}`
	)
}

/**
 * Sends an SMS to the specified number
 */
module.exports.sendSMS = async function (number, message) {
	return await client.messages.create({
		body: message,
		from: Config.twilio.phoneNumber,
		to: number,
	})
}

/**
 * Sends an SMS to a user and optionally check if his mobile phone is verified
 */
module.exports.sendSMSTo = async function (user, message, verifiedOnly = true) {
	if (!user.mobilePhone.number)
		throw new Error("User doesn't have a registered phone number")
	if (verifiedOnly && user.mobilePhone.status !== 'verified')
		throw new Error("User's mobile phone must be verified")

	return await client.messages.create({
		body: message,
		from: Config.twilio.phoneNumber,
		to: user.mobilePhone.number,
	})
}
