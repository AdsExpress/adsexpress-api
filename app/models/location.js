'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


var validateUniqueCode = function (value, callback){
  var Location = mongoose.model('Location');
  Location.find({
    $and : [{
      code: value
    }, {
      _id: {
        $ne: this._id
      }
    }]
  }, function(err, location){
    callback(err || location.length === 0);
  });
};
/**
 * Location Schema
 */
var LocationSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    trim: true,
    index: true,
    unique: true,
    validate: [validateUniqueCode, 'Code is already in-use']
  },
  status: {
    type: Boolean,
    required: true,
    index: true,
    default: true
  }
});

/**
 * Validations
 */
LocationSchema.path('name').validate(function(name) {
  return !!name;
}, 'Location name cannot be blank');

LocationSchema.path('code').validate(function(code) {
  return !!code;
}, 'Code cannot be blank');

/**
 * Statics
 */
LocationSchema.statics = {

  findByCode : function(code, cb){
    this.model('Location').findOne({code: code}).exec(cb);
  }

};

mongoose.model('Location', LocationSchema);
