const Purchase = require('../models/purchase')
const { PaymentTemplates } = require('../models/notificationTemplates')
const Stripe = require('../service/stripe')

async function routes(fastify, options) {
	fastify.addContentTypeParser(
		'application/json',
		{ parseAs: 'buffer' },
		function (req, body, done) {
			try {
				var newBody = {
					raw: body,
				}
				done(null, newBody)
			} catch (error) {
				error.statusCode = 400
				done(error, undefined)
			}
		}
	)

	fastify.route({
		method: 'POST',
		url: '/purchases/stripe/webhook/',
		schema: {
			tags: ['purchases'],
			description: "Stripe's webhook to receive event such as payment success",
			response: {
				200: {},
			},
		},
		handler: stripeEventHandler,
	})
}

const stripeEventHandler = async function (req, res) {
	await Stripe.verifyEventSignature(
		req.body.raw,
		req.headers['stripe-signature'],
		'whsec_txRlWnytXeWKViCRZnFLTJH7I5wMxtN1'
	)

	const event = JSON.parse(req.body.raw.toString())
	const paymentIntent = event.data.object
	const purchase = await Purchase.ensureExistsAndRetrieve(
		{ payment_id: paymentIntent.id },
		['user', 'workpiece']
	)

	if (event.type === 'payment_intent.succeeded') {
		purchase.status = 'succeeded'
		purchase.purchaseDate = Date.now()
		purchase.user.sendNotification(PaymentTemplates.PRODUCT_PURCHASE_INVOICE, {
			purchase,
		})
	} else if (event.type === 'payment_intent.payment_failed')
		purchase.status = 'failed'
	else if (event.type === 'payment_intent.canceled')
		purchase.status = 'canceled'

	await purchase.save()
	res.code(200).send()
}

module.exports = routes
