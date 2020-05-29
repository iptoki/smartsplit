const { api, error } = require("../app");

module.exports = {
  list_type: api.param("list_type", {
    in: "path",
    name: "list_type",
    description: "The type of the list",
    example: "digital-distributors",
  }),

  entity_id: api.param("entity_id", {
    in: "path",
    name: "entity_id",
    description: "The ID of a list entity",
    example: "123",
  }),

  ListNotFoundError: error("list_not_found", 404, "List not found"),

  ListEntityNotFoundError: error(
    "list_entity_not_found",
    404,
    "List Entity not found"
  ),

  ConflictingListEntityError: error(
    "conflicting_list_entity",
    409,
    "A list entity with this ID already exists"
  ),
};
