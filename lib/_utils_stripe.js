/*
 * PIZZA Shop rest API
 *
 * stripe API functions
 *
*/

// Dependencies
var https = require('https');
var querystring = require('querystring');
var helpers = require('./helpers');
var errors = require('./errors');
var util = require('util');
var debugModule = util.debuglog('service');
var libKey = require('../api_keys/_key_stripe.json');

// Container object for module
var lib = {};

lib.apiChargeHost = 'api.stripe.com';

lib.apiChargePath = '/v1/charges';

lib.createCharge = function(priceParam,currcyParam){
  var amount = helpers.getValidNumberOrFalse(priceParam);
  var currcy = helpers.getValidStringExactLenOrFalse(currcyParam, 3);

  if (currcy && amount){
    var payment = {
      'amount' : amount,
      'currency' : currcy,
      'description' : 'Example charge',
      'statement_descriptor' : 'Pizza Shop Order',
      'source' : 'tok_mastercard_debit'
    };
    return payment;
  }else{
    return false;
  }
};

lib.chargeCustomerMock = function(amountParam,currcyParam,callback){
  var price = helpers.getValidNumberOrFalse(amountParam, 0);
  var curcy = helpers.getNonEmptyStringOrFalse(currcyParam);
  var token = helpers.getNonEmptyStringOrFalse(libKey.token_sec);

  if (price && curcy) {
    // Configure the request payload
    var payload = lib.createCharge(price, curcy);
    // stringify the payload
    var stringPayload = querystring.stringify(payload);
    // Configure tvilio request details
    var requestDetails = {
      'protocol' : 'https:',
      'hostname' : lib.apiChargeHost,
      'method' : 'POST',
      'path' : lib.apiChargePath,
      'auth' : token,
      'headers' : {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(stringPayload)
      }
    };

    console.log(requestDetails);

    callback(false);
  }else {
    callback('Given parameters were missing or invalid');
  }
};

lib.chargeCustomer = function(amountParam,currcyParam,callback){
  var price = helpers.getValidNumberOrFalse(amountParam, 0);
  var curcy = helpers.getNonEmptyStringOrFalse(currcyParam);
  var token = helpers.getNonEmptyStringOrFalse(libKey.token_sec);

  if (price && curcy) {
    // Configure the request payload
    var payload = lib.createCharge(price, curcy);
    // stringify the payload
    var stringPayload = querystring.stringify(payload);
    // Configure tvilio request details
    var requestDetails = {
      'protocol' : 'https:',
      'hostname' : lib.apiChargeHost,
      'method' : 'POST',
      'path' : lib.apiChargePath,
      'auth' : token,
      'headers' : {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(stringPayload)
      }
    };

    console.log(requestDetails);

    // Instantiate the request object
    var req = https.request(requestDetails,function(res){
        // Grab the status of the sent request
        var status =  res.statusCode;

        var decoded_data = '';
        res.on('data', function(chunk) {
           decoded_data = chunk.toString('utf8');
           console.log(decoded_data);
        });

        // Callback successfully if the request went through
        if(status == 200 || status == 201){
          callback(false);
        } else {
          callback('Status code returned was '+status+'\n');
        }
    });

    // Bind to the error event so it doesn't get thrown
    req.on('error',function(e){
      callback(e);
    });

    // Add the payload
    req.write(stringPayload);

    // End the request
    req.end();
  }else {
    callback('Given parameters were missing or invalid');
  }
};

// Export the module
module.exports = lib;
