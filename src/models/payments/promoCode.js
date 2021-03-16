const uuid = require("uuid").v4
const mongoose = require("mongoose")
const localeSchema = require("../locale")

const PromoCodeSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			alias: "promoCode_id",
			default: uuid,
		},
		code: String,
		organisation: localeSchema,
		description: localeSchema,
		value: Number,
		expires: Date,
	},
	{ toJSON: { virtuals: true } }
)
PromoCodeSchema.query.byActive = function () {
	const now = new Date()

	return this.where({ product_id: "" }).where({
		expires: { $gte: now.toISOString() },
	})
}
PromoCodeSchema.query.byInactive = function () {
	const now = new Date()

	return this.or(
		{ expires: { $lte: now.toISOString() } },
		{ purchase_id: { $nin: ["", null, undefined] } }
	)
}

module.exports = mongoose.model("PromoCode", PromoCodeSchema)
