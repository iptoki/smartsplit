const Errors = require('../../errors')
const JWTAuth = require('../../service/JWTAuth')
const DocumentationSchema = require('../../schemas/documentation')

/************************ Routes ************************/

async function routes(fastify, options) {
	fastify.route({
		method: 'POST',
		url: '/workpieces/:workpiece_id/files/:file_id/blockchain/',
		schema: {
			tags: ['workpiece_protected_work'],
			description: 'Submit a workpiece file to the blockchain',
			params: {
				workpiece_id: { type: 'string' },
				file_id: { type: 'string' },
			},
			response: {
				200: DocumentationSchema.serialization.documentation,
			},
			security: [{ bearerAuth: [] }],
		},
		preValidation: JWTAuth.requireAuthUser,
		handler: submitToEtherum,
	})
}

/************************ Handlers ************************/

const { getWorkpiece, getWorkpieceAsOwner } = require('./workpieces')

const getWorkpieceFileLocation = function (workpiece, file_id) {
	let index = -1
	let type
	for (type of ['art', 'audio', 'scores', 'midi', 'lyrics']) {
		index = workpiece.documentation.files[type].indexOf(file_id)
		if (index >= 0) break
	}
	return { index, type }
}

const getWorkpieceFile = async function (workpiece, file_id) {
	const location = getWorkpieceFileLocation(workpiece, file_id)
	if (location.index < 0) throw Errors.WorkpieceFileNotFound
	await workpiece
		.populate(workpiece.documentation.getFilesPathsToPopulate())
		.execPopulate()
	return workpiece.documentation.files[location.type][location.index]
}

const submitToEtherum = async function (req, res) {
	const workpiece = await getWorkpieceAsOwner(req, res)
	const location = getWorkpieceFileLocation(workpiece, req.params.file_id)

	if (location.index < 0) throw Errors.WorkpieceFileNotFound

	const file = await workpiece.documentation.getFile(req.params.file_id)
	const fileInfo = file.metadata
	if (!['NONE', 'ERROR'].includes(fileInfo.ethereum.status))
		throw new Error(
			'A transaction is already pending or processed, refusing to submit again'
		)

	const web3 = require('../service/ethereum')

	try {
		let metadata =
			'\n' + `Title: ${file.filename}\n` + `Author: ${req.authUser.artistName}`

		function addMeta(key, hashes) {
			for (let hashType in HashModel) {
				metadata += `\n${key}.${hashType}: ${hashes[hashType]}`
			}
		}

		addMeta('File', fileInfo.hashes)

		const transaction = {
			to: web3.eth.defaultAccount,
			value: 0,
			data: '0x' + Buffer.from(metadata).toString('hex'),
			gas: 200000,
		}

		const receipt = await web3.eth.sendTransaction(transaction)

		fileInfo.ethereum.status = 'PROCESSING'
		fileInfo.ethereum.transactionId = receipt.transactionHash
		fileInfo.ethereum.error = null
	} catch (e) {
		console.error('Transaction Error:', e)
		fileInfo.ethereum.status = 'ERROR'
		fileInfo.ethereum.error = e.toString()
	}

	await file.save()

	return workpiece.documentation.files[location.type][location.index]
}

const deleteFile = async function (req, res) {
	const workpiece = await getWorkpieceAsOwner(req, res)
	const location = getWorkpieceFileLocation(workpiece, req.params.file_id)
	if (location.index < 0) throw Errors.WorkpieceFileNotFound
	await workpiece.documentation.deleteFile(req.params.file_id)
	await workpiece.save()
	res.code(204).send()
}

module.exports = routes
