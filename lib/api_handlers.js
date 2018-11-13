/*
 * PIZZA Shop rest API
 *
 * Create handlers for App API
 *
*/

// Dependencies
var _users = require('./user_handlers');
var _tokens = require('./token_handlers');
var _offers = require('./offer_handlers');
var _shopping = require('./shopping_handlers');
var _checkout = require('./checkout_handlers');

// Container object for module
var handlers = {};

// Sample handler
handlers.ping = function(data, callback){
    // Callback a http status code, and a payload object
    callback(200);
};

  // Not found handler
handlers.notFound = function(data, callback){
    callback(404);
};

handlers.users = function(data, callback){
    var acceptableMethods = ['post','get','put','delete'];

    if (acceptableMethods.indexOf(data.method) > -1){
        _users[data.method](data, callback);
    } else {
        callback(405);
    }

};

handlers.tokens = function(data, callback){
    var acceptableMethods = ['post','get','put','delete'];

    if (acceptableMethods.indexOf(data.method) > -1){
        _tokens[data.method](data, callback);
    } else {
        callback(405);
    }

};

handlers.login = function(data, callback){
    var acceptableMethods = ['post','put'];

    if (acceptableMethods.indexOf(data.method) > -1){
        _tokens[data.method](data, callback);
    } else {
        callback(405);
    }

};

handlers.logout = function(data, callback){
    var acceptableMethods = ['delete'];

    if (acceptableMethods.indexOf(data.method) > -1){
        _tokens[data.method](data, callback);
    } else {
       callback(405);
    }

};

handlers.offer = function(data, callback){
    var acceptableMethods = ['get'];

    if (acceptableMethods.indexOf(data.method) > -1){
        _offers[data.method](data, callback);
    } else {
       callback(405);
    }

};

handlers.shopping = function(data, callback){
    var acceptableMethods = ['post','get','delete'];

    if (acceptableMethods.indexOf(data.method) > -1){
        _shopping[data.method](data, callback);
    } else {
       callback(405);
    }

};

handlers.checkout = function(data, callback){
    var acceptableMethods = ['post'];

    if (acceptableMethods.indexOf(data.method) > -1){
        _checkout[data.method](data, callback);
    } else {
       callback(405);
    }

};

// Export the module
module.exports = handlers;
