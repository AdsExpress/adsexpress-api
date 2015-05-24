'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Location = mongoose.model('Location');

exports.location = function (req, res, next){
  Location.findByCode(req.params.code, function (err, data){
    if (err){
      return res.jsonMongooseError(err);
    }

    if(!data)
      return res.status(404).json({'location' : null});

    res.jsonResponse(data);
  });
};

exports.all = function (req, res, next){
  Location.find({}, function(err, data){
    if (err){
      return res.jsonMongooseError(err);
    }
    res.jsonResponse(data);
  });
};

exports.create = function(req, res, next){
  var location = new Location(req.body);

  req.assert('name', 'You must enter a name').notEmpty();
  req.assert('code', 'You must enter a code').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    return res.status(400).json(errors);
  }

  location.save(function(err){
    if (err) {
      return res.jsonMongooseError(err);
    }

    res.jsonResponse(location);
  });
};

exports.update = function(req, res, next){

  req.assert('name', 'You must enter a name').notEmpty();
  req.assert('code', 'You must enter a code').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    return res.status(400).json(errors);
  }

  Location.findOne({_id: req.params.id}, function(err, location){
    if(location){
      var data = {
        name: req.body.name,
        code: req.body.code,
        status: req.body.status || true
      };

      location.update({$set: data}, function(err){
        if (err) {
          return res.jsonMongooseError(err);
        }
      });

    }else{
      return res.status(400).json({
        errors: 'Faild to load this location'
      });
    }

    return res.jsonResponse(location);
  });
};
