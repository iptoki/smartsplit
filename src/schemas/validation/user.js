const UserSchema = require("../serialization/user")

module.exports.user_public = {
	type: "object",
	properties: {
		firstName: {
			type: "string",
		},
		lastName: {
			type: "string",
		},
		artistName: {
			type: "string",
		},
	},
}

module.exports.collaborator = {
	$patch: {
		source: this.public_user,
	},
	with: [{ op: "add", path: "/properties/email", value: { type: "string" } }],
}

module.exports.user = {
	$patch: {
		source: UserSchema.user,
	},
	with: [
		{ op: "remove", path: "/properties/user_id" },
		{ op: "remove", path: "/properties/emails" },
		{ op: "remove", path: "/properties/accountStatus" },
		{ op: "remove", path: "/properties/mobilePhone" },
		{ op: "remove", path: "/properties/collaborators" },
		{ op: "remove", path: "/properties/permissions" },
		{ op: "remove", path: "/properties/avatarUrl" },
		{ op: "add", path: "/properties/email", value: { type: "string" } },
		{ op: "add", path: "/properties/password", value: { type: "string" } },
		{ op: "add", path: "/properties/phoneNumber", value: { type: "string" } },
		{ op: "add", path: "/properties/avatar", value: { type: "string" } },
		{
			op: "add",
			path: "/properties/professional_identity",
			value: UserSchema.professional_identity,
		},
	],
}
