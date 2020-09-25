const Config = require("./src/config")

module.exports = {
	routePrefix: "/docs",
	swagger: {
		info: {
			title: "Smartsplit API",
			description: "Swagger API for the Smartsplit project",
			version: "0.1.0",
		},
		externalDocs: {
			url: "https://swagger.io",
			description: "Find more info here",
		},
		host: "localhost",
		schemes: ["http"],
		consumes: ["application/json"],
		produces: ["application/json"],
		tags: [
			{ name: "auth", description: "Manage authorization" },
			{ name: "users", description: "Manage users accounts" },
			{ name: "users_emails", description: "Manage users emails" },
			{ name: "right_holders", description: "Manage right holders" },
			{ name: "workpieces", description: "Manage workpieces" },
			{
				name: "right_splits",
				description: "manage right splits of a workpiece",
			},
			{ name: "lists", description: "Manage lists of the system" },
		],
		servers: [
			{
				url: Config.listen.host + ":" + Config.listen.port,
				description: "Local server",
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
				},
			},
		},
	},
	exposeRoute: true,
}
