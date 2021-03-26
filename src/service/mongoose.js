const mongoose = require('mongoose')
const Config = require('../config')

// remove deprecation warnings when using Model.findOneAndX()
mongoose.set('useFindAndModify', false)

// Global model function
mongoose.plugin(function (schema, options) {
	schema.statics.ensureExistsAndRetrieve = function (filter, paths = []) {
		if (typeof filter === 'string') filter = { _id: filter }
		const errName = `${this.modelName}NotFound`
		return this.findOne(this.translateAliases(filter))
			.populate(paths)
			.then((result) => {
				if (!result) return Promise.reject(Errors[errName] || Errors.NotFound)
				else return Promise.resolve(result)
			})
	}
})

// Connect database
mongoose
	.connect(process.env['MONGODB_PATH'] || Config.mongodb.uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		// Buckets for file hosting
		Object.defineProperty(mongoose, 'bucket', {
			value: {
				protectedWork: new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
					bucketName: 'protectedWork',
				}),
			},
		})
	})

module.exports = mongoose
