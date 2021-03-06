const mongoose = require('mongoose')
const uuid = require('uuid').v4
const User = require('./user')
const { SplitTemplates } = require('./notificationTemplates')
const JWT = require('../utils/jwt')
const RightSplitSchema = require('./rightSplit')
const DocumentationSchema = require('./documentation')
const RightTypes = require('../constants/rightTypes')
const Tasks = require('../constants/tasks')
const {
	UserNotFound,
	RightSplitNotFound,
	ConflictingRightSplitState,
} = require('../errors')

const JWT_SPLIT_TYPE = 'workpiece:split-invite'

const StatusSchema = {
	type: String,
	enum: Tasks.Status.list,
	default: Tasks.Status.UNREQUESTED,
}

const TaskSchema = new mongoose.Schema(
	{
		[Tasks.Types.SOCAN]: StatusSchema,
		[Tasks.Types.SOCAN_DR]: StatusSchema,
		[Tasks.Types.SOPROQ]: StatusSchema,
		[Tasks.Types.ARTISTI]: StatusSchema,
		[Tasks.Types.BANQ]: StatusSchema,
		history: [
			new mongoose.Schema(
				{
					task: {
						type: String,
						enum: Tasks.Types.list,
					},
					from: StatusSchema,
					to: StatusSchema,
				},
				{ _id: false, timestamps: true }
			),
		],
	},
	{ _id: false }
)

const WorkpieceSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			alias: 'workpiece_id',
			default: uuid,
		},
		type: {
			type: String,
			enum: ['original-creation', 'remix', 'cover'],
		},
		title: {
			type: String,
		},
		owner: {
			type: String,
			ref: 'User',
		},
		collaborators: [
			new mongoose.Schema(
				{
					user: {
						type: String,
						ref: 'User',
					},
					isRightHolder: {
						type: Boolean,
						default: false,
					},
					isInsideDoc: {
						type: Boolean,
						default: false,
					},
					permission: {
						type: String,
						enum: ['read', 'write', 'admin'],
						default: 'read',
					},
					displayEditorNotif: {
						type: Boolean,
						default: true,
					},
				},
				{ _id: false }
			),
		],
		rightSplit: {
			type: RightSplitSchema,
		},
		archivedSplits: {
			type: [RightSplitSchema],
		},
		documentation: {
			type: DocumentationSchema,
			default: {},
		},
		tasks: {
			type: TaskSchema,
			default: {},
		},
	},
	{ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

WorkpieceSchema.virtual('rightHolders').get(function () {
	return this.collaborators.filter((c) => c.isRightHolder).map((c) => c.user)
})

WorkpieceSchema.virtual('editorSplit', {
	ref: 'EditorSplit',
	localField: '_id',
	foreignField: 'workpiece_id',
	justOne: true,
})

WorkpieceSchema.virtual('_purchases', {
	ref: 'Purchase',
	localField: '_id',
	foreignField: 'workpiece',
	match: { status: { $in: ['succeeded', 'pending'] } },
})

WorkpieceSchema.virtual('purchases').get(function () {
	if (!Array.isArray(this._purchases)) return []
	return this._purchases.map((x) => x.product._id)
})

WorkpieceSchema.query.byOwner = function (user_id) {
	return this.where({ owner: user_id })
}

WorkpieceSchema.query.byCollaborator = function (user_id) {
	return this.where({
		'collaborators.user': { $in: [user_id] },
		owner: { $ne: user_id },
	})
}

WorkpieceSchema.methods.getOwnerId = function () {
	return this.populated('owner') ? this.owner._id : this.owner
}

WorkpieceSchema.methods.isOwnerPartOfRightHolders = function () {
	return this.getRightHolderIds().includes(this.getOwnerId())
}

WorkpieceSchema.methods.createToken = function (
	rightHolderId,
	expires = '7 days'
) {
	return JWT.create(
		JWT_SPLIT_TYPE,
		{
			workpiece_id: this._id,
			rightHolder_id: rightHolderId,
		},
		expires
	)
}

WorkpieceSchema.methods.decodeToken = function (token) {
	return JWT.decode(JWT_SPLIT_TYPE, token)
}

WorkpieceSchema.methods.setRightSplit = async function (data) {
	if (
		this.rightSplit &&
		!['draft', 'rejected'].includes(this.rightSplit._state)
	)
		throw ConflictingRightSplitState

	if (!this.rightSplit) {
		const nArchived = this.archivedSplits.length
		const version =
			nArchived > 0 ? this.archivedSplits[nArchived - 1].version + 1 : 1
		this.rightSplit = {
			owner: data.owner,
			_state: 'draft',
			version,
			isPublic: false,
		}
	}
	if (this.rightSplit && this.rightSplit._state === 'rejected') {
		if (!data.owner || !(await User.exists({ _id: data.owner })))
			throw UserNotFound
		this.archivedSplits.push(this.rightSplit)
		this.rightSplit = {
			owner: data.owner,
			_state: 'draft',
			isPublic: false,
			version: this.rightSplit.version + 1,
		}
	}

	await this.rightSplit.update(data)

	this.updateRightHolders()
}

WorkpieceSchema.methods.updateRightHolders = function () {
	const rightHolderIds = this.getRightHolderIds()
	this.collaborators = this.collaborators.filter(
		(item) =>
			item.isInsideDoc ||
			!item.isRightHolder ||
			rightHolderIds.includes(item.user)
	)
	let alreadyAdded = []
	for (const collaborator of this.collaborators) {
		if (!rightHolderIds.includes(collaborator.user))
			collaborator.isRightHolder = false
		else alreadyAdded.push(collaborator.user)
	}
	for (const uid of rightHolderIds.filter((uid) => !alreadyAdded.includes(uid)))
		this.collaborators.push({
			user: uid,
			isRightHolder: true,
			permission: uid === this.getOwnerId() ? 'admin' : 'read',
		})
}

WorkpieceSchema.methods.setSplitVote = function (rightHolderId, data) {
	if (!this.rightSplit) throw RightSplitNotFound

	const initialState = this.rightSplit._state
	this.rightSplit.setVote(rightHolderId, data)

	if (initialState !== this.rightSplit._state) this.emailSplitResult()
}

WorkpieceSchema.methods.isRemovable = function () {
	return (
		!this.rightSplit || ['draft', 'rejected'].includes(this.rightSplit._state)
	)
}

WorkpieceSchema.methods.canVoteRightSplit = function () {
	return this.rightSplit && this.rightSplit._state === 'voting'
}

WorkpieceSchema.methods.emailRightHolders = async function (
	notificationType,
	skipSplitOwner,
	overwrites = {}
) {
	if (!this.rightSplit) return

	let promises = []
	const rightHolderIds = this.getRightHolderIds()

	for (const uid of rightHolderIds) promises.push(User.findById(uid))

	for (const rh of await Promise.all(promises)) {
		if (skipSplitOwner && rh._id === this.rightSplit.getOwnerId()) continue
		rh.sendNotification(notificationType, {
			workpiece: this,
			to: { name: rh.fullName, email: overwrites[rh._id] || rh.email },
		})
	}
}

WorkpieceSchema.methods.emailOwner = async function (notificationType) {
	if (!this.populated('owner')) await this.populate('owner').execPopulate()
	this.owner.sendNotification(notificationType, {
		workpiece: this,
	})
}

WorkpieceSchema.methods.submitRightSplit = function (overwrites) {
	if (!this.rightSplit || this.rightSplit._state !== 'draft')
		throw ConflictingRightSplitState
	this.rightSplit._state = 'voting'
	this.emailRightHolders(SplitTemplates.CREATED, true, overwrites)
	this.rightSplit.updateState()
	this.emailSplitResult()
}

WorkpieceSchema.methods.swapRightHolder = function (originalId, swapId) {
	for (item of this.collaborators) {
		if (item.user === originalId) item.user = swapId
	}
	this.rightSplit.swapRightHolder(originalId, swapId)
}

WorkpieceSchema.methods.emailSplitResult = function () {
	if (!['accepted', 'rejected'].includes(this.rightSplit._state)) return
	const template =
		this.rightSplit._state === 'accepted'
			? SplitTemplates.ACCEPTED
			: SplitTemplates.REJECTED
	this.emailRightHolders(template, false)
	if (!this.isOwnerPartOfRightHolders()) this.emailOwner(template)
}

WorkpieceSchema.methods.deleteRightSplit = function () {
	if (this.rightSplit && this.rightSplit._state !== 'draft')
		throw ConflictingRightSplitState
	this.rightSplit = undefined
}

WorkpieceSchema.methods.getPathsToPopulate = function () {
	return [
		'owner',
		'_purchases',
		...this.getCollaboratorsPathsToPopulate(),
		...this.documentation.getPathsToPopulate(),
		...(this.rightSplit ? this.rightSplit.getPathsToPopulate() : []),
		...this.getArchivedRightSplitsPathsToPopulate(),
	]
}

WorkpieceSchema.methods.populateAll = function () {
	return this.populate(this.getPathsToPopulate()).execPopulate()
}

WorkpieceSchema.methods.getCollaboratorsPathsToPopulate = function () {
	let paths = []
	for (let i = 0; i < this.collaborators.length; i++)
		paths.push(`collaborators.${i}.user`)
	return paths
}

WorkpieceSchema.methods.getArchivedRightSplitsPathsToPopulate = function () {
	let paths = []
	for (let i = 0; i < this.archivedSplits.length; i++) {
		paths.push(`archivedSplits.${i}.owner`)
		paths.push(`archivedSplits.${i}.label.rightHolder`)
		for (let rightType of RightTypes.list) {
			if (!Array.isArray(this.archivedSplits[i][rightType])) continue
			for (let j = 0; j < this.archivedSplits[i][rightType].length; j++)
				paths.push(`archivedSplits.${i}.${rightType}.${j}.rightHolder`)
		}
	}
	return paths
}

WorkpieceSchema.methods.getCollaboratorPermission = function (collaborator_id) {
	for (const item of this.collaborators) {
		if (item.user === collaborator_id) return item.permission
	}
	return null
}

WorkpieceSchema.methods.addCollaboratorById = async function (
	collaborator_id,
	permission
) {
	await User.ensureExistsAndRetrieve(collaborator_id)
	for (const item of this.collaborators) {
		if (item.user === collaborator_id) {
			item.permission = permission
			return
		}
	}
	this.collaborators.push({
		user: collaborator_id,
		permission,
	})
}

WorkpieceSchema.methods.updateTaskStatus = function (task, to) {
	const from = this.tasks[task]
	this.tasks[task] = to
	this.tasks.history.push({ task, from, to })
}

WorkpieceSchema.methods.updateCollaboratorById = async function (
	collaborator_id,
	permission
) {
	for (const item of this.collaborators) {
		if (item.user === collaborator_id) {
			item.permission = permission
			return
		}
	}
	throw UserNotFound
}

WorkpieceSchema.methods.deleteCollaboratorById = async function (
	collaborator_id,
	permission
) {
	for (let i = 0; i < this.collaborators.length; i++) {
		if (this.collaborators[i].user === collaborator_id) {
			if (this.collaborators[i].isRightHolder) throw UserForbidden
			this.collaborators.splice(i, 1)
			return
		}
	}
	throw UserNotFound
}

WorkpieceSchema.methods.getRightHolderIds = function () {
	if (!this.rightSplit) return []
	return this.rightSplit.getRightHolderIds()
}

module.exports = mongoose.model('Workpiece', WorkpieceSchema)
