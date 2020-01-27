/**
 * Génère une série de fonctions qui permet de générer les fonctions PATCH pour chacun des champs avec une répétition minimale
 */
module.exports = function(target, findFromRequest) {
return {
	/**
	 * Mets à jours un champ dans le modèle, l'enregistre et retourne les modifications
	 */
	replace: async function(methodName, field) {
	target[methodName] = async function(req, res) {
		const body = req.swagger.params[field].value
		const obj = await findFromRequest(req, res)
		const out = {}
		obj[field] = out[field] = body[field]
		await obj.save()
		res.json(out)
	}},

	/**
	 * Mets à jours un champ dans le modèle, en combinant l'objet en entrée avec celui en base de donnée.
	 */
	merge: async function(methodName, field) {
	target[methodName] = async function(req, res) {
		const body = req.swagger.params[field].value
		const obj = await findFromRequest(req, res)
		const out = {}
		out[field] = obj[field]

		for(let k in body) {
			obj[field].set(k, body[k])
		}
		
		await obj.save()
		res.json(out)
	}},

	/**
	 * Mets à jours un champ dans le modèle en ajoutant les nouvelles valeurs au tableau existant en base de donnée.
	 */
	concat: async function(methodName, field) {
	target[methodName] = async function(req, res) {
		const body = req.swagger.params[field].value
		const obj = await findFromRequest(req, res)
		const out = {}
		
		obj[field] = out[field] = obj[field].concat(body)
		
		await obj.save()
		res.json(out)
	}},
}}
