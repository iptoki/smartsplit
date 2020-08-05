const Config = require("../../config")
const Notification = require("./notification")

const SplitTemplates = {
	CREATED: "split:created",
	ACCEPTED: "split:accepted",
	REJECTED: "split:rejected",
}

const UserTemplates = {
	ACTIVATE_ACCOUNT: "user:activate-account",
	PASSWORD_RESET: "user:password-reset",
	PASSWORD_CHANGED: "user:password-changed",
	ACTIVATE_EMAIL: "user:activate-email",
	VERIFY_MOBILE_PHONE: "user:verify-mobile-phone",
}

const TemplateMap = {
	[SplitTemplates.CREATED]: {
		notificationType: Notification.GENERAL_INTERATIONS,
		email: {
			template_id: {
				en: "d-cf37277440d64095abac9531ba6457ea",
				fr: "d-3609f460f0ab47bfbda87043388cfd03",
			},
			generate: function (user, options) {
				return {
					id: this.template_id[user.locale],
					data: {
						split: {
							workTitle: options.workpiece.title,
							splitInitiator: options.workpiece.owner.fullName,
						},
						splitUrl: "" /* TODO */,
					},
				}
			},
		},
	},

	[SplitTemplates.ACCEPTED]: {
		notificationType: Notification.GENERAL_INTERATIONS,
		email: {
			template_id: {
				en: "d-96d430a6f14d4268960e1403c1085276",
				fr: "d-992b19e8e96744e4b5b978f097584d00",
			},
			generate: function (user, options) {
				return {
					id: this.template_id[user.locale],
					data: {
						split: {
							workTitle: options.workpiece.title,
							splitInitiator: options.workpiece.owner.fullName,
						},
						voteResultUrl: "" /* TODO */,
					},
				}
			},
		},
	},

	[SplitTemplates.REJECTED]: {
		notificationType: Notification.GENERAL_INTERATIONS,
		email: {
			template_id: {
				en: "????",
				fr: "????",
			},
			generate: function (user, options) {
				return {
					id: this.template_id[user.locale],
					data: {},
				}
			},
		},
	},

	[UserTemplates.ACTIVATE_ACCOUNT]: {
		notificationType: Notification.ADMINISTRATIVE_MESSAGES,
		email: {
			template_id: {
				en: "d-fedbe2e42cc646648f6c4f7f5b982d04",
				fr: "d-97be182e02e242a0ae9f3714497260a6",
			},
			generate: function (user, options) {
				const token = user.createActivationToken(
					options.to.email,
					options.expires || "2 hours"
				)
				return {
					id: this.template_id[user.locale],
					data: {
						activateAccountUrl: Config.clientUrl + "/user/activate/" + token,
					},
				}
			},
		},
	},

	[UserTemplates.PASSWORD_RESET]: {
		notificationType: Notification.ADMINISTRATIVE_MESSAGES,
		email: {
			template_id: {
				en: "d-d297d493a07f4ee78b235171ee191dea",
				fr: "d-a6fc7e4c4c9848e8867ddd05c3fc214c",
			},
			generate: function (user, options) {
				const token = user.createPasswordResetToken(
					options.expires || "2 hours"
				)
				return {
					id: this.template_id[user.locale],
					data: {
						resetPasswordUrl:
							Config.clientUrl + "/user/change-password/" + token,
					},
				}
			},
		},
	},

	[UserTemplates.PASSWORD_CHANGED]: {
		notificationType: Notification.ADMINISTRATIVE_MESSAGES,
		email: {
			template_id: {
				en: "d-97a4ef0dcaf94b41a10346d937d04312",
				fr: "d-4b743067d5a542e4b0ef3032fdc48164",
			},
			generate: function (user, options) {
				return {
					id: this.template_id[user.locale],
					data: {},
				}
			},
		},
	},

	[UserTemplates.ACTIVATE_EMAIL]: {
		notificationType: Notification.ADMINISTRATIVE_MESSAGES,
		email: {
			template_id: {
				en: "d-a6424a6f103a4c06af6b5ca80ba6e94c",
				fr: "d-42c64fbf3a5f4764bffff61bc7b50bd0",
			},
			generate: function (user, options) {
				const token = user.createActivationToken(
					options.to.email,
					options.expires || "2 hours"
				)
				return {
					id: this.template_id[user.locale],
					data: {
						newEmail: options.to.email,
						linkEmailAccountUrl: Config.clientUrl + /* TODO */ token,
					},
				}
			},
		},
	},

	[UserTemplates.VERIFY_MOBILE_PHONE]: {
		notificationType: Notification.ADMINISTRATIVE_MESSAGES,
		sms: {
			message: {
				en: "Your Smartsplit activation code is ",
				fr: "Votre code d'activation Smartsplit est ",
			},
			generate: function (user) {
				return (
					this.message[user.locale] + user.mobilePhone.verificationCode.code
				)
			},
		},
	},
}

const generateTemplate = function (templateName, medium, user, options = {}) {
	if (!TemplateMap[templateName] || !TemplateMap[templateName][medium])
		return null

	const template = TemplateMap[templateName]

	return {
		notificationType: template.notificationType,
		...template[medium].generate(user, options),
	}
}

module.exports = {
	SplitTemplates,
	UserTemplates,
	TemplateMap,
	generateTemplate,
}
