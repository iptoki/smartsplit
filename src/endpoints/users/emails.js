// const api                       = require("../app").api
// const { body }                  = require("../autoapi")
// const User                      = require("../models/user")
// const EmailVerification         = require("../models/emailVerification")
// const JWTAuth                   = require("../service/JWTAuth")
// const UserSchema                = require("../schemas/users")
// const EmailSchema               = require("../schemas/emails")
// const RequestUtil               = require("../utils/request")
// const { normalizeEmailAddress } = require("../utils/email")


// async function getUserEmails(req, res) {
// 	const user = await RequestUtil.getUserWithPendingEmails(req)
	
// 	if(!user)
// 		throw new UserSchema.UserNotFoundError({user_id: req.params.user_id})

// 	return user.emails.map(e => (
// 		{email: e, status: "active"})
// 	).concat(user.pendingEmails.map(e => (
// 		{email: e.email, status: "pending"})
// 	))
// }


// async function createUserEmail(req, res) {
// 	req.body.email = normalizeEmailAddress(req.body.email)
	
// 	const user = await RequestUtil.getUserWithPendingEmails(req)

// 	if(!user)
// 		throw new UserSchema.UserNotFoundError({user_id: req.params.user_id})

// 	const email = await user.addPendingEmail(req.body.email)

// 	if(!user.pendingEmails.find(item => item.email === email._id))
// 		user.pendingEmails.push(email)

// 	return user.emails.map(e => (
// 		{email: e, status: "active"})
// 	).concat(user.pendingEmails.map(e => (
// 		{email: e.email, status: "pending"})
// 	))
// }


// async function activateUserEmail(req, res) {
// 	req.params.email = normalizeEmailAddress(req.params.email)

// 	const user = await RequestUtil.getUserWithPendingEmails(req)

// 	if(!user)
// 		throw new UserSchema.UserNotFoundError({user_id: req.params.user_id})

// 	if(user.emails.includes(req.params.email))
// 		throw new EmailSchema.EmailAlreadyActivatedError()

// 	const email = user.pendingEmails.find(item => item.email === req.params.email)

// 	if(!email)
// 		throw new EmailSchema.EmailNotFoundError({
// 			user_id: user._id,
// 			email: req.params.email
// 		})

// 	if(! await email.verifyActivationToken(req.body.token))
// 		throw new EmailSchema.InvalidActivationTokenError()

// 	await EmailVerification.deleteOne({_id: email._id})

// 	user.emails.push(email._id)
// 	await user.save()

// 	res.status(200).end()
// }


// async function deleteUserEmail(req, res) {
// 	req.params.email = normalizeEmailAddress(req.params.email)
	
// 	const user = await RequestUtil.getUserWithPendingEmails(req)
	
// 	if(!user)
// 		throw new UserSchema.UserNotFoundError({user_id: req.params.user_id})

// 	if(user.emails.includes(req.params.email)) {
// 		if(user.emails.length === 1)
// 			throw new EmailSchema.DeleteNotAllowedError()
		
// 		user.emails.splice(user.emails.indexOf(req.params.email), 1)
// 		await user.save()
// 	}
// 	else {
// 		if(!user.pendingEmails.find(item => item.email === req.params.email))
// 			throw new EmailSchema.EmailNotFoundError({
// 				user_id: user._id,
// 				email: req.params.email
// 			})

// 		await EmailVerification.deleteOne().byEmail(req.params.email)
// 	}
// 	res.status(200).end()
// }
