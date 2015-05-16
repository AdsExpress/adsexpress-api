'use strict';
var mongoose = require('mongoose'),
    passport = require('passport'),
    oauth2orize = require('oauth2orize'),
    crypto = require('crypto'),
    config = require('express').config;

var UserModel = mongoose.model('User'),
    AccessTokenModel = mongoose.model('AccessToken'),
    RefreshTokenModel = mongoose.model('RefreshToken');

// create oAuth 2.0 server
var server = oauth2orize.createServer();

server.exchange(oauth2orize.exchange.password(function(client, username, password, scope, done){

  UserModel.findOne( { email: username }, function(err, user){
    if(err) { return done(err); }
    if(!user) { return done(null, false); }
    if(!user.authenticate(password)) { return done(null, false); }

    RefreshTokenModel.remove({ userId: user._id, clientId: client.clientId }, function (err) {
      if (err) return done(err);
    });

    AccessTokenModel.remove({ userId: user._id, clientId: client.clientId }, function (err){
      if(err) return done(err);
    });

    var tokenValue = crypto.randomBytes(32).toString('base64');
    var refreshTokenValue = crypto.randomBytes(32).toString('base64');
    var token = new AccessTokenModel({ token: tokenValue, clientId: client.clientId, userId: user._id });
    var refreshToken = new RefreshTokenModel({ token: refreshTokenValue, clientId: client.clientId, userId: user._id });
    refreshToken.save(function (err) {
      if (err) { return done(err); }
    });

    token.save(function(err){
      if(err) return done(err);
      done(null, tokenValue, refreshTokenValue, { expires_in: config.oAuth2.tokenLife });
    });
  });
}));

// Exchange refreshToken for an access token.
server.exchange(oauth2orize.exchange.refreshToken(function(client, refreshToken, scope, done) {
    RefreshTokenModel.findOne({ token: refreshToken }, function(err, token) {
        if (err) { return done(err); }
        if (!token) { return done(null, false); }
        if (!token) { return done(null, false); }

        UserModel.findById(token.userId, function(err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }

            RefreshTokenModel.remove({ userId: user._id, clientId: client.clientId }, function (err) {
                if (err) return done(err);
            });
            AccessTokenModel.remove({ userId: user._id, clientId: client.clientId }, function (err) {
                if (err) return done(err);
            });

            var tokenValue = crypto.randomBytes(32).toString('base64');
            var refreshTokenValue = crypto.randomBytes(32).toString('base64');
            var token = new AccessTokenModel({ token: tokenValue, clientId: client.clientId, userId: user._id });
            var refreshToken = new RefreshTokenModel({ token: refreshTokenValue, clientId: client.clientId, userId: user._id });
            refreshToken.save(function (err) {
                if (err) { return done(err); }
            });

            token.save(function (err, token) {
                if (err) { return done(err); }
                done(null, tokenValue, refreshTokenValue, { 'expires_in': config.oAuth2.tokenLife });
            });
        });
    });
}));

// token endpoint
exports.token = [
    passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
    server.token(),
    server.errorHandler()
];
