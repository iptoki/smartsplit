const Constant = require("./constant")

const GST = 0.05

const PST = {
	AB: 0,
	BC: 0.07,
	MB: 0.07,
	NB: 0.01,
	NL: 0.01,
	NS: 0.01,
	NT: 0,
	NU: 0,
	ON: 0.08,
	PE: 0.01,
	QC: 0.09775,
	SK: 0.06,
	YT: 0,
}

class TaxRates extends Constant {
	static get GST() {
		return GST
	}
	static PST(stateCode) {
		if (PST[stateCode.toUpperCase()] === undefined)
			throw Error(stateCode.toUpperCase() + " is not a valid state code")
		return PST[stateCode.toUpperCase()]
	}
	static get list() {
		return [GST, PST]
	}
	static get constantName() {
		return "TaxRates"
	}
}

module.exports = TaxRates
