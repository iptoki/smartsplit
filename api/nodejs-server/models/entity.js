const mongoose = require("mongoose")
const BaseModel = require("./base")
const uuidv1 = require('uuid/v1')

const EntitySchema = new mongoose.Schema({
	_id: { type: String, alias: "uuid", default: uuidv1},
	name: String,
	members: [String]
}, BaseModel.defaultOptions)

module.exports = mongoose.model("Entity", EntitySchema)