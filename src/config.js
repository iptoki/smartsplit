const DefaultConfig = {
	defaultLanguage: "fr",

	clientUrl: process.env.CLIENT_URL || "https://www.smartsplit.org",

	apiUrl: process.env.API_BASE_URL || "https://apiv2-dev.smartsplit.org/v1",

	mongodb: {
		uri: process.env.MONGODB_PATH || "mongodb://localhost/smartsplit",
	},

	sendgrid: {
		apikey: null,
		defaultTemplate: null,
	},

	twilio: {
		accountSid: null,
		authToken: null,
		phoneNumber: null,
	},

	email: {
		from_name: "Smartsplit",
		from_email: "noreply@smartsplit.org",
		to_name: "Utilisateur SmartSplit",
		to_email: "qa@smartsplit.org",
	},

	jwt_secret: null,

	listen: {
		port: process.env.API_PORT || 3001,
		host: "0.0.0.0",
	},

	http: {
		entityMaxSize: 16 * 1024 * 1024, // 16MB
	},

	logger: true,
}

try {
	module.exports = {
		...DefaultConfig,
		...require("../config"),
	}
} catch (e) {
	console.warn("Failed to load global configuration, using defaults...")
	module.exports = DefaultConfig
}
