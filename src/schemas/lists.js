const { api, error } = require("../app")

module.exports = {
	
	ListEntityNotFoundError:
		error("list_entity_not_found", 404, "List Entity not found"),
	
}
