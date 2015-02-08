'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Adv = mongoose.model('Adv');


exports.checkCategory = function(req, res, next){
  if(req.query.category){
    var Category = mongoose.model('Category');
    Category.loadBySlug(req.query.category, function(err, data){
      if (err){
        return res.status(500).json({
          error: 'Faild to load advs'
        });
      }

      if(data){
        req.query.categoryId = data._id;
      }else{
        req.query.categoryId = null; // retrun null if not found category
      }
      next();
    });
  }else{
    next();
  }
};

exports.list = function(req, res){

  Adv.search(req.query, function(err, data){
    if (err){
      return res.status(500).json({
        error: 'Faild to load advs'
      });
    }

    res.json(data);
  });
};
