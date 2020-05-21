const User = require("../models/user")
const UserSchema = require("../schemas/users")
const { requireUser } = require("../service/JWTAuth")

async function loadUser() {
	const user = this.req.params.user_id === "session"
	           ? await requireUser.call(this)
	           : await User.findById(this.req.params.user_id)

	if(!user)
		throw new UserSchema.UserNotFoundError({user_id: this.req.params.user_id})

	this.user = user
	return user
}

async function loadUserWithPendingEmails() {
	await loadUser.call(this)
	await this.user.populate("pendingEmails").execPopulate()
	return this.user
}


module.exports = {
	loadUser,
	loadUserWithPendingEmails,
}
