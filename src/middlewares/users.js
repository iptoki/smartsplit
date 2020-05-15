const User = require("../models/user")
const UserSchema = require("../schemas/users")

async function loadUser(req, res) {
	let user

	if(req.params.user_id){
		user = req.params.user_id === "session"
	         ? await req.auth.requireUser()
	         : await User.findById(req.params.user_id)
	}

	if(!user)
		throw new UserSchema.UserNotFoundError({ user_id: req.params.user_id })

	return { req, res, user }
}

async function loadUserWithPendingEmails(req, res) {
	const data = loadUser(req, res)
	await data.user.populate('pendingEmails').execPopulate()
	return data
}

async function requireUser(req, res) {
	return { req, res, user: await req.auth.requireUser() }
}

async function requireAdmin(req, res) {
	return { req, res, admin: await req.auth.requireAdmin() }
}

module.exports = {
	loadUser,
	loadUserWithPendingEmails,
	requireUser,
	requireAdmin,
}