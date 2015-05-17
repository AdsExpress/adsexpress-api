'use strict';

var JsonResponse = function(){
  var self = this;
  /*jshint validthis:true */
  self.defaultKey = 'result';


  self.express = function( req, res, next ){
    self.req = req;
    self.res = res;

    res.jsonResponse = self.reponse;
    res.jsonError = self.error;

    next();
  }


  self.setHeader = function(){
    self.res.type('json');

    return null;
  }

  self.reponse = function(data, status){
    status = status || 200;

    self.setHeader();

    var results = {};
    results[self.defaultKey] = data;
    results.error = false;

    self.res.status(status).json(results);

    return null;
  }

  self.error = function(errors, status) {
    status = status || 400;

    self.setHeader();

    var obj = {};
    obj.errors = [];
    obj.errors.push(errors);

    self.res.status(status).json(obj);

    return null;
  }
}

module.exports = new JsonResponse();
