const bcrypt = require("bcrypt")
const SALT_ROUNDS = 12

/** Hashe le mot de passe de l'utilisateur avec bcrypt */
module.exports.hash = async function(password) {
	return await bcrypt.hash(password, SALT_ROUNDS)
}

/** Vérifie le mot de passe de l'utilisateur avec bcrypt */
module.exports.verify = async function(password, hash) {
	return await bcrypt.compare(password, hash)
}
