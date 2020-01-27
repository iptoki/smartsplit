const RightHolder = require('../models/right-holder')
const APIError = require("./error")

async function getRightHolderById(rightHolderId) {
	const rightHolder = await RightHolder.findById(rightHolderId)

	// TODO: Ajouter la vérification des permissions ici

	if(!rightHolder) throw new APIError(404, {
		error: "Right holder does not exist in database",
		rightHolderId
	})

	return rightHolder
}

function getRightHolderFromRequest(req, res) {
	return getRightHolderById(req.swagger.params["rightHolderId"].value)
}

module.exports.getAllRightHolders = async function(req, res) {
	// TODO: Cette méthode devrait probablement pas exister publiquement (sécurité)
	res.json(await RightHolder.find())
}

module.exports.getRightHolder = async function(req, res) {
	res.json(await getRightHolderFromRequest(req, res))
}

module.exports.deleteRightHolder = async function(req, res) {
	const rh = getRightHolderFromRequest(req, res)
	await rh.remove()
	res.json(rh)
}

module.exports.postRightHolder = async function(req, res) {
	const body = req.swagger.params["body"].value

	if(await RightHolder.findOne().byBody(body))
		return res.status(409).json({
			error: "There is already a right holder matching the input"
		})

	const rh = new RightHolder(body)
	await rh.save()
	res.json(rh)
}

module.exports.updateRightHolder = async function (req, res, next) {
	const rh = await getRightHolderFromRequest(req, res)
	Object.assign(rh, req.swagger.params["body"].value)
	await rh.save()
	res.json(rh)
}

const patch = require("./utils")(module.exports, getRightHolderFromRequest)
patch.replace("patchRightHolderArtistName",       "artistName"      )
patch.replace("patchRightHolderAvatarImage",      "avatarImage"     )
patch.replace("patchRightHolderEmail",            "email"           )
patch.replace("patchRightHolderRequestSource",    "requestSource"   )
patch.replace("patchRightHolderFirstName",        "firstName"       )
patch.replace("patchRightHolderIPI",              "ipi"             )
patch.replace("patchRightHolderJurisdiction",     "jurisdiction"    )
patch.replace("patchRightHolderLastName",         "lastName"        )
patch.merge  ("patchRightHolderSocialMediaLinks", "socialMediaLinks")
patch.concat ("patchRightHolderDefaultRoles",     "defaultRoles"    )
patch.concat ("patchRightHolderGroups",           "groups"          )
patch.replace("patchRightHolderWallet",           "wallet"          )

/**
 * Effectue une recherche d'ayant-droit par adresse courriel:
 *   {email: "user@example.com"} -> RightHolder
 */
module.exports.postEmailToRightHolderId = async function(req, res) {
	const rh = await RightHolder.findOne().byEmail(
		req.swagger.params["body"].value.email
	)

	if(rh)
		res.json(rh)
	else
		res.status(404).json({
			error: "There are no right holder using this email address"
		})
}
