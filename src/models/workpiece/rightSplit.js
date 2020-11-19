const mongoose = require("mongoose")

const SplitSchema = new mongoose.Schema(
	{
		rightHolder: {
			type: String,
			ref: "User",
		},
		roles: [String],
		vote: {
			type: String,
			enum: ["undecided", "accepted", "rejected"],
		},
		comment: String,
		shares: Number,
	},
	{ _id: false }
)

const RightSplitSchema = new mongoose.Schema(
	{
		_state: {
			type: String,
			enum: ["draft", "voting", "accepted", "rejected"],
		},
		copyright: [SplitSchema],
		interpretation: [SplitSchema],
		recording: [SplitSchema],
	},
	{ _id: false }
)

module.exports = RightSplitSchema
