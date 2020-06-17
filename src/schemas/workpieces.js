const { api, error } = require("../app")

module.exports = {
	workpiece_id: api.param("workpiece_id", {
		in: "path",
		name: "workpiece_id",
		description: "The ID of a workpiece",
		example: "e87b56ee-1ca0-4ec7-8393-e18dc7415041",
	}),

	WorkpieceNotFoundError: error("workpiece_not_found", 404, "Workpiece not found"),

	ConflictingRightSplitStateError: error(
		"conflicting_right_split_state",
		409,
		"The current state of the right split does not allow this kind of operation"
	),
}
