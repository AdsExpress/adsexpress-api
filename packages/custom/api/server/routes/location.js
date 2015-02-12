'use strict';

var locations = require('../controllers/locations');

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Api, app, auth, database) {

  /**
   * Category
   */
  app.route('/api/locations')
    .get(locations.all)
    .post(locations.create);

  app.route('/api/locations/:id')
    .put(locations.update);

  app.route('/api/locations/:code').get(locations.location);
};
