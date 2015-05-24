'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Adv = mongoose.model('Adv'),
  fs = require('fs'),
  upload = require('../helpers/upload'),
  sprintf = require('sprintf'),
  _ = require('lodash'),
  Q = require('q'),
  config = require('express').config;



exports.validateInputs = function (req, res, next){

  req.assert('title', 'The Title must be 15 char at least').notEmpty();
  req.assert('content', 'The Content must be 15 char at least').notEmpty();

  var errors = req.validationErrors();

  if(errors){
    return res.jsonExpressError(errors);
  }

  next();
};

exports.list = function(req, res){
  var Category = mongoose.model('Category');

  function loadBySlug(){
    var deferred = Q.defer();

    if(req.query.category.trim() === '') {
      deferred.resolve(null);
    } else {
      Category.loadBySlug(req.query.category, function(err, data){
        if (err){
          deferred.reject(new Error('Faild to load advs'));
        }

        if(data){
          deferred.resolve(data._id);
        }else{
          deferred.resolve(null); // retrun null if not found category
        }
      });
    }

    return deferred.promise;
  }

  loadBySlug().then(function(category_id){
    if(category_id !== null){
      req.query.categoryId = category_id;

      Adv.search(req.query, function(err, data){
        if (err){
          return res.jsonMongooseError(err);
        }

        return res.jsonResponse(data);
      });
    }else{
      return res.jsonResponse([]);
    }
  }).fail(function(error){
    return res.jsonMongooseError(error, 500);
  });
};

exports.info = function (req, res, next){

  Adv.getInfo(req.params.id, function(err, data){
    if(err){
      return res.jsonMongooseError(err);
    }

    res.jsonResponse(data);
  });
};

exports.create = function(req, res, next){
  var adv = new Adv(req.body);

  adv.save(function(err){
    if (err) {
      return res.jsonMongooseError(err);
    }

    res.jsonResponse(adv);
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
          return res.jsonMongooseError(err);
        }
      });

    }else{
      return res.status(400).json({
        errors: 'Faild to load this adv'
      });
    }

    return res.jsonResponse(adv);
  });
};

exports.uploadImage = function(req, res, next){
  var path = config.upload.directory;

  if(!fs.existsSync(path)){
    res.status(500).jsonp({errors: 'Internal error: please call administrator (not found upload directory).'});
  } else {
    Adv.findOne({ _id: req.params.id }, function(err, adv){
      if (err) return res.jsonMongooseError(err);

      // adv. Not found
      if(adv === null) return res.status(400).json({ errors: 'Adv. Not found' });

      // Set file name format parameters
      var opt = { adv_id: req.params.id, user_id: 1, timestamp: new Date().getTime()};
      var file_name = sprintf(config.upload.fileFormat, opt);

      upload.rename(req.files.file, file_name, function(err, imageInfo){
        if(err) return res.status(400).jsonp({errors: err.message});

        imageInfo.isFront = req.frontImage || false;

        // set isFront to false if uploaded image is front
        if(adv.images !== null && imageInfo.isFront === true){
          _.forEach(adv.images, function(n, index){
            adv.images[index].isFront = false;
          });
        }

        // Add image to images array
        adv.images.push(imageInfo);

        adv.save(function(err){
          if(err) return res.jsonMongooseError(err);

          res.jsonResponse(imageInfo);
        });

      });
    });
  }

};
