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

  Adv.search(filter, 10, 0, function(err, data){
    if (err){
      return res.status(500).json({
        error: 'Faild to load advs'
      });
    }

    res.json(data);
  });
};
