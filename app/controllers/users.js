'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  async = require('async'),
  config = require('express').config,
  crypto = require('crypto'),
  nodemailer = require('nodemailer');


/**
 * Show login form
 */
exports.signin = function(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.redirect('#!/login');
};

/**
 * Logout
 */
exports.signout = function(req, res) {
  req.logout();

  req.jsonResponse('success');
};


/**
 * Create user
 */
exports.create = function(req, res, next) {
  var user = new User(req.body);

  user.provider = 'local';

  // because we set our user.provider to local our models/user.js validation will always be true
  req.checkBody('name', 'You must enter a name').notEmpty();
  req.checkBody('email', 'You must enter a valid email address').isEmail();
  req.checkBody('password', 'Password must be between 8-20 characters long').len(8, 20);
  req.checkBody('username', 'Username cannot be more than 20 characters').len(1, 20);
  req.checkBody('confirmPassword', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();
  if (errors) {
    return res.jsonExpressError(errors);
  }

  // Hard coded for now. Will address this with the user permissions system in v0.3.5
  user.roles = ['authenticated'];
  user.save(function(err) {
    if (err) {
      switch (err.code) {
        case 11000:
        case 11001:
          res.jsonError('Username already taken', 'username');
          break;
        default:
          res.jsonMongooseError(err);
      }
    }
    req.logIn(user, function(err) {
      if (err) return next(err);
      return res.jsonResponse('success');
    });
  });
};
/**
 * Send User
 */
exports.me = function(req, res) {
  res.jsonResponse(req.user);
};

/**
 * Find user by id
 */
exports.user = function(req, res, next, id) {
  User
    .findOne({
      _id: id
    })
    .exec(function(err, user) {
      if (err) return res.jsonMongooseError(err);
      if (!user) return res.jsonError('Failed to load User ' + id);
      req.profile = user;
      next();
    });
};

/**
 * Resets the password
 */

exports.resetpassword = function(req, res, next) {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }, function(err, user) {
    if (err) {
      return res.jsonMongooseError(err);
    }
    if (!user) {
      return res.jsonError('Token invalid or expired', 'token');
    }
    req.checkBody('password', 'Password must be between 8-20 characters long').len(8, 20);
    req.checkBody('confirmPassword', 'Passwords do not match').equals(req.body.password);
    var errors = req.validationErrors();
    if (errors) {
      return res.jsonExpressError(errors);
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.save(function(err) {
      req.logIn(user, function(err) {
        if (err) return res.jsonMongooseError(err);
        return res.jsonResponse(user);
      });
    });
  });
};

/**
 * Send reset password email
 */
function sendMail(mailOptions) {
  var transport = nodemailer.createTransport(config.mailer);
  transport.sendMail(mailOptions, function(err, response) {
    if (err) return err;
    return response;
  });
}

/**
 * Callback for forgot password link
 */
exports.forgotpassword = function(req, res, next) {
  async.waterfall([

      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({
          $or: [{
            email: req.body.text
          }, {
            username: req.body.text
          }]
        }, function(err, user) {
          if (err || !user) return done(true);
          done(err, user, token);
        });
      },
      function(user, token, done) {
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        user.save(function(err) {
          done(err, token, user);
        });
      },
      function(token, user, done) {
        var mailOptions = {
          to: user.email,
          from: config.emailFrom
        };
        var templates = {}; // for jshint only
        mailOptions = templates.forgot_password_email(user, req, token, mailOptions);
        sendMail(mailOptions);
        done(null, true);
      }
    ],
    function(err, status) {
      if (err) {
        return res.jsonError('User does not exist');
      }

      res.jsonResponse('success');
    }
  );
};
