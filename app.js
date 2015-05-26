'use strict'

var express = require('express'),
  config = require('./config/config'),
  glob = require('glob'),
  mongoose = require('mongoose');

  express.config = config;

mongoose.connect(config.db.host);
var db = mongoose.connection;

db.on('open', function(){
  console.log('\nConnected to MongoDB\n');
});

db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db.host);
});

if(config.db.debug === true){
  // use visionmedia/debug module to debug mongoose requests
  var debugMongoose = require('debug')('mongoose');
  mongoose.set('debug', function(collectionName, method, query, doc, options) {
    debugMongoose('%s.%s(%s) %s', collectionName, method, JSON.stringify(query), JSON.stringify(doc));
  });
}

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});
var app = express();

require('./config/express')(app, config);

app.listen(config.port);
