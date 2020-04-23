const api               = require("../app").api
const { body }          = require("../autoapi")
const User              = require("../models/user")
const EmailVerification = require("../models/emailVerification")
const JWTAuth           = require("../service/JWTAuth")
const UserSchema        = require("../schemas/users")
const EmailSchema       = require("../schemas/emails")


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
	const user = req.params.user_id === "session"
	           ? await req.auth.requireUser()
	           : await User.findById(req.params.user_id).populate("pendingEmails")
	
	if(!user)
		throw new UserSchema.UserNotFoundError({user_id: req.params.user_id})

	return user.emailList
})


api.post("/users/{user_id}/emails", {
	tags: ["Emails"],
	parameters: [UserSchema.id],
	summary: "Add a new email as pending in a user account",
	hooks: { auth: true },
	requestBody: EmailSchema.createEmail,
	responses: {
		200: EmailSchema.emails,
		404: UserSchema.UserNotFoundError,
		409: EmailSchema.ConflictingEmailError,
	}
}, async function(req, res) {
	const user = req.params.user_id === "session"
	           ? await req.auth.requireUser()
	           : await User.findById(req.params.user_id).populate("pendingEmails")
	
	if(!user)
		throw new UserSchema.UserNotFoundError({user_id: req.params.user_id})

	if(await User.findOne().byEmail(req.body.email) || await EmailVerification.findById(req.body.email))
		throw new EmailSchema.ConflictingEmailError({email: req.body.email})
	
	const email = new EmailVerification({
		_id: req.body.email,
		user_id: req.params.user_id
	})

	await email.save()	

	user.pendingEmails.push(email)

	return user.emailList
})


api.post("/users/{user_id}/emails/{email}", {
	tags: ["Emails"],
	parameters: [UserSchema.id, EmailSchema.emailParam],
	summary: "Activate an email in the user profile",
	hooks: { auth: true },
	responses: {
		200: EmailSchema.emails,
		404: UserSchema.UserNotFoundError
	}
}, async function(req, res) {
	
})



api.delete("/users/{user_id}/emails/{email}", {
	tags: ["Emails"],
	parameters: [UserSchema.id, EmailSchema.emailParam],
	summary: "Delete an email from a user account",
	hooks: { auth: true },
	responses: {
		200: EmailSchema.emails,
		404: UserSchema.UserNotFoundError
	}
}, async function(req, res) {
	
})
