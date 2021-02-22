const mongoose = require("mongoose")
const PromoCodeSchema = mongoose.Schema({
	_id: {
		type: String,
		alias: "promo_id",
		default: uuid,
	},
	code: String,
	organisation_en: String,
	organisation_fr: String,
	description_en: String,
	description_fr: String,
	value: Number,
	expires: Date,
	purchase_id: String,
})

module.exports.PromoCode = mongoose.model("PromoCode", PromoCodeSchema)
module.exports.Schema = PromoCodeSchema
