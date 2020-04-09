const bcrypt = require("bcrypt")
const SALT_ROUNDS = 12

/**
 * Hashes she user's password using the preferred hashing method.
 * 
 * Currently bcrypt
 */
module.exports.hash = async function(password) {
	return await bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Verifies the user's password matches a given hash
 */
module.exports.verify = async function(password, hash) {
	return await bcrypt.compare(password, hash)
}
