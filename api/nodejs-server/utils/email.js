const axios = require('axios')

module.exports.sendEmail = async function(email) {
	await axios.post(
		'https://messaging-proto.smartsplit.org/sendEmail',
		[email]
	)
}
