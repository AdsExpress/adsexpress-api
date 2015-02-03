'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  NestedSetPlugin = require('mongoose-nested-set'),
  Schema = mongoose.Schema;


/**
 * Category Schema
 */
var CategorySchema = new Schema({
  _id: {
    type: Schema.ObjectId,
    auto: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    trim: true,
    index: true
  }
});

// Set Category Schema as Nested-set
CategorySchema.plugin(NestedSetPlugin);

/**
 * Validations
 */
CategorySchema.path('name').validate(function(name) {
  return !!name;
}, 'Category name cannot be blank');

CategorySchema.path('slug').validate(function(slug) {
  return !!slug;
}, 'Slug cannot be blank');

mongoose.model('Category', CategorySchema);
