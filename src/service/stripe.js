const Config = require("../config")

const stripe = require("stripe")(Config.stripe.apikey)

const getNewStripeCustomerId = async function () {
	const customer = await stripe.customers.create()
	return customer.id
}

const createPaymentIntent = async function (amount, customerId) {
	return await stripe.paymentIntents.create({
		amount: Math.round(amount * 100),
		currency: "cad",
		customer: customerId,
	})
}

module.exports = {
	getNewStripeCustomerId,
	createPaymentIntent,
}
