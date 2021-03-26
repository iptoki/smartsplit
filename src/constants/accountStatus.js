const Constant = require('./constant')

const INVALID = 'invalid'
const EMAIL_VERIFICATION_PENDING = 'email-verification-pending'
const ACTIVE = 'active'
const DELETED = 'deleted'

class AccountStatus extends Constant {
	static get INVALID() {
		return INVALID
	}
	static get EMAIL_VERIFICATION_PENDING() {
		return EMAIL_VERIFICATION_PENDING
	}
	static get ACTIVE() {
		return ACTIVE
	}
	static get DELETED() {
		return DELETED
	}

	static get list() {
		return [INVALID, EMAIL_VERIFICATION_PENDING, ACTIVE, DELETED]
	}

	static get activableStatus() {
		return [EMAIL_VERIFICATION_PENDING]
	}
	static get constantName() {
		return 'AccountStatus'
	}
}

module.exports = AccountStatus
