const User = require("../models/user")
const { normalizeEmailAddress } = require("../utils/email")

/** 
 * Returns the User model instance from an http request
 */
module.exports.getUser = async function(req) {
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
module.exports.getUserWithPendingEmails = async function(req) {
	if(!req.params.user_id)
		throw new Error("Can't get a user without a user_id")
	
	if(req.params.email) 
		req.params.email = normalizeEmailAddress(req.params.email)
	if(req.body.email)
		req.body.email = normalizeEmailAddress(req.body.email)

	const user = req.params.user_id === "session"
	           ? await req.auth.requireUser()
	           : await User.findById(req.params.user_id)
    if(user)
		await user.populate("pendingEmails").execPopulate()   
	
	return user           
}
