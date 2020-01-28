module.exports = class APIError extends Error {
	constructor(status, data, ...args) {
		super(data.error || "Internal Server Error", ...args)
		this.httpStatus = status
		this.jsonError = data
	}
}