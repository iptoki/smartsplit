class Constant {
	static get list() {
		return []
	}

	static isValid(constant) {
		return this.list.includes(constant)
	}

	static ensureValid(constant) {
		if (!this.isValid(constant))
			throw new Error(`'${constant}' is not a valid '${this.constantName}'`)
	}

	static get constantName() {
		return "Constant"
	}
}

module.exports = Constant
