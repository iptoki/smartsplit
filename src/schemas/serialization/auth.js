const { user } = require("./user")

module.exports.sessionInfo = {
	type: "object",
	properties: {
		accessToken: {
			type: "string",
		},
		//user: user,
	},
}
