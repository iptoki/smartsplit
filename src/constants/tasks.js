const Constant = require('./constant')

const SOCAN = 'socan'
const SOCAN_DR = 'socanDr'
const SOPROQ = 'soproq'
const ARTISTI = 'artisti'
const BANQ = 'banq'

class TaskTypes extends Constant {
	static get SOCAN() {
		return SOCAN
	}
	static get SOCAN_DR() {
		return SOCAN_DR
	}
	static get SOPROQ() {
		return SOPROQ
	}
	static get ARTISTI() {
		return ARTISTI
	}
	static get BANQ() {
		return BANQ
	}
	static get list() {
		return [SOCAN, SOCAN_DR, SOPROQ, ARTISTI, BANQ]
	}
	static get constantName() {
		return 'TaskTypes'
	}
}

const UNREQUESTED = 'nonRequested'
const REQUESTED = 'requested'
const SMARTSPLIT = 'smartSplit'
const MANAGING_SOCIETY = 'managingSociety'
const COMPLETED = 'completed'
const PROBLEMATIC = 'problematic'
const CANCELED = 'canceled'

class TaskStatus extends Constant {
	static get UNREQUESTED() {
		return UNREQUESTED
	}
	static get REQUESTED() {
		return REQUESTED
	}
	static get SMARTSPLIT() {
		return SMARTSPLIT
	}
	static get MANAGING_SOCIETY() {
		return MANAGING_SOCIETY
	}
	static get COMPLETED() {
		return COMPLETED
	}
	static get PROBLEMATIC() {
		return PROBLEMATIC
	}
	static get CANCELED() {
		return CANCELED
	}
	static get list() {
		return [
			UNREQUESTED,
			REQUESTED,
			SMARTSPLIT,
			MANAGING_SOCIETY,
			COMPLETED,
			PROBLEMATIC,
			CANCELED,
		]
	}
	static get constantName() {
		return 'TaskStatus'
	}
}

module.exports = {
	Types: TaskTypes,
	Status: TaskStatus,
}
