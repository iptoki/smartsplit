module.exports.file = {
	type: "object",
	properties: {
		file_id: {
			type: "string",
		},
		filename: { type: "string" },
		metadata: {
			type: "object",
			properties: {
				encoding: { type: "string" },
				mimetype: { type: "string" },
				visibility: {
					type: "string",
					enum: ["public", "hidden", "private"],
				},
			},
		},
		uploadDate: {
			type: "string",
			format: "date-time",
		},
		size: {
			type: "number",
		},
		url: {
			type: "string",
		},
	},
}
