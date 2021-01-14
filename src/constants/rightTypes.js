const Constant = require("./constant")

const COPYRIGHT = "copyright"
const PERFORMANCE = "performance"
const RECORDING = "recording"

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
	static get list() {
		return [COPYRIGHT, PERFORMANCE, RECORDING]
	}
	static get constantName() {
		return "RightType"
	}
}

module.exports = RightTypes
