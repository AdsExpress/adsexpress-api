'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  autoIncrement = require('mongoose-auto-increment'),
  Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

/**
 * Adv Schema
 */
var AdvSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  modified: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  comment_status: {
    type: Boolean,
    default: true
  },
  status: {
    type: Boolean,
    default: false
  },
  tags: {
    type: [String]
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

AdvSchema.plugin(autoIncrement.plugin, { model: 'Adv', startAt: 100, incrementBy: 1});

/**
 * Validations
 */
AdvSchema.path('title').validate(function(title) {
  return !!title;
}, 'Adv title cannot be blank');

mongoose.model('Adv', AdvSchema);
