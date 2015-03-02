'use strict';

/**
 * Module dependencies.
 */
var mean = require('meanio'),
  compression = require('compression'),
  morgan = require('morgan'),
  consolidate = require('consolidate'),
  cookieParser = require('cookie-parser'),
  expressValidator = require('express-validator'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  config = mean.loadConfig();

module.exports = function(app, passport, db) {

  app.set('showStackError', true);

  // cache=memory or swig dies in NODE_ENV=production
  app.locals.cache = 'memory';

  // Should be placed before express.static
  // To ensure that all assets and data are compressed (utilize bandwidth)
  app.use(compression({
    // Levels are specified in a range of 0 to 9, where-as 0 is
    // no compression and 9 is best compression, but slowest
    level: 9
  }));

  // Only use logger for development environment
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  // Request body parsing middleware should be above methodOverride
  app.use(expressValidator());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(methodOverride());

  // Use passport session
  app.use(passport.initialize());
};
