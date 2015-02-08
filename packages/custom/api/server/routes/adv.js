'use strict';

var advs = require('../controllers/advs');

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Api, app, auth, database) {

  /**
   * Adv
   */
  app.route('/api/advs').get(advs.checkCategory, advs.list);
};
