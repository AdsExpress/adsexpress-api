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
   // Accept Basic Latin characters [\u0041-\u005A] and [\u0061-\u007A] and arabic characters [\u0600-\u06FF]
  app.route('/api/advs/:slug([\u0041-\u005A\u0061-\u007A\u0600-\u06FF._-]+)')
    .get(advs.list)
    .post(advs.validateInputs, advs.create);

  app.route('/api/advs/:id([0-9]+)')
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
