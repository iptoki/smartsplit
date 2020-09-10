const Config = require("../config")
const sendgrid = require("@sendgrid/mail")
sendgrid.setApiKey(Config.sendgrid.apikey)

/**
 * Sends an email using SendGrid.
 *
 * If no template ID is specified, a generic text template is used instead
 * and the data argument is used as the text to send to the user.
 */
function sendEmail(options, data) {
	const sg = {
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
	}
	console.log(sg.personalizations)
	return sendgrid.send(sg)
}

/**
 * Sends an email template to the specified user
 */
function sendTemplateTo(template_id, user, options, data) {
	if (data === undefined) {
		data = options || {}
		options = {}
	}

	return sendEmail(
		{
			template_id: template_id,
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
