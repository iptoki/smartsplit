const mongoose = require("mongoose")
const BaseModel = require("./base")
const uuidv1 = require('uuid/v1')

const PaymentsSchema = new mongoose.Schema({
	_id: {type: String, alias: "id", default: uuidv1},
	amount: Number,
	payee: String,
	transactionId: String,
	transactionHash: String,
}, BaseModel.defaultOptions)

PaymentsSchema.query.byBody = function(body) {
	return this.where({_id: body.id})
}

module.exports = mongoose.model("Payment", PaymentsSchema)