const Config = require("../config")
const Notification = require("../constants/notificationTypes")
const AddressSchema = require("../schemas/addresses").serialization.address
const ProductSchema = require("../schemas/addresses").serialization.product
const PromoCodeSchema = require("../schemas/addresses").serialization.promoCode

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
	INVITED: "user:invited",
}

const PaymentTemplates = {
	PRODUCT_PURCHASE_INVOICE: "payment:product-purchase-invoice",
}

const TemplateMap = {
	[SplitTemplates.CREATED]: {
		notificationType: Notification.GENERAL_INTERACTIONS,
		email: {
			template_id: {
				en: "d-cf37277440d64095abac9531ba6457ea",
				fr: "d-3609f460f0ab47bfbda87043388cfd03",
			},
			generate: function (user, options) {
				let callbackUrl = `${Config.clientUrl}/workpiece/${options.workpiece._id}/right-split/vote`
				if (!user.isActive) {
					const token = user.createActivationToken(
						options.to.email,
						options.expires || "2 hours"
					)
					callbackUrl = `${Config.clientUrl}/user/activate-invited-user/${token}/${user.firstName}/${user.lastName}`
				}
				return {
					id: this.template_id[user.locale],
					data: {
						workTitle: options.workpiece.title,
						callbackUrl,
					},
				}
			},
		},
	},

	[SplitTemplates.ACCEPTED]: {
		notificationType: Notification.GENERAL_INTERACTIONS,
		email: {
			template_id: {
				en: "d-96d430a6f14d4268960e1403c1085276",
				fr: "d-992b19e8e96744e4b5b978f097584d00",
			},
			generate: function (user, options) {
				return {
					id: this.template_id[user.locale],
					data: {
						workTitle: options.workpiece.title,
						callbackUrl: `${Config.clientUrl}/workpiece/${options.workpiece._id}/right-split/summary`,
					},
				}
			},
		},
	},

	[SplitTemplates.REJECTED]: {
		notificationType: Notification.GENERAL_INTERACTIONS,
		email: {
			template_id: {
				en: "????" /* TODO */,
				fr: "????" /* TODO */,
			},
			generate: function (user, options) {
				return {
					id: this.template_id[user.locale],
					data: {
						workTitle: options.workpiece.title,
						callbackUrl: `${Config.clientUrl}/workpiece/${options.workpiece._id}/right-split/summary`,
					},
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
						callbackUrl: Config.clientUrl + "/user/activate/" + token,
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
					options.to.email,
					options.expires || "2 hours"
				)
				return {
					id: this.template_id[user.locale],
					data: {
						callbackUrl: Config.clientUrl + "/user/change-password/" + token,
					},
				}
			},
		},
	},

	[UserTemplates.INVITED]: {
		notificationType: Notification.ADMINISTRATIVE_MESSAGES,
		email: {
			template_id: {
				en: "d-43d2116f70c847ff906b56ac665e890d",
				fr: "d-aa140c8094dd44ebbfb6637db3e51ccc",
			},
			generate: function (user, options) {
				const token = user.createActivationToken(
					options.to.email,
					options.expires || "2 hours"
				)
				return {
					id: this.template_id[user.locale],
					data: {
						collaborator: options.collaborator,
						callbackUrl: `${Config.clientUrl}/user/activate-invited-user/${token}/${user.firstName}/${user.lastName}`,
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
						activateEmail: options.to.email,
						callbackUrl:
							Config.clientUrl + "/activate-additional-email/" + token,
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
				return {
					message:
						this.message[user.locale] + user.mobilePhone.verificationCode.code,
				}
			},
		},
	},

	[PaymentTemplates.PRODUCT_PURCHASE_INVOICE]: {
		notificationType: Notification.ADMINISTRATIVE_MESSAGES,
		email: {
			template_id: {
				en: "d-1ed3ad6394ca44cb9c42152f8bc29fa0",
				fr: "d-e69abd3436c2420aa3270f27150a3b8f",
			},
			generate: function (user, options) {
				const fastJson = require("fast-json-stringify")
				const product = fastJson(ProductSchema)(purchase.product)
				const promoCode = fastJson(PromoCodeSchema)(purchase.promoCode)
				const billingAddress = fastJson(AddressSchema)(purchase.billingAddress)
				return {
					id: this.template_id[user.locale],
					data: {
						purchase: {
							purchase_id: purchase._id,
							subtotal: purchase.subtotal,
							total: purchase.total,
							gst: purchase.gst,
							pst: purchase.pst,
							creditsUsed: purchase.creditsUsed,
							product,
							promoCode,
							billingAddress,
							workpiece: {
								title: workpiece.title,
							},
						},
					},
				}
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
	PaymentTemplates,
	TemplateMap,
	generateTemplate,
}
