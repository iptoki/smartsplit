const DefaultConfig = {
	defaultLanguage: "fr",
	
	clientUrl: "https://www.smartsplit.org",
	
	apiUrl: "https://apiv2-dev.smartsplit.org",
	
	mongodb: {
		uri: "mongodb://localhost/smartsplit",
	},
	
	sendgrid: {
		apikey: null,
		defaultTemplate: null,
	},
	
	email: {
		from_name:  "Smartsplit",
		from_email: "noreply@smartsplit.org",
		to_name:    "Utilisateur SmartSplit",
		to_email:   "qa@smartsplit.org",
	},
	
	jwt_secret: null,
	
	listen: {
		port: process.env.API_PORT || 3001,
		host: undefined,
	},
}

try {
	module.exports = {
		...DefaultConfig,
		...require("../config")
	}
} catch(e) {
	console.warn("Failed to load global configuration, using defaults...")
	module.exports = DefaultConfig
}
