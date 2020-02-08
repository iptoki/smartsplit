const mongoose = require("mongoose")
const BaseModel = require("./base")
const uuidv1 = require('uuid/v1')

const EntitySchema = new mongoose.Schema({
	_id: { type: String, alias: "uuid", default: uuidv1},
	name: String,
	members: [String]
}, BaseModel.defaultOptions)

/** Ajoute un membre à une entité, la créant si nécessaire */
EntitySchema.statics.addMember = /*async*/ function(member, name) {
	return this.updateOne(
		{name},
		{
			$setOnInsert: {_id: uuidv1(), name},
			$push: {members: member}
		},
		{upsert: true}
	)
}

/** Ajoute un membre dans plusieurs entités, en les créant si nécessaire, en une seule opération */
EntitySchema.statics.addMemberInMany = async function(member, ...names) {
	if(names.length === 0)
		return true
	
	return await this.bulkWrite(names.map(name => {
		return {updateOne: {
			filter: {name},
			update: {
				$setOnInsert: {_id: uuidv1(), name},
				$push: {members: member}
			},
			upsert: true
		}}
	}))
}

module.exports = mongoose.model("Entity", EntitySchema)
