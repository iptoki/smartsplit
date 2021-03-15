const { ConflictingRightSplitState } = require("../../routes/errors")
const RightTypes = require("../../constants/rightTypes")

const Templates = {
	rightHolder: {
		fr:
			"<column><rank>{{rank}}</rank></column><column><p><b>{{contributor_fullName}}</b> portant le nom d’artiste <i>«{{contributor_artistName}}»</i><strong>- IPI #{{contriputor_ipi}}</strong></p><p>Domicilié au {{contributor_address}} \nEt joignable par téléphone au {{contributor_phoneNumber}} et par courriel au <a href='mailto:{{contributor_email}}'>{{contributor_email}}</a>.</p></column>",
		en:
			"<column><rank>{{rank}}</rank></column><column><p><b>{{contributor_fullName}}</b> with the artist’s name <i>«{{contributor_artistName}}»</i><strong>- IPI #{{contriputor_ipi}}</strong></p><p>Resident at {{contributor_address}} \nAnd reachable by phone at {{contributor_phoneNumber}} and by email at <a href='mailto:{{contributor_email}}'>{{contributor_email}}</a>.</p></column>",
	},
	contract: {
		fr: {
			header:
				"<h1>ENTENTE DE PARTAGE DE DROITS</h1><p><i>Droit d’auteur sur l’oeuvre & Droits voisins des artistes-interprètes et producteurs</i></p>",
			sections: {
				generalInformations:
					"<h2>Entente concernant la pièce musicale originale :</h2><p><strong>{{workpiece_title}}</strong>, ci-après la <b>«pièce»</b> musicale.</p>",
				rightHolders: {
					title:
						"<h2>Entente intervenue entre les contributeurs suivants :</h2>",
					list: [
						"<p><i>Tous ci-dessus collectivement nommés les «contributeurs» ou les «parties»</i></p>",
					],
				},
				rightSplits: {
					title:
						"Les contributeurs s’entendent sur ces partages de droits en lien avec la «pièce» :",
					copyright: [],
					performance: [],
					recording: [],
					label: {},
				},
				agreementConditions: {
					description:
						"<h2>Conditions de l’entente</h2><p>La présente entente est en vigueur pour la durée des droits de chacun des contributeurs relativement à la pièce musicale.</p><p>Par la présente, les contributeurs acceptent les différents partages de droits présentés à la page précédente, soit le partage relatif au droit d’auteur sur l’oeuvre musicale, au droit voisin lié aux prestations ainsi que le droit voisin lié à l’enregistrement sonore de la pièce musicale <strong>{{workpiece_title}}</strong>.</p>",
					copyright: {
						title: "<h3>DROITS D’AUTEUR</h3>",
						content:
							"<li><row>Chaque contributeur ayant participé à la <i>création</i> de l’oeuvre <strong>{{workpiece_title}}</strong> :</row><nol><li>représente et garantit que l’oeuvre est originale et qu’elle n’enfreint pas les droits de tiers, incluant tout droit de propriété intellectuelle;</li><li>comprend qu’il peut, à sa discrétion, céder, concéder une licence sur ou faire administrer sa portion respective des droits d’auteur sur l’oeuvre à des tiers de son choix (p. ex. éditeurs, administrateur d’éditions, co-éditeurs, sous-éditeurs);</li><li>représente et garantit qu’il a le droit et la capacité de conclure et respecter la présente entente et qu’il n’a aucune restriction contractuelle ou autre l’empêchant de conclure et respecter la présente entente.</li></nol></li>",
					},
					performance: {
						title: "<h3>INTERPRÉTATION</h3>",
						content:
							"<li>Chaque contributeur ayant participé à la prestation fixée sur l’enregistrement sonore de l’oeuvre {{workpiece_title}} :<nol><li>représente et garantit que la prestation dont il se prétend l’artiste-interprète a bel et bien été effectuée par lui, et qu’elle n’enfreint pas les droits de tiers, incluant tout droit de propriété intellectuelle;</li><li>comprend qu’il peut, à sa discrétion, céder, concéder une licence sur ou faire administrer sa portion respective des droits voisins sur la prestation fixée sur l’enregistrement sonore à des tiers de son choix (p. ex. producteur de l’enregistrement sonore);</li><li>représente et garantit qu’il a le droit et la capacité de conclure et respecter la présente entente, et qu’il n’a aucune restriction contractuelle ou autre l’empêchant de conclure et respecter la présente entente.</li></nol></li>",
					},
					recording: {
						title: "<h3>ENREGISTREMENT SONORE</h3>",
						content:
							"<li><row>Chaque contributeur ayant participé à la production de l’enregistrement sonore de l’oeuvre <strong>{{workpiece_title}}</strong> :</row><nol><li>représente et garantit que l’enregistrement sonore n’enfreint pas les droits de tiers, incluant tout droit de propriété intellectuelle;</li><li>comprend qu’il peut, à sa discrétion, céder, concéder une licence sur ou faire administrer sa portion respective des droits voisins sur l’enregistrement sonore à des tiers de son choix;</li><li>représente et garantit qu’il a le droit et la capacité de conclure et respecter la présente entente, et qu’il n’a aucune restriction contractuelle ou autre l’empêchant de conclure et respecter la présente entente.</li></nol</li>",
					},
				},
				recommendations:
					"<h2>Prochaines étapes recommandées</h2><p>Cette entente se limite à la définition du partage de droits entre les contributeurs et quelques aspects connexes. Sans s’y limiter, les contributeurs sont par ailleurs responsables de :</p><aol><li>définir entre eux toute autre modalité relative à l’exploitation de l’oeuvre et au partage des revenus (incluant le paiement de toute avance);</li><li>procéder à la déclaration des partages de droits sur l’oeuvre, la prestation et l’enregistrement sonore de la pièce musicale aux Sociétés de gestion de collective droits pertinentes (comme la SOCAN, la SOPROQ, ARTISTI au Canada);</li><li>s’assurer de respecter toute entente collective applicable ou toute obligation découlant d’une loi relative au statut des artistes; et honorer ses propres ententes préalablement signées avec des tiers  (p. ex. éditeurs, administrateur d’éditions, co-éditeurs, sous-éditeurs).</li></aol>",
				moralRights:
					"<h2>Droits moraux</h2><p>La notice de titularité suivante doit obligatoirement accompagner toute exploitation de la pièce musicale : <i><strong>«{{workpiece_title}}»</strong></i>. Cette notice doit être reproduite telle quelle sur toutes communications en lien avec la pièce musicale, et en lien avec toute exploitation de la pièce musicale, selon les standards de l’industrie.</p><p>Chaque contributeur comprend que la présente entente n’emporte aucune renonciation au droit moral, et qu’il ne pourra déformer, mutiler ou autrement modifier l’œuvre ou la prestation, ou les utiliser en liaison avec un produit, un service, une cause ou une institution d’une manière préjudiciable à l’honneur ou à la réputation des contributeurs ayant des droits relatifs à l’œuvre ou la prestation sans leur accord préalable.</p>",
				otherConditions:
					"<h2>Autres conditions</h2><p>Toute modification à la présente entente sera sans effet si elle n’est pas explicitement acceptée par écrit et signée par les l’ensemble des contributeurs. Pour plus de certitude, le fait pour un contributeur de céder, concéder une licence ou faire administrer sa portion respective des droits ne constitue pas une modification pour laquelle l’accord des autres contributeurs est requis.</p><p>Sauf avis contraire unanime des contributeurs, cette entente doit demeurer confidentielle (à l’exception de toute divulgation requise par toute loi, règlement ou ordonnance, ou pour l’administration de la portion respective des droits de chacun par un tiers comme une société de gestion collective, un éditeur, un co-éditeur ou un sous-éditeur). Dans le cas où les contributeurs s’entendent de manière unanime pour rendre publics les détails sur le partage de leurs droits, alors IPtoki Inc., les sociétés membres de son groupe ainsi que leurs successeurs, ayants-droit, et cessionnaires respectifs (ci-après collectivement <i>«Smartsplit»</i>) seront réputés être en droit de pouvoir utiliser ces données, les noms d’artiste des contributeurs et leur image afin de présenter et promouvoir publiquement ce partage de droits en guise d’exemple dans toute communication et sur la plateforme <i>Smartsplit</i>.</p><p>Chaque contributeur comprend que la présente entente lie seulement et uniquement les contributeurs. Chaque contributeur accepte et reconnaît que <i>Smartsplit</i> n’est pas partie à la présente entente.</p><p>Chaque contributeur s’engage à indemniser, défendre et tenir à couvert les autres contributeurs de toutes pertes, réclamations, dommages, frais ou responsabilités, incluant tout honoraire d’avocat raisonnable, que ceux-ci pourraient subir ou encourir en raison de tout manquement, défaut ou violation de tout terme, obligation, représentation ou garantie de la présente entente.</p><p>Toute décision d’un tribunal à l’effet que l’une des dispositions de la présente entente est nulle ou non exécutoire n’affectera aucunement les autres dispositions ou leur validité ou leur force exécutoire.</p><p>La présente entente lie et est exécutoire non seulement à l’égard des contributeurs mais également de leurs héritiers, successeurs, ayants droit et représentants légaux.</p><p>La présente entente contient l’énoncé intégral et unique de l entente intervenue entre les contributeurs relativement à l’objet des présentes. Les contributeurs reconnaissent qu’aucune autre promesse ou représentation ne leur a été faite et qu’aucune convention verbale ou autre n’est intervenue entre elles relativement à l’objet de la présente entente. La présente entente annule et remplace toute entente, représentation ou proposition antérieure à la signature des présentes.</p><p>Peu importe son lieu d’application, la présente entente doit être interprétée et appliquée selon les lois applicables dans la province de Québec. En cas de litige découlant de la présente entente, les parties accordent juridiction aux cours du district judiciaire de Montréal.</p><p>Pour plus de certitude, le terme “interprétation”, tel qu’utilisé dans le contexte de cette entente, a le même sens que le terme “prestation” (art. 2 de la <i>Loi sur le droit d’auteur</i>, L.R.C. (1985), ch. C-42).</p><p>Les contributeurs reconnaissent avoir lu, compris et accepté les termes et conditions et la politique de confidentialité de <i>Smartsplit</i>.</p>",
				signatures: {
					text:
						"<p>En foi de quoi les parties ont signé à Montréal, Province de Québec, ce {{contractSignDate}}.</p>",
					signatories: [],
				},
			},
			footer: "Entente de partage de droits - Page",
		},

		en: {
			header:
				"<h1>RIGHTS SHARING AGREEMENT</h1><p><i>Copyright in the work & Related rights of performers and producers</i></p>",
			sections: {
				generalInformations:
					"<h2>Agreement regarding the original musical piece :</h2><p><strong>{{workpiece_title}}</strong>, hereafter the musical <b>«piece»</b>.</p>",
				rightHolders: {
					title: "<h2>Agreement between the following contributors :</h2>",
					list: [
						"<p><i>All of the above collectively referred to as the «Contributors» or the «Parties».</i></p>",
					],
				},
				rightSplits: {
					title:
						"The contributors agree on these shares of rights in connection with the «piece» :",
					copyright: [],
					performance: [],
					recording: [],
					label: {},
				},
				agreementConditions: {
					description:
						"<h2>Terms of Agreement</h2><p>This agreement is effective for the duration of each contributor’s rights with respect to the musical piece.</p><p>The contributors hereby agree to the various shares of rights set forth on the preceding page, namely, the share relating to the copyright in the musical work, the neighboring right related to the performances, as well as the neighboring right related to the sound recording of the <strong>{{workpiece_title}}</strong>.</p>",
					copyright: {
						title: "<h3>COPYRIGHTS</h3>",
						content:
							"<li><row>Each contributor who participated in the <i>creation</i> of the work <strong>{{workpiece_title}}</strong> : </row><nol><li>represents and warrants that the work is original and does not infringe upon the rights of any third party, including any intellectual property rights;</li><li>understands that he/she may, at his/her discretion, assign, license, or have administered his/her respective portion of the copyright in the work to third parties of his/her choice (e.g., publishers, administrator of editions, etc.). e.g., publishers, publishing administrator, co-publishers, sub-publishers);</li><li>represents and warrants that he/she has the right and ability to enter into and abide by this Agreement and that he/she has no contractual or other restrictions preventing him/her from entering into and abiding by this Agreement.</li></nol></li>",
					},
					performance: {
						title: "<h3>PERFORMANCE</h3>",
						content:
							"<li>Each contributor who participated in the performance set on the sound recording of the work {{workpiece_title}} : <nol><li>represents and warrants that the performance for which he/she claims to be the performer was in fact performed by him/her, and that it does not infringe upon the rights of any third party, including any intellectual property rights;</li><li>understands that he/she may, at his/her discretion, assign, license, or cause to be administered his/her respective portion of the neighboring rights in the performance affixed to the Sound Recording to third parties of his/her choice (e.g. producer of the sound recording);</li><li>represents and warrants that he/she has the right and ability to enter into and abide by this Agreement, and that he/she has no contractual or other restrictions preventing him/her from entering into and abiding by this Agreement.</li></nol></li>",
					},
					recording: {
						title: "<h3>RECORDING</h3>",
						content:
							"<li><row>Each contributor who participated in the production of the sound recording of the work <strong>{{workpiece_title}}</strong> : </row><nol><li>represents and warrants that the sound recording does not infringe upon the rights of any third party, including any intellectual property rights;</li><li>understands that he or she may, at his or her discretion, assign, license, or cause to be administered his or her respective portion of the neighboring rights in the sound recording to third parties of his or her choosing; </li><li>represents and warrants that it has the right and ability to enter into and comply with this Agreement, and that it has no contractual or other restrictions preventing it from entering into and complying with this Agreement. </li></nol</li>",
					},
				},
				recommendations:
					"<h2>Recommended Next Steps</h2><p>This agreement is limited to defining the sharing of rights between contributors and some related aspects. Without limitation, contributors are otherwise responsible for: </p><aol><li>defining among themselves any other terms and conditions relating to the exploitation of the work and the sharing of revenues (including the payment of any advance);</li><li>proceeding with the declaration of the shares of rights in the work, the performance and the sound recording of the musical piece to the relevant Collective Rights Societies (such as SOCAN, SOPROQ, ARTISTI in Canada); </li><li>ensure that it complies with any applicable collective agreement or obligation under status of the artist legislation; and honor its own previously signed agreements with third parties (e.g., publishers, publishing administrator, etc.). (e.g., publishers, publishing administrators, co-publishers, sub-publishers).</li></aol>",
				moralRights:
					"<h2>Moral Rights</h2><p>The following ownership notice must accompany any exploitation of the musical piece: <i><strong>«{{workpiece_title}}»</strong></i>. This notice must be reproduced as is on all communications in connection with the musical piece, and in connection with any exploitation of the musical piece, according to industry standards. </p><p>Each contributor understands that this agreement does not imply any waiver of moral rights, and that he or she shall not distort, mutilate, or otherwise alter the work or performance, or use it in connection with any product, service, cause, or institution in a manner that is detrimental to the honor or reputation of the contributors with rights in the work or performance without their prior consent.</p>",
				otherConditions:
					"<h2>Other Terms</h2><p>Any modification to this Agreement will be ineffective unless explicitly agreed to in writing and signed by all Contributors. For greater certainty, a contributor's assignment, licensing, or administration of its respective portion of the rights does not constitute a modification for which the agreement of the other contributors is required.</p><p>Unless contributors unanimously agree otherwise, this agreement shall remain confidential (except for any disclosure required by any law, regulation, or ordinance, or for the administration of each contributor's respective portion of the rights by a third party such as a collective society, publisher, co-publisher, or sub-publisher). In the event that the Contributors unanimously agree to make public the details of the division of their rights, then IPtoki Inc, its affiliates, and their respective successors, assigns, and transferees (hereinafter collectively <i>«Smartsplit»</i>) shall be deemed to be entitled to use such data, contributors' artist names, and their likenesses to publicly present and promote such rights sharing as an example in any communication and on the <i>Smartsplit</i> platform.</p><p>Each contributor understands that this agreement is binding only and solely upon the Contributors. Each Contributor agrees and acknowledges that <i>Smartsplit</i> is not a party to this Agreement.</p><p>Each Contributor agrees to indemnify, defend, and hold harmless the other Contributors from and against any and all losses, claims, damages, costs, or liabilities, including any reasonable attorneys' fees, that the other Contributors may suffer or incur as a result of any breach, default, or violation of any term, obligation, representation, or warranty of this Agreement. </p><p>Any determination by a court that any provision of this Agreement is void or unenforceable shall not affect the remaining provisions or their validity or enforceability.</p><p>This Agreement shall be binding upon and enforceable against not only Contributors but also their heirs, successors, assigns and legal representatives.</p><p>This Agreement contains the complete and only statement of the agreement between Contributors with respect to the subject matter herein. Contributors acknowledge that no other promises or representations have been made to them and that no oral or other agreements have been made between them with respect to the subject matter of this Agreement. This Agreement supersedes any agreement, representation or proposal made prior to the execution hereof.</p><p>No matter where it is to be enforced, this Agreement shall be construed and enforced in accordance with the laws applicable in the Province of Quebec. In the event of any dispute arising out of this Agreement, the parties grant jurisdiction to the courts of the judicial district of Montreal.</p><p>For greater certainty, the term “interpretation“ as used in the context of this Agreement has the same meaning as the term “performance“ (s. 2 of the <i>Copyright Act</i>, R.S.C. (1985), c. C-42).</p><p>Contributors acknowledge that they have read, understand, and agree to the <i>Smartsplit</i> terms and conditions and privacy policy.</p>",
				signatures: {
					text:
						"<p>In witness whereof the parties have signed in Montreal, Province of Quebec, this {{contractSignDate}}.</p>",
					signatories: [],
				},
			},
			footer: "Rights sharing agreement - Page",
		},
	},
}

