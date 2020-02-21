const Media = require("../models/media")
const Proposal = require("../models/proposal")
const APIError = require("./error")
const jwt = require('jsonwebtoken');
const {getParameter} = require("../utils/utils")

// TODO: Middleware pour que req.media existe et éviter de répéter les appels à getMediaFromRequest?

/** Obtiens un média par son ID */
async function getMediaById(mediaId, cb) {
	let media = Media.findById(mediaId)
	
	if(cb)
		media = cb(media)
	
	media = await media
	
	if(!media) throw new APIError(404, {
		error: "This media does not exist in database",
		mediaId
	})

	return media
}

/** Obtiens un média depuis la requête Express */
async function getMediaFromRequest(req, res, cb) {
	const media = await getMediaById(req.swagger.params["mediaId"].value, cb)

	// if(media)
	// 	req.auth.requireRightHolder(
	// 		media.creator,
	// 		...media.rightHolders.filter(rh => rh.id)
	// 	)
	
	return media
}


/** Liste tous les médias */
module.exports.getAllMedia = async function(req, res) {
	res.json(await Media.find())
}

/** Obtiens un média en particulier */
module.exports.getMedia = async function(req, res) {
	res.json(await getMediaFromRequest(req, res))
}

/** Ajoute un média par son titre, type et créateur seulement */
// TODO: API Inutile, retirer
module.exports.putMedia = async function putMedia(req, res) {
	const body = req.swagger.params["body"].value
	const media = new Media({
		title: body.title,
		type: body.type,
		creator: body.creator,
	})

	await media.save()
	res.json({id: media._id})
}

/** Ajoute un média complet */
module.exports.postMedia = async function postMedia(req, res) {
	const body = req.swagger.params["body"].value
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
	res.json(media)
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
	const media = await getMediaFromRequest(
		req, res,
		media => media.populate("proposals")
	)

	if(!(await media.isSafeToDelete()))
		return res.status(403).json({
			error: "Cannot delete this media as it has an active or accepted proposal"
		})

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
	media.initiateurPropositionEnCours = body.rightHolderId
	await media.save()
	res.json(media)
}

/** Liste tous les médias dont l'utilisateur est le créateur ou a initié une proposition */
module.exports.listeCreateur = async function(req, res) {
	const rightHolderId = req.swagger.params["uuid"].value
	const medias = await Media
		.find({creator: rightHolderId})
		.sort({_id: 1})
		.populate("proposals")

	res.json(medias.map(media => {
		o = media.toJSON()
		o.propositions = media.proposals.sort((a, b) => b._d - a._d)
		return o
	}))
}

/** Liste tous les médias sur lesquels l'ayant-droit a collaboré */
module.exports.listeCollaborations = async function(req, res) {
	const rightHolderId = req.swagger.params["uuid"].value
	const medias = await Media
		.find({
			"rightHolders.id": rightHolderId,
			creator: {$ne: rightHolderId}
		})
		.sort({_id: 1})
		.populate("proposals")
		
	res.json(medias.map(media => {
		o = media.toJSON()
		o.propositions = media.proposals.sort((a, b) => b._d - a._d)
		return o
	}))
}

/** Retourne un jeton avec le niveau d'accès spécifié */
module.exports.jetonMedia = async function(req, res) {
	const media = await getMediaFromRequest(req, res)
	const access = req.swagger.params["acces"].value
	res.json(await media.createToken(access, "365 days"))
}


/** Duplique un média et ses propositions, et retourne le nouveau média */
module.exports.duplicateMedia = async function(req, res) {
	const body = req.swagger.params["body"].value
	const [media, user] = await Promise.all([
		getMediaFromRequest(
			req, res,
			media => media.populate("proposals")
		),
		req.auth.user
	])
	
	const newMedia = new Media({
		...media.toObject(),
		_id: undefined,
		creationDate: ""+Date.now()
	})
	
	const saving = [newMedia.save()]
	
	const lastProposal = await media.getLastProposal()
	if(body.proposals === true && lastProposal) {
		const newProposal = new Proposal({
			...lastProposal.toObject(),
			_id: undefined,
			mediaId: newMedia._id,
			creationDate: undefined,
			_d: undefined,
			initiatorUuid: user.rightHolders[0],
			initiatorName: `${user.firstName} ${user.lastName}`
		})
		
		newProposal.resetToDraft()
		saving.push(newProposal.save())
	}

	await Promise.all(saving)
	res.json(newMedia)
}
