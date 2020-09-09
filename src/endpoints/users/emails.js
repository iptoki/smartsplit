const EmailVerification = require("../../models/emailVerification")
const User = require("../../models/user")
const EmailSchema = require("../../schemas/emails")
const { normalizeEmailAddress } = require("../../utils/email")

async function getEmail() {
	const email = normalizeEmailAddress(this.req.params.email)
	console.log(email)
	if (await User.findOne().byEmail(email) || await EmailVerification.findById(email)) 
		this.res.status(204).send()

	this.res.status(404).send()
}

async function getUserEmails(user) {
	return user.emails
		.map((e) => ({ email: e, status: "active" }))
		.concat(
			user.pendingEmails.map((e) => ({
				email: e.email,
				status: "pending",
			}))
		)
}

async function createUserEmail(user) {
	const email = await user.addPendingEmail(this.req.body.email)
	if (!email)
		throw new EmailSchema.ConflictingEmailError({ email: this.req.body.email })

	return user.emails
		.map((e) => ({ email: e, status: "active" }))
		.concat(
			user.pendingEmails.map((e) => ({
				email: e.email,
				status: "pending",
			}))
		)
}

async function activateUserEmail(user) {
	if (user.emails.includes(normalizeEmailAddress(this.req.params.email)))
		throw new EmailSchema.EmailAlreadyActivatedError({
			email: this.req.params.email,
		})

	const email = user.pendingEmails.find(
		(item) => item.email === normalizeEmailAddress(this.req.params.email)
	)

	if (!email)
		throw new EmailSchema.EmailNotFoundError({
			user_id: user._id,
			email: this.req.params.email,
		})

	if (!(await email.verifyActivationToken(this.req.body.token)))
		throw new EmailSchema.InvalidActivationTokenError()

	await EmailVerification.deleteOne({ _id: email._id })

	user.emails.push(email._id)
	await user.save()

	this.res.status(204).end()
}

async function deleteUserEmail(user) {
	if (!(await user.removeEmail(this.req.params.email))) {
		if (!(await user.removePendingEmail(this.req.params.email))) {
			throw new EmailSchema.EmailNotFoundError({
				user_id: user._id,
				email: this.req.params.email,
			})
		}
	}

	this.res.status(204).end()
}

module.exports = {
	getEmail,
	getUserEmails,
	createUserEmail,
	activateUserEmail,
	deleteUserEmail,
}
