/*
 * PIZZA Shop rest API
 * 
 * tokens functions
 * 
*/

// Dependencies
var _data = require('./_data');
var helpers = require('./helpers');
var util = require('util');
var debugModule = util.debuglog('tokens');

// Container object for module
var lib = {};

lib.verifyToken = function(token,email,callback) {
  // Lookup the token
  _data.read('tokens', token, function(err, tokenData){
    if (!err && tokenData) {
      // Check if the token is for the given user and has not expired
      if (tokenData.email == email && tokenData.expires > Date.now()){
        callback(true);
      }else{
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

lib.verifyTokenExpriration = function(token,callback) {
  // Lookup the token
  _data.read('tokens', token, function(err, tokenData){
    if (!err && tokenData) {
      // Check if the token is for the given user and has not expired
      if (tokenData.expires > Date.now()){
        callback(true,tokenData.email);
      }else{
        callback(false,'');
      }
    } else {
      callback(false,'');
    }
  });
};

// Export the module
module.exports = lib;
  