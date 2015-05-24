'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Category = mongoose.model('Category');

exports.category = function (req, res, next){
  Category.getDescendantsBySlug(req.params.slug, true, function (err, data){
    if(err) return res.jsonMongooseError(err);

    res.jsonResponse(data);
  });
};

exports.all = function (req, res, next){
  Category.getAllRoot(function(err, data){
    if (err){
      return res.jsonMongooseError(err, 500);
    }
    res.jsonResponse(data);
  });
};

exports.create = function(req, res, next){

  req.assert('name', 'You must enter a name').notEmpty();
  req.assert('slug', 'You must enter a slug').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    return res.status(400).json(errors);
  }

  var category = new Category(req.body);

  category.save(function(err){
    if(err) return res.jsonMongooseError(err);

    res.jsonResponse(category);
  });
};

exports.update = function(req, res, next){

  req.assert('name', 'You must enter a name').notEmpty();
  req.assert('slug', 'You must enter a slug').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    return res.status(400).json(errors);
  }

  Category.findOne({_id: req.params.id}, function(err, category){
    if(err) return res.jsonMongooseError(err);

    if(category){
      var data = {
        name: req.body.name,
        slug: req.body.slug,
        status: req.body.status || true
      };

      category.update({$set: data}, function(err){
        if(err) return res.jsonMongooseError(err);

      });

    }else{
      return res.status(400).json({
        errors: 'Faild to load this category'
      });
    }

    return res.jsonResponse(category);
  });
};
