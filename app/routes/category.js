'use strict';

var categories = require('../controllers/categories');

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(app, auth, passport) {

  /**
   * Category
   */
  app.route('/api/categories')

  /**
   * @api {get} /api/categories Get Root Categories
   * @apiName Get Root Categories
   * @apiGroup Categories
   *
   *
   * @apiSuccess {Object[]} categories  List of root categories.
   */
    .get(categories.all)

  /**
   * @api {post} /api/categories Create new category
   * @apiName Add new category
   * @apiGroup Categories
   *
   * @apiParam {String} name Categoty name.
   * @apiParam {String} slug Categoty slug.
   * @apiParam {String} parentId Categoty parent ID.
   *
   * @apiSuccess {Object} category  categroy info.
   */
    .post(categories.create);

  app.route('/api/categories/:id')

  /**
   * @api {put} /api/categories/:id Edit category info
   * @apiName Edit category info
   * @apiGroup Categories
   * @apiParam {Number} id Categoty unique ID.
   * @apiParam {String} name Categoty name.
   * @apiParam {String} slug Categoty slug.
   *
   * @apiSuccess {Object} category  categroy info.
   */
    .put(categories.update);

  app.route('/api/categories/:slug')

  /**
   * @api {get} /api/categories/:slug Get category descendants
   * @apiName Get category descendants
   * @apiGroup Categories
   * @apiParam {String} slug Categoty slug.
   *
   * @apiSuccess {Object[]} categories  List descendants of category.
   */
    .get(categories.category);
};
