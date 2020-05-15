const EmailVerification         = require("../../models/emailVerification")
const EmailSchema               = require("../../schemas/emails")
const { normalizeEmailAddress } = require("../../utils/email")


async function getUserEmails({req, res, user}) {
	return user.emails.map(e => (
		{email: e, status: "active"})
	).concat(user.pendingEmails.map(e => (
		{email: e.email, status: "pending"})
	))
}


async function createUserEmail({req, res, user}) {
	const email = await user.addPendingEmail(req.body.email)

	return user.emails.map(e => (
		{email: e, status: "active"})
	).concat(user.pendingEmails.map(e => (
		{email: e.email, status: "pending"})
	))
}


async function activateUserEmail({req, res, user}) {
	const email = user.pendingEmails.find(
		item => item.email === normalizeEmailAddress(req.params.email)
	)

	if(!email)
		throw new EmailSchema.EmailNotFoundError({
			user_id: user._id,
			email: req.params.email
		})

	if(! await email.verifyActivationToken(req.body.token))
		throw new EmailSchema.InvalidActivationTokenError()

	await EmailVerification.deleteOne({_id: email._id})

	user.emails.push(email._id)
	await user.save()

	res.status(204).end()
}


async function deleteUserEmail({req, res, user}) {
	if(! await user.removeEmail(req.body.email)) {
		if(! await user.removePendingEmail(req.body.email)) {
			throw new EmailSchema.EmailNotFoundError({
				user_id: user._id,
				email: req.params.email
			})
		}
	} 
	
	res.status(204).end()
}


module.exports = {
	getUserEmails,
	createUserEmail,
	activateUserEmail,
	deleteUserEmail,
}