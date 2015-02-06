'use strict';

var categories = require('../controllers/categories');

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Api, app, auth, database) {
  
  app.route('/api/category/:slug').get(categories.category);

  app.param('slug', categories.category);
};
