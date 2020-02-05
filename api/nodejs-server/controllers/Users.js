const User = require("../models/user")
const RightHolder = require("../models/right-holder")

module.exports.createNewUser = async function(req, res) {
	const body = req.swagger.params["body"].value
	
	if(await User.findOne().byBody(body))
		return res.status(409).json({
			error: "A user with this email already exists"
		})
	
	const user = new User(body)
	
	if(body.rightHolder) {
		if(body.rightHolder && await RightHolder.findOne().byBody(body.rightHolder))
			return res.status(409).json({
				error: "There is already a right holder matching the input"
			})
		
		const rightHolder = new RightHolder(body.rightHolder)
		await rightHolder.save()
		user.rightHolders.push(rightHolder._id)
	}
	
	await user.setEmail(body.email, false /* on a déjà vérifié plus haut */)
	await user.setPassword(body.password)
	await user.save()
	
	user.emailWelcome()
		.catch(e => console.error(
			"Users.createNewUser",
			"Erreur lors de l'envoi du courriel de bienvenue",
			e
		))

	res.json(user)
}
