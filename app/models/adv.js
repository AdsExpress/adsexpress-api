'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  autoIncrement = require('mongoose-auto-increment'),
  Schema = mongoose.Schema,
  _ = require('lodash');

autoIncrement.initialize(mongoose.connection);

var isNumeric = function (obj) {
    obj = typeof(obj) === 'string' ? obj.replace(',', '.') : obj;
    return !isNaN(parseFloat(obj)) && isFinite(obj) && Object.prototype.toString.call(obj).toLowerCase() !== '[object array]';
};

var validateTextLength = function (value, callback){
  callback(String(value).length > 15);
};

var ImageSchema = new Schema({
  urlpath : String,
  name: String,
  size: Number,
  created: Date,
  isFront: {
    type: Boolean,
    default: false
  }
});
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
    trim: true,
    validate: [validateTextLength, 'The Title must be 15 char at least']
  },
  content: {
    type: String,
    trim: true,
    validate: [validateTextLength, 'The Content must be 15 char at least']
  },
  comment_status: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    default: 'pending', // (pending, rejected, published),
    index: true
  },
  tags: {
    type: [String],
    index: true
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
  },
  location: {
    type: Schema.Types.ObjectId,
    required: true
  },
  images: [ImageSchema],
  price: {
    type: Number,
    index: true
  },
  phone: {
    type: String
  },
  email: {
    type: String
  },
  publish_status: {
    type: String,
    default: 'unactive', // (active, unactive)
    index: true
  },
  expired_date: {
    type: Date,
    index: true
  },
  deleted: {
    type: Boolean,
    default: false,
    index: true
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
      status: 'published',
      deleted: false, // Get only not deleted advs
      publish_status: 'active' // Get only active advs
    };

    if(queryString.categoryId){
      filter.category = queryString.categoryId;
    } else if(queryString.categoryId === null){
      return callback(null, {}); // retrun null if not found category
    }

    if(queryString.keyword.trim() && queryString.keyword.trim().length >= 3){
      var tags = queryString.keyword.split(' ');

      // removes tags that length lower then 3 chars
      _.remove(tags, function(tag){ return tag.length < 3; });

      var or = [
        { title: {$regex: queryString.keyword, $options: 'i'} },
        { content: {$regex: queryString.keyword, $options: 'i'}  },
        { tags: { $elemMatch: { $in : tags } } }
      ];

      filter.$or = or;
    }

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
      { $limit: parseInt(limit)},
      { $skip: parseInt(skip)},
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
        if(!data) data = {};
        return callback(null, data);
      }).end();
    });
  },

  getInfo: function(id, callback){
    var self = this;
    var filter = {
      status: true,
      _id: id
    };

    self.findOne(filter, function(err, data){
      if(err){
        return callback(err);
      }

      var opts = [
        { path: 'category', select: 'name slug', model: 'Category'},
        { path: 'user', select: 'name username', model: 'User'}
      ];

      var promise = self.populate(data, opts);

      promise.then(function(data){
        if(!data) data = {};
        return callback(null, data);
      }).end();

    });
  }
};

mongoose.model('Adv', AdvSchema);
mongoose.model('Image', ImageSchema);
