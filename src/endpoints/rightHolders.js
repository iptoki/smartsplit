const { api } = require("../app")
const User = require("../models/user")
const UserSchema = require("../schemas/users")

/************************ Routes ************************/

api.get(
	"/rightHolders",
	{
		tags: ["RightHolders"],
		summary: "Get the list of rightHolders",
		parameters: [],
		responses: {
			200: UserSchema.rightHolderList,
		},
	},
	getRightHolders
)

api.get(
	"/rightHolders/{user_id}",
	{
		tags: ["RightHolders"],
		summary: "Get the a rightHolder by ID",
		parameters: [UserSchema.id],
		responses: {
			200: UserSchema.rightHolder,
		},
	},
	getRightHolderById
)

/************************ Handlers ************************/

async function getRightHolders() {
	let regex = ""
	if (this.req.query.search_terms) {
		let search_terms = [this.req.query.search_terms]
		if (this.req.query.search_terms.includes(" "))
			search_terms = search_terms.concat(this.req.query.search_terms.split(" "))
		regex = new RegExp(search_terms.join("|"))
	}

	if (!this.req.query.limit) this.req.query.limit = 50
	else this.req.query.limit = Math.min(this.req.query.limit, 250)

	return await User.find({
		$or: [
			{ firstName: { $regex: regex, $options: "i" } },
			{ lastName: { $regex: regex, $options: "i" } },
			{ artistName: { $regex: regex, $options: "i" } },
		],
	})
		.skip(parseInt(this.req.query.skip))
		.limit(parseInt(this.req.query.limit))
}

async function getRightHolderById() {
	const rightHolder = await User.findById(this.req.params.user_id)

	if (!rightHolder)
		throw new UserSchema.UserNotFoundError({
			user_id: this.req.params.user_id,
		})

	return rightHolder
}
