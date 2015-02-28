'use strict';

var advs = require('../controllers/advs'),
    multipart = require('connect-multiparty'),
    multipartMiddleware = multipart();

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Api, app, auth, database) {

  /**
   * Adv
   */
  app.route('/api/advs')
    .get(advs.checkCategory, advs.list)
    .post(advs.validateInputs, advs.create);

  app.route('/api/advs/:id')
    .get(advs.info)
    .put(advs.validateInputs, advs.update);

  app.route('/api/advs/:id/images/front') // Update Adv. front image
    .put(multipartMiddleware, function(req, res, next){
      req.frontImage = true;
      next();
    }, advs.uploadImage);

    app.route('/api/advs/:id/images')
      .put(multipartMiddleware,advs.uploadImage);
};
