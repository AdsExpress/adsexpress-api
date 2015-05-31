'use strict';

var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

function merge_options(obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname2 in obj2) { obj3[attrname2] = obj2[attrname2]; }
    return obj3;
}

var config = {
  all: {
    app: {
      name: 'Ads Express'
    },

    // Server listen port
    port: 3000,

    // Upload file settings
    upload: {
      directory: path.normalize(rootPath + '/public/files/'),
      osSep: path.sep,
      urlPath: '/public/files/',
      maxSize: 2097152, // 2MB
      allowedTypes: ['.JPG', '.PNG', '.GIF', '.JPEG'], // Should be UpperCase
      fileFormat: '%(adv_id)s_p_%(user_id)s_%(timestamp)s'
    },

    // oauth2 settings
    oauth2: {
      tokenLife : 3600 * 24 * 15 // 15 day
    }
  },
  development: {
    root: rootPath,
    db: {
      host: 'mongodb://localhost:27017/adv-market',
      debug: true
    }
  },

  test: {
    db: {
      host : 'mongodb://localhost:27017/adv-market'
    }
  },

  production: {
    db: {
      host : 'mongodb://localhost:27017/adv-market'
    }
  }
};

module.exports = merge_options(config.all, config[env]);
