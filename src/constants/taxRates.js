const Constant = require("./constant")

const GST = 0.05
const QST = 0.09775

class TaxRates extends Constant {
	static get GST() {
		return GST
	}
	static get QST() {
		return QST
	}
	static get RIGHT_SPLIT_CONTRACT() {
		return RIGHT_SPLIT_CONTRACT
	}
	static get PROTECT_WORKPIECE() {
		return PROTECT_WORKPIECE
	}
	static get list() {
		return [GST, QST]
	}
	static get constantName() {
		return "TaxRates"
	}
}

module.exports = TaxRates
