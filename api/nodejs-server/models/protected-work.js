const mongoose = require("mongoose")
const uuidv1 = require("uuid/v1")
const BaseModel = require("./base")
const crypto = require("crypto")

const HashModel = {
	md5: String,
	sha1: String,
	sha512: String,
	// keccak512: String, // Future proofing?
}

const ProtectedWorkSchema = new mongoose.Schema({
	_id: {
		type: String,
		default: uuidv1,
		alias: "protectedWorkId"
	},
	title: String,
	artistName: String,
	rightHolderId: {type: String, ref: "RightHolder"},
	mediaId: {type: String, ref: "Media"},
	file: {
		name: String,
		url: String,
		hash: HashModel
	},
	metadata: {
		content: String,
		hash: HashModel
	},
	final: {type: Boolean, default: false},
	ethereum: {
		status: {
			type: String,
			default: "NONE",
			enum: ["NONE", "PROCESSING", "PROCESSED", "ERROR"]
		},
		transactionId: String,
		error: String
	}
}, BaseModel.defaultOptions)


/** Définis les hash dans un object, en fonction de données en entrée */
function setHashes(hashes, data) {
	Object.keys(HashModel).forEach(hashType => {
		const hash = crypto.createHash(hashType)
		hash.update(data)
		hashes[hashType] = hash.digest("hex")
	})
}

ProtectedWorkSchema.methods.setFileData = function(filename, data) {
	this.errorIfMutateFinal()

	this.file = {
		name: filename,
		url: null,
		hash: {}
	}
	
	setHashes(this.file.hash, data)
}

ProtectedWorkSchema.methods.setMetadata = function(metadata) {
	this.errorIfMutateFinal()

	this.metadata = {
		content: metadata,
		hash: {}
	}

	setHashes(this.metadata.hash, metadata)
}

ProtectedWorkSchema.methods.updateEthereumStatus = async function() {
	if(!this.ethereum.transactionId || this.ethereum.status !== "PROCESSING")
		return

	const web3 = require("../service/ethereum")
	const receipt = await web3.eth.getTransaction(this.ethereum.transactionId)

	if(receipt.blockHash !== null) {
		this.ethereum.status = "PROCESSED"
		await this.save()
	}
}

ProtectedWorkSchema.methods.submitToEthereum = async function() {
	if(!["NONE", "ERROR"].includes(this.ethereum.status))
		throw new Error("A transaction is already pending or processed, refusing to submit again")

	const web3 = require("../service/ethereum")

	try {
		let metadata = "\n"
			+ `Title: ${this.title}\n`
			+ `Author: ${this.artistName}`

		function addMeta(key, hashes) {
			for(let hashType in HashModel) {
				metadata += `\n${key}.${hashType}: ${hashes[hashType]}`
			}
		}

		addMeta("File", this.file.hash)
		addMeta("Metadata", this.metadata.hash)

		const transaction = {
			to: web3.eth.defaultAccount,
			value: 0,
			data: "0x" + Buffer.from(metadata).toString("hex"),
			gas: 200000
		}

		const receipt = await web3.eth.sendTransaction(transaction)
		
		this.ethereum.status = "PROCESSING"
		this.ethereum.transactionId = receipt.transactionHash
		this.ethereum.error = null
	} catch(e) {
		console.error("Transaction Error:", e)
		this.ethereum.status = "ERROR"
		this.ethereum.error = e.toString()
	}

	this.final = true
	await this.save()
}

module.exports = mongoose.model("ProtectedWork", ProtectedWorkSchema)
