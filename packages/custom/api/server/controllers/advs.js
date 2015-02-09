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

exports.info = function (req, res, next){

  Adv.getInfo(req.params.id, function(err, data){
    if(err){
      return res.status(500).json({
        error: 'Faild to load this adv'
      });
    }

    res.json(data);
  });
};

exports.create = function(req, res, next){
  var adv = new Adv(req.body);

  adv.save(function(err){
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

    res.json(adv);
  });
};

exports.update = function(req, res, next){

  Adv.findOne({_id: req.params.id}, function(err, adv){
    if(adv){
      var data = {
        title: req.body.title,
        content: req.body.content,
        category: req.body.category
      };

      adv.update({$set: data}, function(err){
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
        errors: 'Faild to load this adv'
      });
    }

    return res.json(adv);
  });
};
