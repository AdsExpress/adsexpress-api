'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Adv = mongoose.model('Adv'),
  fs = require('fs'),
  upload = require('../helpers/upload'),
  sprintf = require('sprintf');

var config = require('meanio').loadConfig();

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

exports.validateInputs = function (req, res, next){

  req.assert('title', 'The Title must be 15 char at least').notEmpty();
  req.assert('content', 'The Content must be 15 char at least').notEmpty();

  var errors = req.validationErrors();

  if(errors){
    return res.status(400).json(errors);
  }

  next();
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

exports.uploadImage = function(req, res, next){
  var path = config.upload.directory;

  if(!fs.existsSync(path)){
    res.status(500).jsonp({error: 'Internal error: please call administrator (not found upload directory).'});
  } else {
    // Set file name format parameters
    var opt = { adv_id: req.params.id, user_id: 1, timestamp: new Date().getTime()};
    var file_name = sprintf(config.upload.fileFormat, opt);

    upload.rename(req.files.file, file_name, function(err, data){
      if(err) return res.status(400).jsonp({error: err.message});
      res.status(200).jsonp(data);
    });
  }

};
