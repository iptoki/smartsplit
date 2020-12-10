const Config = require("./src/config")

module.exports = {
	routePrefix: "/docs",
	swagger: {
		info: {
			title: "Smartsplit MVP",
			description: "Smartsplit MVP API documentation",
			version: "0.1.0",
		},
		openapi: "3.0.0",
		externalDocs: {
			url: "https://swagger.io",
			description: "Find more info here",
		},
		schemes: ["http"],
		consumes: ["application/json"],
		produces: ["application/json"],
		tags: [
			{ name: "auth", description: "Manage authorization" },
			{ name: "users_general", description: "Manage users accounts" },
			{ name: "users_emails", description: "Manage users emails" },
			{ name: "collaborators", description: "Manage user's collaborators" },
			{ name: "contributors", description: "Manage user's contributors" },
			{ name: "right_holders", description: "Manage right holders" },
			{ name: "workpieces_general", description: "Manage workpieces" },
			{
				name: "right_splits",
				description: "Manage right splits of a workpiece",
			},
			{
				name: "workpiece_documentation",
				description: "Manage workpiece's documentation",
			},
			{
				name: "workpieces_documentation_files",
				description: "Manage workpiece's files",
			},
			{ name: "entities", description: "Manage lists of the system" },
		],
		servers: [
			{
				url: `http://${Config.listen.host}:${Config.listen.port}`,
				description: "Local server",
			},
			{
				url: "https://apiv2-dev.smartsplit.org",
				description: "Development server",
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
