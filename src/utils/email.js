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
	return sendgrid.send({
		template_id: options.template || Config.sendgrid.defaultTemplate,
		from: options.from || {
			name:  options.from_name  || Config.email.from_name,
			email: options.from_email || Config.email.from_email
		},
		personalizations: [{
			to: options.to || {
				name:  options.to_name  || Config.email.to_name,
				email: options.to_email || Config.email.to_email
			},
			subject: options.subject,
			dynamic_template_data: options.template ? data : {text: data}
		}]
	})
}

module.exports = sendEmail
