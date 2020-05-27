const { api, error } = require("../app")

module.exports = {
	
	ListNotFoundError:
		error("list_not_found", 404, "List not found"),
		
	ListEntityNotFoundError:
		error("list_entity_not_found", 404, "List Entity not found"),
	

	ConflictingListEntityError:
		error("conflicting_list_entity", 409, "A list entity with this ID already exists"),
	
}
