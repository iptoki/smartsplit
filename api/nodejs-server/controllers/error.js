module.exports = class APIError extends Error {
	constructor(status, message, ...args) {
		this.httpStatus = status
		super(message, ...args)
	}
}