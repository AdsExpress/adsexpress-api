'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Category = mongoose.model('Category');

exports.category = function (req, res, next, slug){
  Category.getDescendantsBySlug(slug, true, function (err, data){
    if (err){
      return res.status(500).json({
        error: 'Faild to load categories'
      });
    }
    res.json(data);
  });
};

exports.all = function (req, res, next){
  Category.getAllRoot(function(err, data){
    if (err){
      return res.status(500).json({
        error: 'Faild to load categories'
      });
    }
    res.json(data);
  });
};

exports.create = function(req, res, next){
  var category = new Category(req.body);

  req.assert('name', 'You must enter a name').notEmpty();
  req.assert('slug', 'You must enter a slug').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    return res.status(400).json(errors);
  }

  category.save(function(err){
    if (err) {
      var modelErrors = [];

      if (err.errors) {

        for (var x in err.errors) {
          modelErrors.push({
            param: x,
            msg: err.errors[x].message,
            value: err.errors[x].value
          });
        }

        return res.status(400).json(modelErrors);
      }
    }

    res.json(category);
  });
};

exports.update = function(req, res, next, id){

  req.assert('name', 'You must enter a name').notEmpty();
  req.assert('slug', 'You must enter a slug').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    return res.status(400).json(errors);
  }

  Category.findOne({_id: id}, function(err, category){
    if(category){
      var data = {
        name: req.body.name,
        slug: req.body.slug,
        status: req.body.status || true
      };

      category.update({$set: data}, function(err){
        if (err) {
          var modelErrors = [];

          if (err.errors) {

            for (var x in err.errors) {
              modelErrors.push({
                param: x,
                msg: err.errors[x].message,
                value: err.errors[x].value
              });
            }

            return res.status(400).json(modelErrors);
          }
        }
      });

    }else{
      return res.status(400).json({
        errors: 'Faild to load this category'
      });
    }

    return res.json(category);
  });
};
