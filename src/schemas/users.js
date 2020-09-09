const Notifications = require("../models/notifications/notification")

async function schemas(fastify) {
	fastify.addSchema({
		$id: "UserSchema",
		type: "object",
		definitions: {
			rightHolder: {
				type: "object",
				properties: {
					rightHolder_id: {
						type: "string",
						format: "uuid",
						example: "e87b56fe-1ce0-4ec7-8393-e18dc7415041",
						aliasFrom: "user_id",
					},
					firstName: {
						type: "string",
						example: "John",
					},
					lastName: {
						type: "string",
						example: "Doe",
					},
					artistName: {
						type: "string",
						example: "JohnDoReMi",
					},
					email: {
						type: "string",
						format: "email",
						example: "qa@smartsplit.org",
					},
				},
			},
		},
		properties: {
			user_id: {
				type: "string",
				format: "uuid",
				example: "e87b56fe-1ce0-4ec7-8393-e18dc7415041",
				aliasFrom: "_id",
			},
			firstName: {
				type: "string",
				example: "John",
			},
			lastName: {
				type: "string",
				example: "Doe",
			},
			artistName: {
				type: "string",
				example: "JohnDoReMi",
			},
			email: {
				type: "string",
				format: "email",
				example: "qa@smartsplit.org",
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
				example: "active",
			},
			mobilePhone: {
				type: "object",
				properties: {
					number: {
						type: "string",
						example: "+15555555555",
					},
					status: {
						type: "string",
						enum: ["verified", "unverified"],
						example: "verified",
					},
				},
			},
			permissions: {
				type: "object",
				properties: {
					admin: {
						type: "boolean",
					},
					users: {
						type: "array",
						items: {
							type: "string",
							format: "uuid",
						},
					},
				},
			},
			locale: {
				type: "string",
				enum: ["en", "fr"],
				example: "fr",
				default: "en",
			},
			avatarUrl: {
				type: "string",
				example:
					"https://api.smartsplit.org/users/0d0cb6f9-c1e6-49e0-acbf-1ca4ace07d1c/avatar",
			},
			notifications: {
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
			},
		},
	})
}

module.exports = schemas

// module.exports = {
// 	id: api.param("user_id", {
// 		in: "path",
// 		name: "user_id",
// 		description:
// 			'The ID of the user, or the special value "session" to use the currently authenticated user',
// 		example: "session",
// 	}),

// 	user: api.schemaFromModel("user", User, {
// 		properties: {
// 			email: {
// 				type: "string",
// 				format: "email",
// 				example: "qa@smartsplit.org",
// 				writeOnly: true,
// 			},

// 			avatarUrl: {
// 				type: "string",
// 				example:
// 					"https://api.smartsplit.org/users/0d0cb6f9-c1e6-49e0-acbf-1ca4ace07d1c/avatar",
// 				readOnly: true,
// 			},

// 			phoneNumber: {
// 				type: "string",
// 				writeOnly: true,
// 				example: "+15555555555",
// 			},
// 		},
// 	}),

// 	rightHolder: api.schema("right_holder", {
// 		type: "object",
// 		properties: {
// 			rightHolder_id: {
// 				type: "string",
// 				format: "uuid",
// 				example: "e87b56fe-1ce0-4ec7-8393-e18dc7415041",
// 				aliasFrom: "user_id",
// 			},
// 			firstName: {
// 				type: "string",
// 				example: "John",
// 			},
// 			lastName: {
// 				type: "string",
// 				example: "Doe",
// 			},
// 			artistName: {
// 				type: "string",
// 				example: "JohnDoReMi",
// 			},
// 			email: {
// 				type: "string",
// 				format: "email",
// 				example: "qa@smartsplit.org",
// 			},
// 		},
// 	}),

// 	activateAccountSchema: api.schema("user_activate_account", {
// 		type: "object",
// 		required: ["token"],
// 		properties: {
// 			token: {
// 				type: "string",
// 				format: "jwt",
// 			},
// 		},
// 	}),

// 	requestPasswordReset: api.schema("user_password_reset", {
// 		type: "object",
// 		required: ["email"],
// 		properties: {
// 			email: {
// 				type: "string",
// 				format: "email",
// 				example: "valaire@smartsplit.org",
// 			},
// 		},
// 	}),

// 	passwordChange: api.schema("user_change_password", {
// 		type: "object",
// 		required: ["password"],
// 		properties: {
// 			token: {
// 				type: "string",
// 				format: "jwt",
// 			},

// 			currentPassword: {
// 				type: "string",
// 				format: "password",
// 			},

// 			password: {
// 				type: "string",
// 				format: "password",
// 			},
// 		},
// 	}),

// 	verifyMobilePhone: api.schema("user_verify_mobile_phone", {
// 		type: "object",
// 		required: ["verificationCode"],
// 		properties: {
// 			verificationCode: {
// 				type: "number",
// 				example: "159837",
// 			},
// 		},
// 	}),
