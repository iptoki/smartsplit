const Constant = require("./constant")

const INSTRUMENT = "instrument"
const DIGITAL_DISTRIBUTOR = "digitalDistributor"
const MUSICAL_GENRE = "musicalGenre"
const CONTENT_LANGUAGE = "contentLanguage"

class EntityTypes extends Constant {
	static get INSTRUMENT() {
		return INSTRUMENT
	}
	static get DIGITAL_DISTRIBUTOR() {
		return DIGITAL_DISTRIBUTOR
	}
	static get MUSICAL_GENRE() {
		return MUSICAL_GENRE
	}
	static get CONTENT_LANGUAGE() {
		return CONTENT_LANGUAGE
	}
	static get list() {
		return [INSTRUMENT, DIGITAL_DISTRIBUTOR, MUSICAL_GENRE, CONTENT_LANGUAGE]
	}
	static get constantName() {
		return "EntityTypes"
	}
}

module.exports = EntityTypes
