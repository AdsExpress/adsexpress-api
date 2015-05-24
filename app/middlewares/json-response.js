'use strict';

var JsonResponse = function(){
  var self = this;
  /*jshint validthis:true */
  self.defaultKey = 'result';


  self.express = function( req, res, next ){
    self.req = req;
    self.res = res;

    // normal response
    res.jsonResponse = self.reponse;

    // normal error
    res.jsonError = self.error;

    // for mongoose validations error
    res.jsonMongooseError = self.mongooseError;

    // for express-validator middleware
    res.jsonExpressError = self.expressError;

    next();
  }


  self.setHeader = function(){
    self.res.type('json');
  }

  self.reponse = function(data, status){
    status = status || 200;

    self.setHeader();

    var results = {};
    results[self.defaultKey] = data;
    results.error = false;

    self.res.status(status).json(results);
  }

  function modelError(errorMsg, field){
    var errorModel = {
      message: errorMsg
    }

    if(field !== ''){
      errorModel.field = field;
    }

    return errorModel;
  }

  self.error = function(errorMsg, field, status) {
    if(typeof field === 'number'){
      status = field;
      field = '';
    }
    status = status || 400;

    self.setHeader();

    var obj = {};
    obj.errors = [];
    obj.errors.push(modelError(errorMsg, field));

    self.res.status(status).json(obj);
  }

  self.mongooseError = function (err, status) {
    status = status || 400;

    self.setHeader();

    var obj = {};
    obj.errors = [];

    if(err.errors){
      for(var field in err.errors){
        obj.errors.push(modelError(err.errors[field].message, field));
      }
    }

    self.res.status(status).json(obj);
  }

  self.expressError = function (errs, status){
    status = status || 400;

    self.setHeader();

    var obj = {};
    obj.errors = [];

    if(errs){
      for (var x in errs) {
        obj.errors.push(modelError(errs[x].msg, errs[x].param));
      }
    }

    self.res.status(status).json(obj);
  }
}

module.exports = new JsonResponse();
