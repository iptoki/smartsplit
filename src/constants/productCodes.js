const Constant = require("./constant")

const SOCAN_SUBMIT = "SOCAN_SUBMIT"
const RIGHT_SPLIT_DOWNLOAD = "RIGHT_SPLIT_DOWNLOAD"
const RIGHT_SPLIT_CONTRACT = "RIGHT_SPLIT_CONTRACT"
const PROTECT_WORKPIECE = "PROTECT_WORKPIECE"

class ProductCodes extends Constant {
	static get SOCAN_SUBMIT() {
		return SOCAN_SUBMIT
	}
	static get RIGHT_SPLIT_DOWNLOAD() {
		return RIGHT_SPLIT_DOWNLOAD
	}
	static get RIGHT_SPLIT_CONTRACT() {
		return RIGHT_SPLIT_CONTRACT
	}
	static get PROTECT_WORKPIECE() {
		return PROTECT_WORKPIECE
	}
	static get list() {
		return [
			SOCAN_SUBMIT,
			RIGHT_SPLIT_DOWNLOAD,
			RIGHT_SPLIT_CONTRACT,
			PROTECT_WORKPIECE,
		]
	}
	static get constantName() {
		return "ProductCodes"
	}
}

module.exports = ProductCodes
