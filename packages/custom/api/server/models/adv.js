'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  autoIncrement = require('mongoose-auto-increment'),
  Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

var isNumeric = function (obj) {
    obj = typeof(obj) === 'string' ? obj.replace(',', '.') : obj;
    return !isNaN(parseFloat(obj)) && isFinite(obj) && Object.prototype.toString.call(obj).toLowerCase() !== '[object array]';
};

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
  },
  meta: [{ mkey: String, mValue: Schema.Types.Mixed }],
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
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

/**
 * Statics
 **/
AdvSchema.statics = {

  search : function(queryString, callback){
    var self = this;

    var filter = {
      $and : [{
        status: true,
        $or: [
          { title: new RegExp(queryString.keyword, 'i') },
          { content: new RegExp(queryString.keyword, 'i') },
          { tags: { $elemMatch: { $in : [queryString.keyword] } } }
        ]
      }]
    };

    var limit = queryString.limit;
    if(!isNumeric(limit) || limit <= 0){
      limit = 10;
    }

    var skip = queryString.offset;
    if(!isNumeric(skip) || skip < 0){
      skip = 0;
    }

    self.aggregate([
      { $match: filter },
      { $limit: limit},
      { $skip: skip},
      { $sort: {created: -1}}
    ],function(err, data){
      if (err){
        return callback(err, {});
      }

      var opts = [
        { path: 'category', select: 'name slug', model: 'Category'},
        { path: 'user', select: 'name username', model: 'User'}
      ];

      var promise = self.populate(data, opts);

      promise.then(function(data){
        return callback(null, data);
      }).end();
    });
  }
};

mongoose.model('Adv', AdvSchema);
