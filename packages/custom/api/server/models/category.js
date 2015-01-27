'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Category Schema
 */
var CategorySchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  left: {
    type: Number,
  },
  right: {
    type: Number,
  },
});

/**
 * Validations
 */
CategorySchema.path('name').validate(function(name) {
  return !!name;
}, 'Name cannot be blank');


/**
 * Statics
 */
mongoose.model('Category', CategorySchema);
