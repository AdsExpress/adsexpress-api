'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Adv = mongoose.model('Adv');


exports.list = function(req, res, auth){
  var queryString = req.query;

  var filter = {
    $and : [{
      status: true,
      $or: [{ title: new RegExp(queryString.keyword, 'i') }, {content: new RegExp(queryString.keyword, 'i') }]
    }]
  };

  Adv.aggregate([
    { $match: filter },
    { $limit: 10},
    { $sort: {created: -1}}
  ],function(err, data){
    if (err){
      return res.status(500).json({
        error: 'Faild to load advs'
      });
    }

    var opts = [
      { path: 'category', select: 'name slug', model: 'Category'},
      { path: 'user', select: 'name username', model: 'User'}
    ];

    var promise = Adv.populate(data, opts);

    promise.then(function(data){
      return res.json(data);
    }).end();
  });
};
