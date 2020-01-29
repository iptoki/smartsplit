const axios = require('axios')

module.exports.sendEmail = async function(email) {
	await axios.post(
		'http://messaging.smartsplit.org:3034/sendEmail',
		[email]
	)
}
