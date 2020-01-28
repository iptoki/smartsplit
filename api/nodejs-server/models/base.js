module.exports = {
	defaultOptions: {
		toJSON: {
			virtuals: true,
			aliases: true,
			transform: function(doc, ret, options) {
				delete ret._id
				delete ret.id
				delete ret.__v
			}
		}
	}
}