const Constant = require('./constant')

const GENERAL_INTERACTIONS = 'generalInteractions'
const ADMINISTRATIVE_MESSAGES = 'administrativeMessages'
const ACCOUNT_LOGIN = 'accountLogin'
const SMARTSPLIT_BLOG = 'smartsplitBlog'
const SMARTSPLIT_PROMOTIONS = 'smartsplitPromotions'
const PARTNER_PROMOTIONS = 'partnerPromotions'

class NotificationTypes extends Constant {
	static get GENERAL_INTERACTIONS() {
		return GENERAL_INTERACTIONS
	}
	static get ADMINISTRATIVE_MESSAGES() {
		return ADMINISTRATIVE_MESSAGES
	}
	static get ACCOUNT_LOGIN() {
		return ACCOUNT_LOGIN
	}
	static get SMARTSPLIT_BLOG() {
		return SMARTSPLIT_BLOG
	}
	static get SMARTSPLIT_PROMOTIONS() {
		return SMARTSPLIT_PROMOTIONS
	}
	static get PARTNER_PROMOTIONS() {
		return PARTNER_PROMOTIONS
	}
	static get list() {
		return [
			GENERAL_INTERACTIONS,
			ADMINISTRATIVE_MESSAGES,
			ACCOUNT_LOGIN,
			SMARTSPLIT_BLOG,
			SMARTSPLIT_PROMOTIONS,
			PARTNER_PROMOTIONS,
		]
	}
	static get mandatoryTypes() {
		return [GENERAL_INTERACTIONS, ADMINISTRATIVE_MESSAGES]
	}
	static get constantName() {
		return 'NotificationTypes'
	}
}

module.exports = NotificationTypes
