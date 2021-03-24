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
	static PST(stateCode) {
		return stateCode.toUpperCase() === "QC" ? QST : 0
	}
	static get list() {
		return [GST, QST]
	}
	static get constantName() {
		return "TaxRates"
	}
}

module.exports = TaxRates
