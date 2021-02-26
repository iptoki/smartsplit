const Notifications = require("../models/notifications/notification")
const AccountStatus = require("../constants/accountStatus")

const mobilePhone = {
	type: "object",
	properties: {
		number: { type: "string" },
		isVerified: { type: "boolean" },
	},
	additionalProperties: false,
}

const permissions = {
	type: "object",
	properties: {
		isAdmin: { type: "boolean" },
		users: {
			type: "array",
			items: { type: "string" },
		},
	},
	additionalProperties: false,
}

const notifications = {
	type: "object",
	properties: {
		[Notifications.GENERAL_INTERACTIONS]: {
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

const professionalIdentity = {
	type: "object",
	properties: {
		ids: {
			type: "array",
			items: {
				type: "object",
				properties: {
					name: { type: "string" },
					value: { type: "string" },
				},
			},
		},
		public: {
			type: "boolean",
			default: false,
		},
	},
	additionalProperties: false,
}

const publicUser = {
	type: "object",
	properties: {
		user_id: { type: "string" },
		artistName: { type: "string" },
		firstName: { type: "string" },
		lastName: { type: "string" },
		avatarUrl: { type: "string" },
		locale: {
			type: "string",
			enum: ["en", "fr"],
		},
		isni: { type: "string" },
		organisations: {
			type: "array",
			items: { type: "string" },
		},
		projects: {
			type: "array",
			items: { type: "string" },
		},
		uri: { type: "string" },
	},
	additionalProperties: false,
}

const collaborator = {
	type: "object",
	properties: {
		...publicUser.properties,
		emails: {
			type: "array",
			items: { type: "string" },
		},
	},
	additionalProperties: false,
}

const user = {
	type: "object",
	properties: {
		...collaborator.properties,
		accountStatus: {
			type: "string",
			enum: AccountStatus.list,
		},
		mobilePhone,
		permissions,
		notifications,
		professionalIdentity,
		collaborators: {
			type: "array",
			items: { type: "string" },
		},
		birthDate: { type: "string" },
		address: { type: "string" },
	},
	additionalProperties: false,
}

const emailStatusList = {
	type: "array",
	items: {
		type: "object",
		properties: {
			email: { type: "string" },
			status: {
				type: "string",
				enum: ["primary", "active", "pending"],
			},
		},
	},
}

const createCollaborator = {
	type: "object",
	required: ["email"],
	properties: {
		firstName: { type: "string" },
		lastName: { type: "string" },
		artistName: { type: "string" },
		email: { type: "string" },
	},
	additionalProperties: false,
}

const updateUser = {
	type: "object",
	properties: {
		...createCollaborator.properties,
		phoneNumber: { type: "string" },
		avatar: { type: "string" },
		locale: {
			type: "string",
			enum: ["en", "fr"],
		},
		notifications,
		professionalIdentity,
		isni: { type: "string" },
		birthDate: {
			oneOf: [
				// yes it sucks...
				{ type: "string", format: "date" },
				{ type: "string", enum: [""] },
			],
		},
		address: { type: "string" },
		organisations: {
			type: "array",
			items: { type: "string" },
		},
		projects: {
			type: "array",
			items: { type: "string" },
		},
		uri: { type: "string" },
	},
	additionalProperties: false,
}

const createUser = {
	type: "object",
	required: ["email", "password"],
	properties: {
		...updateUser.properties,
		password: { type: "string" },
	},
	additionalProperties: false,
}

module.exports = {
	serialization: {
		user,
		publicUser,
		collaborator,
		emailStatusList,
	},
	validation: {
		createUser,
		updateUser,
		createCollaborator,
	},
}
