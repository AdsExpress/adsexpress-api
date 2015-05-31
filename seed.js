'use strict'

var config = require('./config/config'),
  mongoose = require('mongoose'),
  _ = require('lodash');

mongoose.connect(config.db.host);
var db = mongoose.connection;

db.on('open', function(){
  console.log('\nConnected to MongoDB\n');
});

db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db.host);
});

// load models
_.map(['client', 'user'], function(model){
  require('./app/models/'+model+'.js');
});

//------------- Client -------------//
var Client = mongoose.model('Client');

// reset collection
Client.remove({}, function(err){
  console.log('Client collection was dropped.\n');

  var obj = {
    name: 'Web App',
    clientId: '987654321345675432534325',
    clientSecret: '&*^%$#2esdfghj76543refgd'
  };

  var seed = new Client(obj);

  seed.save(function(err){
    if(err) return console.error(err);

    console.log('Client ' + seed.name + ' was added.\n');
  });
});

//------------- User -------------//
var User = mongoose.model('User');

// reset collection
User.remove({}, function(err){
  console.log('User collection was dropped.\n');

  var obj = {
    name: 'Saleh Saiid',
    email: 'saleh.saiid@gmail.com',
    username: 'saleh',
    provider: 'local',
    roles: ['authenticated'],
    password: '12345678'
  }

  var seed = new User(obj);

  seed.save(function(err){
    if(err) return console.error(err);

    console.log('User ' + seed.name + ' was added.\n');
  });
});
