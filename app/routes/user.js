'use strict';

// User routes use users controller
var users = require('../controllers/users');

module.exports = function(app, auth, passport) {


  app.route('/api/users/me')

  /**
   * @api {get} /api/users/me Get current user info
   * @apiName Get current user info
   * @apiGroup Users
   *
   *
   * @apiSuccess {Object} result  Current user info.
   */
    .get(users.me);

  // Setting up the users api
  app.route('/api/users/register')


  /**
   * @api {post} /api/users/register Register new user
   * @apiName Register new user
   * @apiGroup Users
   *
   * @apiParam {String} name User name.
   * @apiParam {String} email Email.
   * @apiParam {String} password Password.
   * @apiParam {String} confirmPassword Confirm Password.
   * @apiParam {String} username Username.
   *
   *
   * @apiSuccess {Object} result  Result of registration.
   */
    .post(users.create);

  app.route('/api/users/forgot-password')

  /**
   * @api {post} /api/users/forgot-password Send forget token
   * @apiName Send forget token
   * @apiGroup Users
   *
   * @apiParam {String} text Username Or Email.
   *
   * @apiSuccess {Object} result Send token result.
   */
    .post(users.forgotpassword);

  app.route('/api/users/reset/:token')

  /**
   * @api {post} /api/users/reset/:token Reset password
   * @apiName Reset password
   * @apiGroup Users
   *
   * @apiParam {String} token Reset password token.
   * @apiParam {String} password New password.
   * @apiParam {String} confirmPassword Confirm password.
   *
   * @apiSuccess {Object} result  User info.
   */
    .post(users.resetpassword);

  // Setting up the userId param
  app.param('userId', users.user);

  // Setting the facebook oauth routes
  // app.route('/api/auth/facebook')
  //   .get(passport.authenticate('facebook', {
  //     scope: ['email', 'user_about_me'],
  //     failureRedirect: '#!/login'
  //   }), users.signin);

  // app.route('/api/auth/facebook/callback')
  //   .get(passport.authenticate('facebook', {
  //     failureRedirect: '#!/login'
  //   }), users.authCallback);

  // Setting the github oauth routes
  // app.route('/auth/github')
  //   .get(passport.authenticate('github', {
  //     failureRedirect: '#!/login'
  //   }), users.signin);
  //
  // app.route('/auth/github/callback')
  //   .get(passport.authenticate('github', {
  //     failureRedirect: '#!/login'
  //   }), users.authCallback);

  // Setting the twitter oauth routes
  // app.route('/api/auth/twitter')
  //   .get(passport.authenticate('twitter', {
  //     failureRedirect: '#!/login'
  //   }), users.signin);

  // app.route('/api/auth/twitter/callback')
  //   .get(passport.authenticate('twitter', {
  //     failureRedirect: '#!/login'
  //   }), users.authCallback);

  // Setting the google oauth routes
  // app.route('/api/auth/google')
  //   .get(passport.authenticate('google', {
  //     failureRedirect: '#!/login',
  //     scope: [
  //       'https://www.googleapis.com/auth/userinfo.profile',
  //       'https://www.googleapis.com/auth/userinfo.email'
  //     ]
  //   }), users.signin);

  // app.route('/api/auth/google/callback')
  //   .get(passport.authenticate('google', {
  //     failureRedirect: '#!/login'
  //   }), users.authCallback);

  // Setting the linkedin oauth routes
  // app.route('/auth/linkedin')
  //   .get(passport.authenticate('linkedin', {
  //     failureRedirect: '#!/login',
  //     scope: ['r_emailaddress']
  //   }), users.signin);
  //
  // app.route('/auth/linkedin/callback')
  //   .get(passport.authenticate('linkedin', {
  //     failureRedirect: '#!/login'
  //   }), users.authCallback);

};
