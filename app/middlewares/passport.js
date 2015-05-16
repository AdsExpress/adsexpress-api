'use strict';

var mongoose = require('mongoose'),
  BasicStrategy = require('passport-http').BasicStrategy,
  ClientPasswordStrategy  = require('passport-oauth2-client-password').Strategy,
  BearerStrategy = require('passport-http-bearer').Strategy,
  User = mongoose.model('User'),
  Client = mongoose.model('Client'),
  AccessToken = mongoose.model('AccessToken'),
  config = require('express').config;

module.exports = function(passport) {

  // Use Basic strategy
  passport.use(new BasicStrategy(function(email, password, done) {
      User.findOne({ email: email }, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user' }); }
        if (!user.authenticate(password)) { return done(null, false, { message: 'Invalid password' }); }

        return done(null, user);
      });
    }
  ));

  passport.use(new ClientPasswordStrategy(
    function(clientId, clientSecret, done) {
      Client.findOne({ clientId: clientId }, function(err, client) {
        if (err) { return done(err); }
        if (!client) { return done(null, false); }
        if (client.clientSecret !== clientSecret) { return done(null, false); }

        return done(null, client);
      });
    }
  ));

  passport.use(new BearerStrategy(
    function(accessToken, done){
      AccessToken.findOne({ token: accessToken }, function(err, token){
        if(err) return done(err);
        if(!token) return done(null, false);

        if( Math.round((Date.now() - token.created) / 1000 ) > config.oAuth2.tokenLife ){
          AccessToken.remove({ token: accessToken }, function(err){
            if(err) return done(err);
          });

          return done(null, false, { message: 'Token expired' });
        }

        User.findById(token.userId, function(err, user){
          if(err) return done(err);
          if(!user) return done(null, false, { message: 'Unknown user' });

          var info = { scope: '*' };
          done(null, user, info);
        });
      });
    }
  ));

  return function(req, res, next){
    next();
  };

};
