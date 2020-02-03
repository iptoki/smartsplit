const Media = require("../models/media")
const APIError = require("./error")
const jwt = require('jsonwebtoken');
const {getParameter} = require("../utils/utils")

// TODO: Middleware pour que req.media existe et éviter de répéter les appels à getMediaFromRequest?

/** Obtiens un média par son ID */
async function getMediaById(mediaId) {
	const media = await Media.findById(mediaId)

	// TODO: Ajouter la vérification des permissions ici

	if(!media) throw new APIError(404, {
		error: "This media does not exist in database",
		mediaId
	})

	return media
}

/** Obtiens un média depuis la requête Express */
function getMediaFromRequest(req, res) {
	return getMediaById(req.swagger.params["mediaId"].value)
}


/** Liste tous les médias */
module.exports.getAllMedia = async function(req, res) {
	res.json(await Media.find())
}

/** Obtiens un média en particulier */
module.exports.getMedia = async function(req, res) {
	// FIXME: Item est une relique de DynamoDB qui s'est introduit dans l'API, puis le client
	res.json({Item: await getMediaFromRequest(req, res)})
}

/** Ajoute un média par son titre, type et créateur seulement */
module.exports.putMedia = async function putMedia(req, res) {
	const body = req.swagger.params["body"].value
	const media = new Media({
		title: body.title,
		type: body.type,
		creator: body.creator,
	})

	await media.save()
	res.json(media)
}

/** Ajoute un média complet */
module.exports.postMedia = async function postMedia(req, res) {
	const body = req.swagger.params["body"].value

	// res.json(await Promise.all(body.map(async (inputMedia) => {
	// 	if(await Media.findOne().byBody(inputMedia))
	// 		return res.status(409).json({
	// 			error: "Can't add this media because it already exists",
	// 			media: inputMedia
	// 		})

	// 	const media = new Media(inputMedia)
	// 	await media.save()
	// 	return media
	// })))

	// FIXME: Cette section accept un élément dans un array, et le retourne sous la clé "Attributes". C'est une relique de DynamoDB qui s'est propagée dans l'API et le client

	let media = null

	if(body.mediaId) {
		media = await getMediaById(body.mediaId)
		Object.assign(media, body)
	} else {
		if(await Media.findOne().byBody(body))
			return res.status(409).json({
				error: "Can't add this media because it already exists",
				media: body
			})

		media = new Media(body)
	}

	await media.save()
	res.json({Attributes: media.toJSON()}) 
}

/** Mets à jours un média existant */
module.exports.updateMedia = async function updateMedia(req, res) {
	const media = await getMediaFromRequest(req, res)
	Object.assign(media, req.swagger.params["body"].value[0])
	await media.save()
	res.json(media)
}

/** Supprime un média */
module.exports.deleteMedia = async function deleteMedia(req, res) {
	const media = await getMediaFromRequest(req, res)
	await media.remove()
	res.json(media)
}

// Génération des méthodes PATCH pour chaque champ
const patch = require("./utils")(module.exports, getMediaFromRequest)
patch.replace("patchMediaAlbum",                 "album"                )
patch.replace("patchMediaArtist",                "artist"               )
patch.replace("patchMediaDuration",              "msDuration"           )
patch.replace("patchMediaGenre",                 "genre"                )
patch.replace("patchMediaISRC",                  "isrc"                 )
patch.replace("patchMediaLyrics",                "lyrics"               )
patch.merge  ("patchMediaPlaylistLinks",         "playlistLinks"        )
patch.merge  ("patchMediaPressArticleLinks",     "pressArticleLinks"    )
patch.replace("patchMediaPublisher",             "publisher"            )
patch.replace("patchMediaFiles",                 "files"                )
patch.merge  ("patchMediaSocialMediaLinks",      "socialMediaLinks"     )
patch.merge  ("patchMediaStreamingServiceLinks", "streamingServiceLinks")
patch.replace("patchMediaTitle",                 "title"                )
patch.replace("patchMediaUPC",                   "upc"                  )
patch.replace("patchModificationDate",           "modificationDate"     )
patch.replace("patchPublishDate",                "publishDate"          )


/** Décode le jeton d'un média et retourne son contenu */
module.exports.decodeMedia = async function decodeMedia(req, res) {
	const body = req.swagger.params['body'].value
	const token = body.token || body.jeton

	try {
		const data = await Media.decodeToken(token)
		res.json(data && data.data)
	} catch(e) {
		res.status(400).json({
			error: "Invalid media token received"
		})
	}
}

/** Partage le média par courriel */
module.exports.shareMedia = async function shareMedia(req, res) {
	const body = req.swagger.params["body"].value
	const media = await getMediaById(body.mediaId)

	await media.shareByEmail(
		`${body.prenom} ${body.nom}`,
		body.courriel,
		body.acces,
		"365 days",
		body.contexte
	)

	res.json(true)
}

/** Définis l'ayant-droit de la dernière proposition */
module.exports.setMediaProposalInitiator = async function(req, res) {
	const body = req.swagger.params["body"].value
	const media = await getMediaFromRequest(req, res)
	media.initiateurPropositionEnCours = body.rightHolderid
	await media.save()
	res.json(media)
}

/** Liste tous les médias dont l'utilisateur est le créateur ou a initié une proposition */
module.exports.listeCreateur = async function(req, res) {
	const rightHolderId = req.swagger.params["uuid"].value
	console.warn("UNIMPLEMENTED", "Media.listeCreateur", "stub implementation")

	res.json((await Media.find({creator: rightHolderId})).map(o => {
		o = o.toJSON()
		o.propositions = []
		return o
	}))
}

/** Liste tous les médias sur lesquels l'ayant-droit a collaboré */
module.exports.listeCollaborations = async function(req, res) {
	console.warn("UNIMPLEMENTED", "Media.listeCollaborations", "stub implementation")
	res.json([])
}

/** Retourne un jeton avec le niveau d'accès spécifié */
module.exports.jetonMedia = async function(req, res) {
	const media = await getMediaFromRequest(req, res)
	const access = req.swagger.params["acces"].value
	// res.json(await media.createToken(access, "365 days"))
	// FIXME: La version DynamoDB retourne du texte brut
	res.end(await media.createToken(access, "365 days"))
}