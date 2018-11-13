/*
 * PIZZA Shop rest API
 *
 * Create handlers for Shopping API
 *
*/

// Dependencies
var helpers = require('./helpers');
var errors = require('./errors');
var _data = require('./_data');
var _tokens = require('./_tokens');
var _service = require('./shopping_service');
var util = require('util');
var debugModule = util.debuglog('handlers');

// Container object for module
var handlers = {};

// SUCCESS: callback to caller (ok=statusCode(200), dataObject)
// FAILURE: callback to caller (err=statusCode, errorObject)
handlers.post = function(data, callback) {
  var id = helpers.getValidStringExactLenOrFalse(data.payload.id, 3);
  var token = helpers.getValidStringExactLenOrFalse(data.headers.token, 20);
  _tokens.verifyTokenExpriration(token,function(tokenIsValid,userEmail){
      if(tokenIsValid){
        _service.addToCart(id,userEmail,function(err,userCart){
          callback(err, userCart);
        });
      }else{
        callback(403, errors.ErrCreate("Missing required token in header, or given token is invalid"));
      }
  });
};

// SUCCESS: callback to caller (ok=statusCode(200), dataObject)
// FAILURE: callback to caller (err=statusCode, errorObject)
handlers.get = function(data, callback) {
  var token = helpers.getValidStringExactLenOrFalse(data.headers.token, 20);
  _tokens.verifyTokenExpriration(token,function(tokenIsValid,userEmail){
      if(tokenIsValid){
        _service.getCart(userEmail,function(err,userCart){
          callback(err, userCart);
        });
      }else{
        callback(403, errors.ErrCreate("Missing required token in header, or given token is invalid"));
      }
  });
};

// SUCCESS: callback to caller (ok=statusCode(200), dataObject)
// FAILURE: callback to caller (err=statusCode, errorObject)
handlers.delete = function(data, callback) {
  var token = helpers.getValidStringExactLenOrFalse(data.headers.token, 20);
  _tokens.verifyTokenExpriration(token,function(tokenIsValid,userEmail){
      if(tokenIsValid){
        _service.deleteCart(userEmail,function(err,userCart){
          callback(err, userCart);
        });
      }else{
        callback(403, errors.ErrCreate("Missing required token in header, or given token is invalid"));
      }
  });
};

// Export the module
module.exports = handlers;
