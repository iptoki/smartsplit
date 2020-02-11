const ProtectedWork = require("../models/protected-work")
const APIError = require("./error")


async function getWorkById(id) {
	const work = ProtectedWork.findById(id)

	if(!work) throw new APIError(404, {
		error: "There is no protected work with this ID",
		protectedWorkId: id
	})

	return work
}

async function getWorkFromRequest(req, res) {
	const work = getWorkById(req.swagger.params["id"].value)

	if(work && work.rightHolderId)
		req.auth.requireRightHolder(work.rightHolderId)

	return work
}

module.exports.postWork = async function(req, res) {
	const body = req.swagger.params["body"].value

	const work = new ProtectedWork()

	for(let k of ["title", "artistName", "rightHolderId", "mediaId"])
		work[k] = body[k]

	if(body.metadata && "content" in body.metadata)
		work.setMetadata(body.metadata.content)
	
	await work.save()

	res.json(work)
}

module.exports.getWork = async function(req, res) {
	const work = await getWorkFromRequest(req, res)
	await work.updateEthereumStatus()
	res.json(work)
}

module.exports.putWorkFile = async function(req, res) {
	const id = req.swagger.params["id"].value
	const file = req.swagger.params["file"].value
	
	const work = await getWorkFromRequest(req, res)

	if(work.final)
		return res.status(409).json({
			error: "This work has already been submitted to the blockchain and cannot be modified"
		})

	work.setFileData(file.originalname, file.buffer)
	await work.save()
	
	res.json(work)
}

module.exports.postWorkToEthereum = async function(req, res) {
	const work = await getWorkFromRequest(req, res)
	await work.submitToEthereum()
	res.json(work)
}