/**
 * Default minimal configuration. See `src/config.js` for all the possible
 * configuration options that can be tweaked.
 */
module.exports = {
	mongodb: {
		uri: "mongodb://localhost/smartsplit",
	},
	
	sendgrid: {
		apikey: null
	},
	
	jwt_secret: "set this to something random",
}
