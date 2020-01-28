const Payment = require("../models/payment")
const APIError = require("./error")

/** Obtiens un paiement par son ID */
async function getPaymentById(paymentId) {
	const payment = await Payment.findById(paymentId)

	// TODO: Ajouter la vérification des permissions ici

	if(!payment) throw new APIError(404, {
		error: "This payment does not exist in database",
		id: paymentId
	})

	return payment
}

/** Obtiens un paiement depuis la requête Express */
function getPaymentFromRequest(req, res) {
	return getPaymentById(req.swagger.params["id"].value)
}


module.exports.getAllPayments = async function(req, res) {
	res.json(await Payment.find())
}

module.exports.getPayment = async function(req, res) {
	res.json(await getPaymentFromRequest(req, res))
}

module.exports.postPayment = async function(req, res) {
	const body = req.swagger.params['body'].value;
	
	if(await Payment.findOne().byBody(body))
		return res.status(409).json({
			error: "Can't add this payment because it already exists",
			id: body.id
		})

	const payment = new Payment(body)
	await payment.save()
	res.json(payment)
}

module.exports.updatePayment = async function(req, res) {
	const payment = await getPaymentFromRequest(req, res)
	Object.assign(payment, req.swagger.params["body"].value)
	await payment.save()
	res.json(payment)
}

module.exports.deletePayment = async function(req, res) {
	const payment = await getPaymentFromRequest(req, res)
	await payment.remove()
	res.json(payment)
}

const patch = require("./utils")(module.exports, getPaymentFromRequest)
patch.replace("patchPaymentTransactionHash", "transactionHash")
patch.replace("patchPaymentTransactionID", "transactionId")
