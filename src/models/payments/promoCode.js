const mongoose = require("mongoose")
const localeSchema = require("../entities/locale")
const uuid = require("uuid").v4
const PromoCodeSchema = mongoose.Schema({
	_id: {
		type: String,
		alias: "promo_id",
		default: uuid,
	},
	code: String,
	organisation: localeSchema,
	description: localeSchema,
	value: Number,
	expires: Date,
	purchase_id: String,
})
PromoCodeSchema.query.getActive = function () {
	const now = new Date()

	return this.where({ product_id: "" }).where({
		expires: { $gte: now.toISOString() },
	})
}
PromoCodeSchema.query.getInActive = function () {
	const now = new Date()

	return this.or(
		{ expires: { $lte: now.toISOString() } },
		{ purchase_id: { $nin: ["", null, undefined] } }
	)
}

module.exports.PromoCode = mongoose.model("PromoCode", PromoCodeSchema)
module.exports.Schema = PromoCodeSchema
