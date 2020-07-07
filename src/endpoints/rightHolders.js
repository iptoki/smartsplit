const { api } = require("../app")
const User = require("../models/user")

/************************ Routes ************************/

api.get(
	"/rightHolders",
	{
		tags: ["RightHolders"],
		summary: "Get the list of rightHolders",
		parameters: [],
		responses: {},
	},
	getRightHolders
)


/************************ Handlers ************************/

async function getRightHolders() {
	let regex = ""
	if(this.req.query.search_terms) {
		let search_terms = [ this.req.query.search_terms ]
		if(this.req.query.search_terms.includes(" "))
			search_terms = search_terms.concat(this.req.query.search_terms.split(" "))
		regex = new RegExp(search_terms.join("|"))
	}
	return await User.find({
		"$or": [
			{ "firstName": { "$regex": regex, "$options": "i" } },
			{ "lastName": { "$regex": regex, "$options": "i" } },
			{ "artistName": { "$regex": regex, "$options": "i" } },
		]
	})
	.skip(parseInt(this.req.query.skip))
	.limit(parseInt(this.req.query.limit))
}