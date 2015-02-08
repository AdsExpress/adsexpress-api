'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Adv = mongoose.model('Adv');


exports.list = function(req, res, auth){

  Adv.search(req.query, function(err, data){
    if (err){
      return res.status(500).json({
        error: 'Faild to load advs'
      });
    }

    res.json(data);
  });
};
