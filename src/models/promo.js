const uuid = require('uuid').v4
const mongoose = require('mongoose')
const localeSchema = require('./locale')

const PromoSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			alias: 'code',
		},
		organisation: localeSchema,
		description: localeSchema,
		value: Number,
		expires: Date,
	},
	{ toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

module.exports = mongoose.model('Promo', PromoSchema)
