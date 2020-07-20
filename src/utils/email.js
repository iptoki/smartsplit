const Config = require("../config")
const sendgrid = require("@sendgrid/mail")
sendgrid.setApiKey(Config.sendgrid.apikey)

/**
 * Maps email template names to a map of locales to template IDs
 *
 * TODO: Should be a runtime config
 */
const TemplateMap = {
	"user:activate-account": {
		en: "d-fedbe2e42cc646648f6c4f7f5b982d04",
		fr: "d-97be182e02e242a0ae9f3714497260a6",
	},

	"user:password-reset": {
		en: "d-d297d493a07f4ee78b235171ee191dea",
		fr: "d-a6fc7e4c4c9848e8867ddd05c3fc214c",
	},

	"user:password-changed": {
		en: "d-97a4ef0dcaf94b41a10346d937d04312",
		fr: "d-4b743067d5a542e4b0ef3032fdc48164",
	},

	"user:activate-email": {
		en: "d-a6424a6f103a4c06af6b5ca80ba6e94c",
		fr: "d-42c64fbf3a5f4764bffff61bc7b50bd0",
	},

	"split:created": {
		en: "d-ffa0d437e03441b5bea6a233de349558",
		fr: "d-8d0b9acf81e2475a8ab133da07ae3df3",
	},

	"right-split:created": {
		en: "d-cf37277440d64095abac9531ba6457ea",
		fr: "d-3609f460f0ab47bfbda87043388cfd03",
	},

	"right-split:accepted": {
		en: "d-96d430a6f14d4268960e1403c1085276",
		fr: "d-992b19e8e96744e4b5b978f097584d00",
	},
}

/**
 * Sends an email using SendGrid.
 *
 * If no template ID is specified, a generic text template is used instead
 * and the data argument is used as the text to send to the user.
 */
function sendEmail(options, data) {
	return sendgrid.send({
		template_id: options.template_id || Config.sendgrid.defaultTemplate,
		from: options.from || {
			name: options.from_name || Config.email.from_name,
			email: options.from_email || Config.email.from_email,
		},
		personalizations: [
			{
				to: options.to || {
					name: options.to_name || Config.email.to_name,
					email: options.to_email || Config.email.to_email,
				},
				subject: options.subject,
				dynamic_template_data: options.template_id ? data : { text: data },
			},
		],
	})
}

/**
 * Sends an email template to the specified user
 */
function sendTemplateTo(templateName, user, options, data) {
	if (data === undefined) {
		data = options || {}
		options = {}
	}

	return sendEmail(
		{
			template_id:
				TemplateMap[templateName][user.locale || Config.defaultLanguage],
			to: user.$email,
			...options,
		},
		{
			...data,
			user: {
				id: user.user_id,
				user_id: user.user_id,
				fullName: user.fullName,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				artistName: user.artistName,
				...data.user,
			},
		}
	)
}

function normalizeEmailAddress(email) {
	return email.trim().toLowerCase()
}

module.exports = { sendEmail, sendTemplateTo, normalizeEmailAddress }
