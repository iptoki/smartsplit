const Constant = require("./constant")

const COPYRIGHT = "copyright"
const INTERPRETATION = "interpretation"
const RECORDING = "recording"

class RightTypes extends Constant {
	static get COPYRIGHT() {
		return COPYRIGHT
	}
	static get INTERPRETATION() {
		return INTERPRETATION
	}
	static get RECORDING() {
		return RECORDING
	}
	static get list() {
		return [
			COPYRIGHT,
			INTERPRETATION,
			RECORDING,
		]
	}
	static get constantName() {
		return "RightType"
	}
}

module.exports = RightTypes
