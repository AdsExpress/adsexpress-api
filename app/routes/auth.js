'use strict';

var users = require('../controllers/users');
module.exports = function(app, auth, passport) {

    app.route('/api/auth/logout')

    /**
     * @api {get} /api/auth/logout Logout user
     * @apiName Logout user
     * @apiGroup Authenticate
     *
     *
     * @apiSuccess {Object} result  Logout result.
     */
        .get(users.signout);

    app.route('/api/auth/login')

    /**
     * @api {post} /api/auth/login Authenticate user
     * @apiName Get Authenticate user
     * @apiGroup Authenticate
     *
     *
     * @apiSuccess {String} access_token  Access Token .
     * @apiSuccess {String} refresh_token  Refresh Token.
     * @apiSuccess {Number} expires_in  Expires Time.
     * @apiSuccess {String} token_type  Token Type.
     */
        .post(auth.token);
}