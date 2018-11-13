/*
 * PIZZA Shop rest API
 *
 * data create, update, delete, list
 *
*/

// Dependencies
var fs = require('fs');
var path = require('path');
var helpers = require('./helpers');
var errors = require('./errors');
var util = require('util');
var debugModule = util.debuglog('_data');


// Container object for module
var lib = {};

// base dir for data
lib.baseDir = path.join(__dirname, '/../.data/');

lib.ensureExists = function(path, pathShort, callback) {
  const mask = 0777;

  fs.mkdir(path, mask, function(err) {
      if (err) {
          if (err.code == 'EEXIST') {
            // ignore the error if the folder already exists
            console.log(helpers.msg_ok("Directory "+pathShort+" already exists"));
            callback(null);
          } else {
            // something else went wrong
            callback(err);
          }
      } else {
        // successfully created folder
        console.log(helpers.msg_ok("Directory "+pathShort+" successfully created"));
        callback(null);
      }
  });
};

lib.init = function(createCatalogData) {
  lib.ensureExists(lib.baseDir, '.data', function(err) {
    if (!err) {
      lib.ensureExists(lib.baseDir+'tokens', '.data/tokens', function(err) {
        if (err) {
          helpers.debug_obj_err(debugModule, "Error creating directory", err);
        }
        lib.ensureExists(lib.baseDir+'users', '.data/users', function(err) {
          if (err) {
            helpers.debug_obj_err(debugModule, "Error creating directory", err);
          }
          lib.ensureExists(lib.baseDir+'carts', '.data/carts', function(err) {
            if (err) {
              helpers.debug_obj_err(debugModule, "Error creating directory", err);
            }
            lib.ensureExists(lib.baseDir+'catalog', '.data/catalog', function(err) {
              if (err) {
                helpers.debug_obj_err(debugModule, "Error creating directory", err);
              } else {
                createCatalogData();
              }
              lib.ensureExists(lib.baseDir+'orders', '.data/orders', function(err) {
                if (err) {
                  helpers.debug_obj_err(debugModule, "Error creating directory", err);
                }
              });
            });
          });
        });
      });
    }
  });
}

lib.read = function(table,fileid,callback){
    fs.readFile(lib.baseDir+table+'/'+fileid+'.json', 'utf-8', function(err, data) {
        if (!err && data) {
          var parsedData = helpers.parseJsonToObject(data);
          callback(err, parsedData);
        }else{
          callback(err, data);
        }
    });
};


lib.create = function(table,fileid,data,callback){
  // open the file for writing
  fs.open(lib.baseDir+table+'/'+fileid+'.json','wx',function(err,fileDescriptor){
    if (!err && fileDescriptor) {
      // Convert data to string
      var stringData = JSON.stringify(data);
      fs.writeFile(fileDescriptor, stringData, function(err){
        if (!err) {
          fs.close(fileDescriptor, function(err){
            if (!err) {
              callback(false);
            } else {
              callback('error closing new file');
            }
          });
        } else {
          callback('error writing to new file');
        }
      });
    } else {
      callback('error creating new file, it may already exist');
    }
  });
};

lib.update = function(table,fileid,data,callback){
  // open the file for writing
  fs.open(lib.baseDir+table+'/'+fileid+'.json','r+',function(err,fileDescriptor){
    if (!err && fileDescriptor) {
      // Convert data to string
      var stringData = JSON.stringify(data);
      fs.truncate(fileDescriptor, function(err){
        if (!err) {
          fs.writeFile(fileDescriptor, stringData, function(err){
            if (!err) {
              fs.close(fileDescriptor, function(err){
                if (!err) {
                  callback(false);
                } else {
                  callback('error closing existing file');
                }
              })
            } else {
              callback('error writing to existing file');
            }
          });
        } else {
          callback('error truncating existing file');
        }
      });
    } else {
      callback('Could not open the file for updating, it may not exist yet');
    }
  });
};

lib.delete = function(table,fileid,callback){
  // open the file for writing
  fs.unlink(lib.baseDir+table+'/'+fileid+'.json',function(err){
    if (!err) {
      callback(false);
    } else {
      callback('Could not delete the file, it may not exist yet');
    }
  });
};

lib.list = function(table,callback){
  fs.readdir(lib.baseDir+table+'/', function(err,data) {
    if(!err && data && data.length > 0){
      var trimmedFileNames = [];
      data.forEach(function(fileName){
        trimmedFileNames.push(fileName.replace('.json',''));
      });
      callback(false,trimmedFileNames);
    } else {
      callback(err,data);
    }
  });
};


// Export the module
module.exports = lib;
