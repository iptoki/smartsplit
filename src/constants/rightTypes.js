const Constant = require('./constant')

const COPYRIGHT = 'copyright'
const PERFORMANCE = 'performance'
const RECORDING = 'recording'
const LABEL = 'label'
const PRIVACY = 'privacy'

class RightTypes extends Constant {
	static get COPYRIGHT() {
		return COPYRIGHT
	}
	static get PERFORMANCE() {
		return PERFORMANCE
	}
	static get RECORDING() {
		return RECORDING
	}
	static get LABEL() {
		return LABEL
	}
	static get PRIVACY() {
		return PRIVACY
	}
	static get list() {
		return [COPYRIGHT, PERFORMANCE, RECORDING, LABEL, PRIVACY]
	}
	static get constantName() {
		return 'RightType'
	}
}

module.exports = RightTypes
