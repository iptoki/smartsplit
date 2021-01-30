const Constant = require("./constant")

const INSTRUMENT = "instrument"
const DIGITAL_DISTRIBUTOR = "digital-distributor"
const MUSICAL_GENRE = "musical-genre"
const CONTENT_LANGUAGE = "content-language"

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
		return [
			INSTRUMENT,
			DIGITAL_DISTRIBUTOR,
			MUSICAL_GENRE,
			CONTENT_LANGUAGE,
		]
	}
	static get constantName() {
		return "EntityTypes"
	}
}

module.exports = EntityTypes