// recursive
const deepReplace = function (object, workpiece) {
	for (const [k, v] of Object.entries(object)) {
		if (typeof v === "string")
			object[k] = v
				.replace(/{{workpiece_title}}/g, workpiece.title)
				.replace(/{{contractSignDate}}/g, "{{contractSignDate}}" /* TODO */)
		else if (typeof v === "object" && !Array.isArray(v))
			object[k] = deepReplace(object[k], workpiece)
	}
	return object
}

const generateTemplate = async function (lang, workpiece) {
	if (!workpiece.rightSplit || workpiece.rightSplit._state !== "accepted")
		throw ConflictingRightSplitState
	await workpiece.populateAll()
	let contract = Templates.contract[lang]
	contract = deepReplace(contract, workpiece)
	let rank = 1
	const rightHolders = workpiece.rightHolders.map((rh) => {
		return Templates.rightHolder[lang]
			.replace(/{{rank}}/g, rank++)
			.replace(/{{contributor_fullName}}/g, rh.fullName)
			.replace(/{{contributor_artistName}}/g, rh.artistName)
			.replace(/{{contriputor_ipi}}/g, rh.ipi)
			.replace(/{{contributor_address}}/g, rh.address)
			.replace(/{{contributor_phoneNumber}}/g, rh.phoneNumber)
			.replace(/{{contributor_email}}/g, rh.email)
	})
	contract.sections.rightHolders.list.unshift(...rightHolders)
	contract.sections.signatures.signatories = workpiece.rightHolders.map(
		(rh) => rh.fullName
	)
	for (const type of RightTypes.list) {
		if (type === "privacy") continue
		if (Array.isArray(workpiece.rightSplit[type])) {
			const obj = workpiece.rightSplit[type].map((x) => {
				return {
					avatar: x.rightHolder.avatarUrl,
					name: x.rightHolder.fullName,
					roles: x.roles,
					function: x.function,
					status: x.status,
					shares: x.shares,
				}
			})
			Object.keys(obj).forEach(
				(key) => obj[key] === undefined && delete obj[key]
			)
			contract.sections.rightSplits[type] = obj
		} else {
			contract.sections.rightSplits[type] = {
				avatar: workpiece.rightSplit[type].rightHolder.avatarUrl,
				name: workpiece.rightSplit[type].rightHolder.fullName,
				agreementDuration: workpiece.rightSplit[type].agreementDuration,
				shares: workpiece.rightSplit[type].shares,
			}
		}
	}
	return contract
}

module.exports = { generateTemplate }
