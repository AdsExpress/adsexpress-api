'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  NestedSetPlugin = require('mongoose-nested-set'),
  Schema = mongoose.Schema;


var validateUniqueSlug = function (value, callback){
  var Category = mongoose.model('Category');
  Category.findOne({
    $and : [{
      slug: value
    }, {
      _id: {
        $ne: this._id
      }
    }]
  }, function(err, category){
    callback(err || category.length === 0);
  });
};
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
    index: true,
    unique: true,
    validate: [validateUniqueSlug, 'Slug is already in-use']
  },
  status: {
    type: Boolean,
    required: true,
    index: true,
    default: 0
  }
});

// Set Category Schema as Nested-set
CategorySchema.plugin(NestedSetPlugin, {status: true});

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
CategorySchema.statics = {

  getDescendantsBySlug : function (_slug, listChild, cb){
    this.findOne({ slug : _slug}, function(err, _category){
      if(_category){
        if(listChild){
          _category.selfAndChildren(cb);
        }else{
          cb(err, _category);
        }
      }else{
        cb(err, {});
      }
    });
  },

  getAllRoot : function (cb){
    this.find({parentId : {$exists: false}}, function(err, data){
      if(data){
        cb(err, data);
      }else{
        cb(err, {});
      }
    });
  }
};

mongoose.model('Category', CategorySchema);
