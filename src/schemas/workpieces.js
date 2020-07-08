const { api, error } = require("../app")
const Workpiece = require("../models/workpiece")

module.exports = {
	workpiece_id: api.param("workpiece_id", {
		in: "path",
		name: "workpiece_id",
		description: "The ID of a workpiece",
		example: "e87b56ee-1ca0-4ec7-8393-e18dc7415041",
	}),

	workpiece: api.schemaFromModel("workpiece", Workpiece),

	WorkpieceNotFoundError: error(
		"workpiece_not_found",
		404,
		"Workpiece not found"
	),

	RightSplitNotFoundError: error(
		"right_split_not_found",
		404,
		"RightSplit not found"
	),

	InvalidSplitTokenError: error(
		"right_holder_invalid_token",
		403,
		"The supplied split token is not valid or has expired"
	),

	ConflictingRightSplitStateError: error(
		"conflicting_right_split_state",
		409,
		"The current state of the right split does not allow this kind of operation"
	),

	VoteAlreadySubmitedError: error(
		"vote_already_submited",
		412,
		"This right holder's vote has already been submited and cannot be submited again"
	),
}
