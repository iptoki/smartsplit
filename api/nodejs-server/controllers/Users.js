const User = require("../models/user")
const RightHolder = require("../models/right-holder")
const Entity = require("../models/entity")

/** Crée un nouvel utilisateur et son ayant droit correspondant */
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
		
		await Entity.addMemberInMany(rightHolder._id, ...rightHolder.groups)
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

/** Envoie le courriel de réinitialisation de mot de passe */
module.exports.doPasswordReset = async function(req, res) {
	const body = req.swagger.params["body"].value
	const user = await User.findOne().byEmail(body.email)

	if(!user)
		return res.json(false)

	user.requestSource = body.requestSource || "smartsplit"
	console.log(
		"réinitialisation de mot de passe",
		user._id, user.email,
		await user.createPasswordResetToken("2 hours")
	)
	// TODO: Mettre à jours serveur de messagerie
	// await user.emailPasswordReset()
	res.json(true)
}
