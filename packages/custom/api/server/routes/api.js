'use strict';

var categories = require('../controllers/categories');

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Api, app, auth, database) {

  app.route('/api/categories')
    .get(categories.all)
    .post(categories.create);

  app.route('/api/categories/:id')
    .put(categories.update);

  app.route('/api/categories/:slug').get(categories.category);

  app.param('slug', categories.category);
  app.param('id', categories.update);
};
