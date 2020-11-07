const Constant = require("./constant")

const INVALID = "invalid"
const EMAIL_VERIFICATION_PENDING = "email-verification-pending"
const SPLIT_INVITED = "split-invited"
const ACTIVE = "active"
const DELETED = "deleted"
const CONTRIBUTOR = "contributor"

class AccountStatus extends Constant {
	static get INVALID() {
		return INVALID
	}
	static get EMAIL_VERIFICATION_PENDING() {
		return EMAIL_VERIFICATION_PENDING
	}
	static get SPLIT_INVITED() {
		return SPLIT_INVITED
	}
	static get ACTIVE() {
		return ACTIVE
	}
	static get DELETED() {
		return DELETED
	}
	static get CONTRIBUTOR() {
		return CONTRIBUTOR
	}

	static get list() {
		return [
			INVALID,
			EMAIL_VERIFICATION_PENDING,
			SPLIT_INVITED,
			ACTIVE,
			DELETED,
			CONTRIBUTOR,
		]
	}

	static get activableStatus() {
		return [EMAIL_VERIFICATION_PENDING, SPLIT_INVITED, CONTRIBUTOR]
	}
	static get constantName() {
		return "AccountStatus"
	}
}

module.exports = AccountStatus
