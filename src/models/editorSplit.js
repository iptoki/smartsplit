const mongoose = require('mongoose')
const uuid = require('uuid').v4
const User = require('./user')
const Workpiece = require('./workpiece')
const { ConflictingEditorSplitState } = require('../errors')

const EditorSplitSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			default: uuid,
		},
		workpiece_id: {
			type: String,
			required: true,
			validate: function validator(val) {
				return Workpiece.ensureExists(val)
			},
		},
		rightHolder_id: {
			type: String,
			required: true,
			validate: function validator(val) {
				return User.ensureExists(val)
			},
		},
		editor_id: {
			type: String,
			validate: function validator(val) {
				return User.ensureExists(val)
			},
		},
		hasEditor: {
			type: Boolean,
			required: true,
		},
		shares: { type: Number, min: 0, max: 50 },
		_state: {
			type: String,
			enum: ['draft', 'pending', 'accepted', 'rejected'],
		},
	},
	{ toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

EditorSplitSchema.virtual('editor', {
	ref: 'User',
	localField: 'editor_id',
	foreignField: '_id',
	justOne: true,
	autopopulate: true,
})

EditorSplitSchema.virtual('workpiece', {
	ref: 'Workpiece',
	localField: 'workpiece_id',
	foreignField: '_id',
})

EditorSplitSchema.virtual('rightHolder', {
	ref: 'User',
	localField: 'rightHolder_id',
	foreignField: '_id',
})

EditorSplitSchema.pre('save', function saveMiddleware(next) {
	if (this.hasEditor === false) {
		this.editor_id = undefined
		this.shares = undefined
		this._state = undefined
	}
	if (this.hasEditor === true && !this._state) this._state = 'draft'
	if (this._state === 'pending') {
		if (!this.editor_id || !this.shares)
			return next(
				new Error(
					'Cannot save _state as pending without fields `shares` and `editor_id` being set.'
				)
			)
	}
	next()
})

EditorSplitSchema.pre('remove', function removeMiddleware(next) {
	if (this._state === 'accepted') throw ConflictingEditorSplitState
	next()
})

EditorSplitSchema.methods.update = function (data) {
	if (this._state === 'accepted') {
		throw ConflictingEditorSplitState
	}
	if (data._state === 'pending' && this._state !== 'draft') {
		throw ConflictingEditorSplitState
	}
	if (data._state === 'accepted' && this._state !== 'pending') {
		throw ConflictingEditorSplitState
	}
	if (data._state === 'rejected' && this._state !== 'pending') {
		throw ConflictingEditorSplitState
	}
	if (this._state === 'rejected') data._state = 'draft'
	this.patch(data)
}

EditorSplitSchema.statics.create = function (data) {
	return new EditorSplit({ ...data, _state: 'draft' })
}

const EditorSplit = mongoose.model('EditorSplit', EditorSplitSchema)

module.exports = EditorSplit
