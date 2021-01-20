const Notifications = require("../models/notifications/notification")
const AccountStatus = require("../constants/accountStatus")

module.exports.mobilePhone = {
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
}

module.exports.permissions = {
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
}

module.exports.notifications = {
	type: "object",
	properties: {
		[Notifications.GENERAL_INTERATIONS]: {
			type: "array",
			items: {
				type: "string",
				enum: ["email", "push", "sms"],
			},
			default: ["email", "push"],
		},
		[Notifications.ADMINISTRATIVE_MESSAGES]: {
			type: "array",
			items: {
				type: "string",
				enum: ["email", "push", "sms"],
			},
			default: ["email", "push"],
		},
		[Notifications.ACCOUNT_LOGIN]: {
			type: "array",
			items: {
				type: "string",
				enum: ["email", "push", "sms"],
			},
			default: [],
		},
		[Notifications.SMARTSPLIT_BLOG]: {
			type: "array",
			items: {
				type: "string",
				enum: ["email", "push", "sms"],
			},
			default: [],
		},
		[Notifications.SMARTSPLIT_PROMOTIONS]: {
			type: "array",
			items: {
				type: "string",
				enum: ["email", "push", "sms"],
			},
			default: [],
		},
		[Notifications.PARTNER_PROMOTIONS]: {
			type: "array",
			items: {
				type: "string",
				enum: ["email", "push", "sms"],
			},
			default: [],
		},
	},
}

module.exports.professional_identity = {
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
			default: false,
		},
	},
}

module.exports.user = {
	type: "object",
	properties: {
		user_id: {
			type: "string",
		},
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
		mobilePhone: this.mobilePhone,
		permissions: this.permissions,
		locale: {
			type: "string",
			enum: ["en", "fr"],
		},
		avatarUrl: {
			type: "string",
		},
		notifications: this.notifications,
		professional_identity: this.professional_identity,
		collaborators: {
			type: "array",
			items: {
				type: "string",
			},
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
}

module.exports.contributor = {
	type: "object",
	properties: {
		user_id: {
			type: "string",
		},
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

module.exports.rightHolder = {
	type: "object",
	properties: {
		rightHolder_id: {
			type: "string",
		},
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

module.exports.userPublicProfile = {
	type: "object",
	properties: {
		user_id: {
			type: "string",
		},
		artistName: {
			type: "string",
		},
		firstName: {
			type: "string",
		},
		lastName: {
			type: "string",
		},
		avatarUrl: {
			type: "string",
		},
		locale: {
			type: "string",
			enum: ["en", "fr"],
		},
		// TODO: this one is tricky, can't find an elegant solution for the moment
		// Disabling it for the moment, I prefer that rather than leaking some user's private info
		// professional_identity: this.professional_identity,
		isni: {
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
}

module.exports.userRequestBody = {
	type: "object",
	properties: {
		email: {
			type: "string",
		},
		password: {
			type: "string",
		},
		artistName: {
			type: "string",
		},
		firstName: {
			type: "string",
		},
		lastName: {
			type: "string",
		},
		phoneNumber: {
			type: "string",
		},
		avatar: {
			type: "string",
		},
		locale: {
			type: "string",
			enum: ["en", "fr"],
		},
		notifications: this.notifications,
		professional_identity: this.professional_identity,
		collaborators: {
			type: "array",
			items: {
				type: "string",
			},
		},
		contributors: {
			type: "array",
			items: {
				type: "string",
			},
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

module.exports.emailStatusList = {
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
