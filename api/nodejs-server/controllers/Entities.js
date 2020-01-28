const Entity = require("../models/entity")

module.exports.getAllEntities = async function(req, res) {
	res.json(await Entity.find())
}

module.exports.putUserInEntity = async function(req, res) {
	const body = req.swagger.params["body"].value
	let entity = await Entity.findOne({name: body.entite})

	if(!entity)
		entity = new Entity({name: body.entite, members: []})

	if(!entity.members.includes(body.username))
		entity.members.push(body.username)

	await entity.save()
	res.json(entity)
}
