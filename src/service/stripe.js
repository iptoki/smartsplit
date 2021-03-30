const Config = require('../config')
const { WebhookSignatureVerificationFailed } = require('../errors')
const stripe = require('stripe')(Config.stripe.apiKey)

const createCustomer = async function (user_id) {
	const customer = await stripe.customers.create({ metadata: { user_id } })
	return customer.id
}

const createPaymentIntent = async function (amount, customerId) {
	return await stripe.paymentIntents.create({
		amount: Math.round(amount * 100),
		currency: 'cad',
		customer: customerId,
	})
}

const verifyEventSignature = async function (payload, signature, secret) {
	try {
		event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret)
	} catch (err) {
		console.log(`Webhook signature verification failed.`, err.message)
		throw WebhookSignatureVerificationFailed
	}
}

module.exports = {
	createCustomer,
	createPaymentIntent,
	verifyEventSignature,
}
