const Notifications = require("../models/notifications/notification")

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
		socan: {
			type: "string",
		},
		sodrac: {
			type: "string",
		},
		soproq: {
			type: "string",
		},
		resound: {
			type: "string",
		},
		artisti: {
			type: "string",
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
		email: {
			type: "string",
		},
		accountStatus: {
			type: "string",
			enum: [
				"invalid",
				"email-verification-pending",
				"split-invited",
				"active",
				"deleted",
			],
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
	},
}

module.exports.userList = {
	type: "array",
	items: this.user,
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
		email: {
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
		email: {
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
		professional_identity: this.professional_identity,
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
				enum: ["active", "pending"],
			},
		},
	},
}
