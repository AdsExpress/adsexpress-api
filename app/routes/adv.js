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
   * @apiParam {String} sort sort by (created, price).
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
