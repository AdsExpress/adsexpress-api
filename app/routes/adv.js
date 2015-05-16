'use strict';

var advs = require('../controllers/advs'),
    multipart = require('connect-multiparty'),
    multipartMiddleware = multipart();

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(app, auth, passport) {

  /**
   * Adv
   */
  app.route('/api/advs')

  /**
   * @api {get} /api/advs List of advs
   * @apiName List of advs
   * @apiGroup Advs
   *
   * @apiParam {String} keyword search keyword.
   * @apiParam {String} category category slug.
   * @apiParam {String} limit limit of results.
   * @apiParam {String} offset offset results.
   * @apiParam {String} sort sort by (created, price, -created, -price).
   *
   * @apiSuccess {Object[]} advs  List of advs
   */
    .get(advs.list)

  /**
   * @api {post} /api/advs Create adv
   * @apiName Create adv
   * @apiGroup Advs
   *
   * @apiParam {String} title title of adv.
   * @apiParam {String} content description of adv.
   * @apiParam {String} category category of adv.
   * @apiParam {String} price price of adv.
   * @apiParam {String} item_status item status (new, used).
   * @apiParam {String} phone owner phone.
   * @apiParam {String} email owner email.
   *
   * @apiSuccess {Object[]} advs  List of advs
   */
    .post(advs.validateInputs, advs.create);

  app.route('/api/advs/:id([0-9]+)')

  /**
   * @api {get} /api/advs/:id Get advs info
   * @apiName Get advs info
   * @apiGroup Advs
   *
   * @apiParam {Number} id Adv ID.
   *
   * @apiSuccess {Object} adv  advs info
   */
    .get(advs.info)

  /**
   * @api {put} /api/advs/:id Edit adv info
   * @apiName Edit adv info
   * @apiGroup Advs
   *
   * @apiParam {Number} id Adv ID.
   * @apiParam {String} title title of adv.
   * @apiParam {String} content description of adv.
   * @apiParam {String} category category of adv.
   * @apiParam {String} price price of adv.
   * @apiParam {String} item_status item status (new, used).
   * @apiParam {String} phone owner phone.
   * @apiParam {String} email owner email.
   *
   * @apiSuccess {Object} adv  advs info
   */
    .put(advs.validateInputs, advs.update);

  app.route('/api/advs/:id/images/front') // Update Adv. front image

  /**
   * @api {put} /api/advs/:id/images/front Upload front image
   * @apiName Add front image
   * @apiGroup Advs
   *
   * @apiParam {Number} id Adv ID.
   * @apiParam {String} file image file.
   *
   * @apiSuccess {Object} image image info
   */
    .put(multipartMiddleware, function(req, res, next){
      req.frontImage = true;
      next();
    }, advs.uploadImage);

    app.route('/api/advs/:id/images')
  /**
   * @api {put} /api/advs/:id/images Upload image into adv gallary
   * @apiName Upload image into adv gallary
   * @apiGroup Advs
   *
   * @apiParam {Number} id Adv ID.
   * @apiParam {String} file image file.
   *
   * @apiSuccess {Object} image image info
   */
      .put(multipartMiddleware,advs.uploadImage);
};
