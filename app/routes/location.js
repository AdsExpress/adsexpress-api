'use strict';

var locations = require('../controllers/locations');

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(app, auth, passport) {

  /**
   * Category
   */
  app.route('/api/locations')

  /**
   * @api {get} /api/locations Get List of locations
   * @apiName Get List of locations
   * @apiGroup Locations
   *
   * @apiSuccess {Object[]} locations  List of locations.
   */
    .get(locations.all)

  /**
   * @api {post} /api/locations Create new location
   * @apiName Create new location
   * @apiGroup Locations
   *
   * @apiParam {String} name Location name.
   * @apiParam {String} code Location slug.
   *
   * @apiSuccess {Object} location  location info
   */
    .post(locations.create);

  app.route('/api/locations/:id')
  /**
   * @api {put} /api/locations/:id Edit location info
   * @apiName Edit location info
   * @apiGroup Locations
   *
   * @apiParam {String} id Location ID.
   * @apiParam {String} name Location name.
   * @apiParam {String} code Location slug.
   *
   * @apiSuccess {Object} location  location info
   */
    .put(locations.update);

  app.route('/api/locations/:code')

  /**
   * @api {get} /api/locations/:code Get info of location
   * @apiName Get info of location
   * @apiGroup Locations
   *
   * @apiParam {String} code Location code
   *.
   * @apiSuccess {Object} location  location info
   */
  .get(locations.location);
};
