'use strict';

var mongoose = require('mongoose'),
  BasicStrategy = require('passport-http').BasicStrategy,
  ClientPasswordStrategy  = require('passport-oauth2-client-password').Strategy,
  BearerStrategy = require('passport-http-bearer').Strategy,
  TwitterStrategy = require('passport-twitter').Strategy,
  FacebookStrategy = require('passport-facebook').Strategy,
  GitHubStrategy = require('passport-github').Strategy,
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
  LinkedinStrategy = require('passport-linkedin').Strategy,
  User = mongoose.model('User'),
  Client = mongoose.model('Client'),
  AccessToken = mongoose.model('AccessToken'),
  config = require('meanio').loadConfig();

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

  // Use twitter strategy
  passport.use(new TwitterStrategy({
      consumerKey: config.twitter.clientID,
      consumerSecret: config.twitter.clientSecret,
      callbackURL: config.twitter.callbackURL
    },
    function(token, tokenSecret, profile, done) {
      User.findOne({
        'twitter.id_str': profile.id
      }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(err, user);
        }
        user = new User({
          name: profile.displayName,
          username: profile.username,
          provider: 'twitter',
          twitter: profile._json,
          roles: ['authenticated']
        });
        user.save(function(err) {
          if (err) {
            console.log(err);
            return done(null, false, {message: 'Twitter login failed, email already used by other login strategy'});
          } else {
            return done(err, user);
          }
        });
      });
    }
  ));

  // Use facebook strategy
  passport.use(new FacebookStrategy({
      clientID: config.facebook.clientID,
      clientSecret: config.facebook.clientSecret,
      callbackURL: config.facebook.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({
        'facebook.id': profile.id
      }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(err, user);
        }
        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          username: profile.username || profile.emails[0].value.split('@')[0],
          provider: 'facebook',
          facebook: profile._json,
          roles: ['authenticated']
        });
        user.save(function(err) {
          if (err) {
            console.log(err);
            return done(null, false, {message: 'Facebook login failed, email already used by other login strategy'});
          } else {
            return done(err, user);
          }
        });
      });
    }
  ));

  // Use github strategy
  passport.use(new GitHubStrategy({
      clientID: config.github.clientID,
      clientSecret: config.github.clientSecret,
      callbackURL: config.github.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({
        'github.id': profile.id
      }, function(err, user) {
        if (user) {
          return done(err, user);
        }
        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          username: profile.username,
          provider: 'github',
          github: profile._json,
          roles: ['authenticated']
        });
        user.save(function(err) {
          if (err) {
            console.log(err);
            return done(null, false, {message: 'Github login failed, email already used by other login strategy'});
          } else {
            return done(err, user);
          }
        });
      });
    }
  ));

  // Use google strategy
  passport.use(new GoogleStrategy({
      clientID: config.google.clientID,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({
        'google.id': profile.id
      }, function(err, user) {
        if (user) {
          return done(err, user);
        }
        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          username: profile.emails[0].value,
          provider: 'google',
          google: profile._json,
          roles: ['authenticated']
        });
        user.save(function(err) {
          if (err) {
            console.log(err);
            return done(null, false, {message: 'Google login failed, email already used by other login strategy'});
          } else {
            return done(err, user);
          }
        });
      });
    }
  ));

  // use linkedin strategy
  passport.use(new LinkedinStrategy({
      consumerKey: config.linkedin.clientID,
      consumerSecret: config.linkedin.clientSecret,
      callbackURL: config.linkedin.callbackURL,
      profileFields: ['id', 'first-name', 'last-name', 'email-address']
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({
        'linkedin.id': profile.id
      }, function(err, user) {
        if (user) {
          return done(err, user);
        }
        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          username: profile.emails[0].value,
          provider: 'linkedin',
          roles: ['authenticated']
        });
        user.save(function(err) {
          if (err) {
            console.log(err);
            return done(null, false, {message: 'LinkedIn login failed, email already used by other login strategy'});
          } else {
            return done(err, user);
          }
        });
      });
    }
  ));
};
