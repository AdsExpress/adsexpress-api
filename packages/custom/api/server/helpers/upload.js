'use strict';
var fs = require('fs'),
  pathLib = require('path'),
  _ = require('lodash'),
  config = require('meanio').loadConfig(),
  mkdirOrig = fs.mkdir,
  directory = config.upload.directory,
  osSep = config.upload.osSep;


exports.rename = function(file, fileName, callback){
  var fileStats = fs.statSync(file.path);

  // Check file's type
  var ext = pathLib.extname(file.name).toUpperCase();
  if(!_.contains(config.upload.allowedTypes, ext)) return callback(new Error('Not Allowed file type'));

  // Check file's size
  if(fileStats.size > config.upload.maxSize) return callback(new Error('file size more than ' + config.upload.maxSize + ' Bytes'), null);

  var destFileName = fileName + ext;

  fs.readFile(file.path, function(err, data){
    if(err) return callback(err, null);
    else
      fs.writeFile(directory + destFileName, data, function(err){
        if(err) return callback(err, null);
        else
        callback(null, {
          success: true,
          file: {
            src: config.upload.urlPath + destFileName,
            name: destFileName,
            size: file.size,
            created: Date.now(),
          }
        });
      });
  });
};

exports.mkdir_p = function(path, callback, position) {
  var parts = pathLib.normalize(path).split(osSep);
  var self = this;

  position = position || 0;

  if(position >= parts.length){
    return callback();
  }

  var directory = parts.slice(0, position - 1).join(osSep) || osSep;
  fs.stat(directory, function(err, stats){
    if(err === null){
      self.mkdir_p(path, callback, position + 1);
    } else {
      mkdirOrig(directory, function(err){
        if(err && err.code !== 'EEXIST'){
          return callback(err);
        } else {
          self.mkdir_p(path, callback, position + 1);
        }
      });
    }
  });
};
