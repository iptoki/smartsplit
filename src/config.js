const DefaultConfig = {
	mongodb: {
		uri: "mongodb://localhost/smartsplit",
	},
	
	sendgrid: {
		apikey: null,
		defaultTemplate: null,
	},
	
	email: {
		from_name:  "SmartSplit",
		from_email: "noreply@smartsplit.org",
		to_name:    "Utilisateur SmartSplit",
		to_email:   "qa@smartsplit.org",
	},
	
	jwt_secret: null,
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
