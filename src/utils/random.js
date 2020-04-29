const crypto = require("crypto")


/**
 * Returns a pseudo random code of 6 to 8 digits ranging from 100000 to 99999999
 */
module.exports.generateRandomCode = function() {
	const buf = crypto.randomBytes(4)
	const code = (parseInt(buf.toString('hex',16)) % 99900000) + 100000
	return code.toString()
}
