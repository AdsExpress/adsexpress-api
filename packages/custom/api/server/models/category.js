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

/**
 * Statics
 */
CategorySchema.statics.getList = function getList(_slug, listChild, cb){
  this.findOne({ slug : _slug }, function(err, _category){
    if(_category){
      if(listChild){
        _category.descendants(cb);
      }else{
        cb(err, _category);
      }
    }else{
      cb(err, {});
    }
  });
};

mongoose.model('Category', CategorySchema);
