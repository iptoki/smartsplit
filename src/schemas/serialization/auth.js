const { private_user } = require("./user")

module.exports.sessionInfo = {
	type: "object",
	properties: {
		accessToken: {
			type: "string",
		},
		user: private_user,
	},
}
