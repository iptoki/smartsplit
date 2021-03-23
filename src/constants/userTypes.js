const Constant = require("./constant")

const LOGISTIC = "logistic"
const ADMIN = "admin"

class UserTypes extends Constant {
	static get LOGISTIC() {
		return LOGISTIC
	}
	static get ADMIN() {
		return ADMIN
	}
	static get list() {
		return [LOGISTIC, ADMIN]
	}
	static get constantName() {
		return "UserTypes"
	}
}

module.exports = UserTypes
