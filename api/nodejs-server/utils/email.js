const axios = require('axios')

module.exports.sendEmail = async function(email) {
	await axios.post(
		'https://messaging-dev.smartsplit.org/sendEmail',
		[email]
	)
}
