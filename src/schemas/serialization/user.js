const Notifications = require("../models/notifications/notification")
const AccountStatus = require("../constants/accountStatus")

const private_user = {
	type: "object",
	properties: {
user_id: CommonSchema.uuid1,
		firstName: {
			type: "string",
		},
		lastName: {
			type: "string",
		},
		artistName: {
			type: "string",
		},
		emails: {
			type: "array",
			items: {
				type: "string",
			},
		},
		accountStatus: {
			type: "string",
			enum: AccountStatus.list,
		},
		mobilePhone: mobilePhone,
		permissions: permissions,
		locale: {
			type: "string",
			enum: ["en", "fr"],
		},
		avatarUrl: {
			type: "string",
		},
		notifications: notifications,
		collaborators: {
			type: "array",
			items: public_user,
		},
		isni: {
			type: "string",
		},
		birthDate: {
			type: "string",
			format: "date",
		},
		address: {
			type: "string",
		},
		organisations: {
			type: "array",
			items: {
				type: "string",
			},
		},
		projects: {
			type: "array",
			items: {
				type: "string",
			},
		},
		uri: {
			type: "string",
		},
	},
	additionalProperties: false,
}

const public_user = {
	$patch: {
		source: user,
	},
	with: [
		{ op: "remove", path: "/properties/emails" },
		{ op: "remove", path: "/properties/accountStatus" },
		{ op: "remove", path: "/properties/mobilePhone" },
		{ op: "remove", path: "/properties/permissions" },
		{ op: "remove", path: "/properties/notifications" },
		{ op: "remove", path: "/properties/collaborators" },
		{ op: "remove", path: "/properties/birthDate" },
		{ op: "remove", path: "/properties/address" },
	],
}

const mobilePhone = {
	type: "object",
	properties: {
		number: {
			type: "string",
		},
		status: {
			type: "string",
			enum: ["verified", "unverified"],
		},
	},
	additionalProperties: false,
}

const permissions = {
	type: "object",
	properties: {
		admin: {
			type: "boolean",
		},
		users: {
			type: "array",
			items: {
				type: "string",
			},
		},
	},
	additionalProperties: false,
}

const notifications = {
	type: "object",
	properties: {
		[Notifications.GENERAL_INTERATIONS]: {
			type: "array",
			items: {
				type: "string",
				enum: ["email", "push", "sms"],
			},
		},
		[Notifications.ADMINISTRATIVE_MESSAGES]: {
			type: "array",
			items: {
				type: "string",
				enum: ["email", "push", "sms"],
			},
		},
		[Notifications.ACCOUNT_LOGIN]: {
			type: "array",
			items: {
				type: "string",
				enum: ["email", "push", "sms"],
			},
		},
		[Notifications.SMARTSPLIT_BLOG]: {
			type: "array",
			items: {
				type: "string",
				enum: ["email", "push", "sms"],
			},
		},
		[Notifications.SMARTSPLIT_PROMOTIONS]: {
			type: "array",
			items: {
				type: "string",
				enum: ["email", "push", "sms"],
			},
		},
		[Notifications.PARTNER_PROMOTIONS]: {
			type: "array",
			items: {
				type: "string",
				enum: ["email", "push", "sms"],
			},
		},
	},
	additionalProperties: false,
}

const professional_identity = {
	type: "object",
	properties: {
		ids: {
			type: "array",
			items: {
				type: "object",
				properties: {
					name: {
						type: "string",
					},
					value: {
						type: "string",
					},
				},
			},
		},
		public: {
			type: "boolean",
		},
	},
	additionalProperties: false,
}

const emailStatusList = {
	type: "array",
	items: {
		type: "object",
		properties: {
			email: {
				type: "string",
				format: "email",
				example: "qa@smartsplit.org",
			},
			status: {
				type: "string",
				enum: ["primary", "active", "pending"],
			},
		},
	},
}

module.exports = {
	user_private,
	user_public,
	emailStatusList,
	professional_identity,
}
