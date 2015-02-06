'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Category = mongoose.model('Category');

exports.category = function (req, res, next, slug){
  Category.getList(slug, true, function (err, data){
    if (err){
      res.status(500).json({
        error: 'Faild to load categories'
      });
    }
    res.json(data);
  });
};
