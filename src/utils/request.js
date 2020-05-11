const User = require("../models/user")

/** 
 * Returns the User model instance from an http request
 */
async function getUser(req) {
	if(!req.params.user_id)
		throw new Error("Can't get a user without a user_id")
	
	const user = req.params.user_id === "session"
	           ? await req.auth.requireUser()
	           : await User.findById(req.params.user_id)
	return user           
}


/** 
 * Returns the User model instance populated with pendingEmails from an http request
 */
async function getUserWithPendingEmails(req) {
	user = await getUser(req)

    if(user)
		await user.populate("pendingEmails").execPopulate()   
	
	return user           
}

module.exports = { getUser, getUserWithPendingEmails }
