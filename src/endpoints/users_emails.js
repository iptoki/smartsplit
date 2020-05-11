const api                       = require("../app").api
const { body }                  = require("../autoapi")
const User                      = require("../models/user")
const EmailVerification         = require("../models/emailVerification")
const JWTAuth                   = require("../service/JWTAuth")
const UserSchema                = require("../schemas/users")
const EmailSchema               = require("../schemas/emails")
const RequestUtil               = require("../utils/request")
const { normalizeEmailAddress } = require("../utils/email")


api.get("/users/{user_id}/emails", {
	tags: ["Emails"],
	parameters: [UserSchema.id],
	summary: "Get all the pending and activated emails of a user",
	hooks: { auth: true },
	responses: {
		200: EmailSchema.emails,
		404: UserSchema.UserNotFoundError,
	}
}, async function(req, res) {
	const user = await RequestUtil.getUserWithPendingEmails(req)
	
	if(!user)
		throw new UserSchema.UserNotFoundError({user_id: req.params.user_id})

	return user.emails.map(e => (
		{email: e, status: "active"})
	).concat(user.pendingEmails.map(e => (
		{email: e.email, status: "pending"})
	))
})


api.post("/users/{user_id}/emails", {
	tags: ["Emails"],
	parameters: [UserSchema.id],
	summary: "Link a new email as pending in a user account",
	hooks: { auth: true },
	requestBody: EmailSchema.createEmail,
	responses: {
		200: EmailSchema.emails,
		404: UserSchema.UserNotFoundError,
		409: EmailSchema.ConflictingEmailError,
	}
}, async function(req, res) {
	req.body.email = normalizeEmailAddress(req.body.email)
	
	const user = await RequestUtil.getUserWithPendingEmails(req)

	if(!user)
		throw new UserSchema.UserNotFoundError({user_id: req.params.user_id})

	const email = await user.addPendingEmail(req.body.email)

	if(!user.pendingEmails.find(item => item.email === email._id))
		user.pendingEmails.push(email)

	return user.emails.map(e => (
		{email: e, status: "active"})
	).concat(user.pendingEmails.map(e => (
		{email: e.email, status: "pending"})
	))
})


api.post("/users/{user_id}/emails/{email}", {
	tags: ["Emails"],
	parameters: [UserSchema.id, EmailSchema.email],
	summary: "Activate an email in the user profile",
	hooks: { auth: true },
	requestBody: EmailSchema.activateEmailSchema,
	responses: {
		200: { description: "Email successfully activated" },
		404: EmailSchema.EmailNotFoundError,
		409: EmailSchema.InvalidActivationTokenError,
		412: EmailSchema.EmailAlreadyActivatedError
	}
}, async function(req, res) {
	req.params.email = normalizeEmailAddress(req.params.email)

	const user = await RequestUtil.getUserWithPendingEmails(req)

	if(!user)
		throw new UserSchema.UserNotFoundError({user_id: req.params.user_id})

	if(user.emails.includes(req.params.email))
		throw new EmailSchema.EmailAlreadyActivatedError()

	const email = user.pendingEmails.find(item => item.email === req.params.email)

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

	res.status(200).end()
})


api.delete("/users/{user_id}/emails/{email}", {
	tags: ["Emails"],
	parameters: [UserSchema.id, EmailSchema.email],
	summary: "Delete an email from a user account",
	hooks: { auth: true },
	responses: {
		200: { description: "Email successfully deleted" },
		404: EmailSchema.EmailNotFoundError,
	}
}, async function(req, res) {
	req.params.email = normalizeEmailAddress(req.params.email)
	
	const user = await RequestUtil.getUserWithPendingEmails(req)
	
	if(!user)
		throw new UserSchema.UserNotFoundError({user_id: req.params.user_id})

	if(user.emails.includes(req.params.email)) {
		if(user.emails.length === 1)
			throw new EmailSchema.DeleteNotAllowedError()
		
		user.emails.splice(user.emails.indexOf(req.params.email), 1)
		await user.save()
	}
	else {
		if(!user.pendingEmails.find(item => item.email === req.params.email))
			throw new EmailSchema.EmailNotFoundError({
				user_id: user._id,
				email: req.params.email
			})

		await EmailVerification.deleteOne().byEmail(req.params.email)
	}
	res.status(200).end()
})
