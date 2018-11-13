/*
 * PIZZA Shop rest API
 *
 * mailgun API functions
 *
 * curl -s --user 'api:secret' \
 *     https://api.mailgun.net/v3/sandboxGUID.mailgun.org/messages \
 *         -F from='Mailgun Sandbox <ladislav.lisy@sandboxGUID.mailgun.org>' \
 *         -F to='Ladisalv Lisy <ladislav.lisy@seznam.cz>' \
 *         -F subject='Hello Ladisalv Lisy' \
 *         -F text='Congratulations Ladisalv Lisy, you just sent an email with Mailgun!  You are truly awesome!'
 *
*/

// Dependencies
var https = require('https');
var querystring = require('querystring');
var helpers = require('./helpers');
var errors = require('./errors');
var util = require('util');
var debugModule = util.debuglog('service');
var libKey = require('../api_keys/_key_mailgun.json');

// Container object for module
var lib = {};

lib.apiSendEmailHost = 'api.mailgun.net';

lib.createEmailConfirmation = function(invoice){
  var message = 'Helo, ' + invoice.customerName + '.\n';
//  message += 'Thank you for your order and your payment\n';
//  message += 'This is summary of the order #:'+ invoice.orderNumber +' you have placed at: ';
//  message += invoice.orderDate + '\n';
//  message += 'Article:\tPrice\n';

// invoice.orderItems.forEach(function(item){
//    message += item.name+'\t';
//    message += item.price+'\n';
//  });
//  message += '---------------------------------\n';
//  message += 'Total quantity:\t' + invoice.totalQuantity;
//  message += '\tprice:\t' + invoice.totalCharge + '\n';
//  message += '---------------------------------\n';
//  message += 'Shipping address: ' + invoice.shipToAddress + '\n';
//  message += 'You are truly awesome!';

  var confirmationData = {
    'nameTo' : invoice.customerName,
    'emailTo' : invoice.customerEmail,
    'msg' : message,
    'invoice' : invoice
  };
  return confirmationData;
};

lib.getPathToApi = function(){
    return '/v3/' + libKey.sandboxid + '.mailgun.org/messages';
};

lib.getEmailFrom = function(){
    return 'adislav.lisy@' + libKey.sandboxid + '.mailgun.org';
};

// SUCCESS: callback to caller (ok=false)
// FAILURE: callback to caller (err=message)
lib.notifyCustomerByEmailMock = function(confirmation, callback){
  var email = helpers.getNonEmptyStringOrFalse(confirmation.emailTo);
  var name = helpers.getNonEmptyStringOrFalse(confirmation.nameTo);
  var msg = helpers.getValidStringMinMaxLenOrFalse(confirmation.msg, 1, 1600);
  var token = helpers.getNonEmptyStringOrFalse(libKey.token_sec);
  var orderNumber = helpers.getNonEmptyStringOrFalse(confirmation.invoice.orderNumber);

  if (email && name && msg && token) {
    // Configure the request payload
    var payload = {
      'from' : 'Mailgun Sandbox <' + lib.getEmailFrom() + '>',
      'to' : name + '<'+ email +'>',
      'subject' : 'Order from Pizza Express: '+orderNumber,
      'text' : msg
    };
    // stringify the payload
    var stringPayload = querystring.stringify(payload);
    // Configure tvilio request details
    var requestDetails = {
      'protocol' : 'https:',
      'hostname' : lib.apiSendEmailHost,
      'method' : 'POST',
      'path' : lib.getPathToApi(),
      'auth' : "Basic " + new Buffer('api:'+token).toString("base64"),
      'headers' : {
        'Content-Type' : 'multipart/form-data'
      },
      'formData' : payload
    };

    callback(false);
  }else {
    callback('Given parameters were missing or invalid');
  }
};

// SUCCESS: callback to caller (ok=false)
// FAILURE: callback to caller (err=message)
lib.notifyCustomerByEmail = function(confirmation, callback){
  var email = helpers.getNonEmptyStringOrFalse(confirmation.emailTo);
  var name = helpers.getNonEmptyStringOrFalse(confirmation.nameTo);
  var msg = helpers.getValidStringMinMaxLenOrFalse(confirmation.msg, 1, 1600);
  var token = helpers.getNonEmptyStringOrFalse(libKey.token_sec);
  var orderNumber = helpers.getNonEmptyStringOrFalse(confirmation.invoice.orderNumber);

  if (email && name && msg && token) {
    // Configure the request payload
    var payload = {
      'from' : 'Mailgun Sandbox <' + lib.getEmailFrom() + '>',
      'to' : name + '<'+ email +'>',
      'subject' : 'Order from Pizza Express: '+orderNumber,
      'text' : msg
    };
    // stringify the payload
    var stringPayload = querystring.stringify(payload);
    // Configure tvilio request details
    var requestDetails = {
      'protocol' : 'https:',
      'hostname' : lib.apiSendEmailHost,
      'method' : 'POST',
      'path' : lib.getPathToApi(),
      'auth' : "Basic " + new Buffer('api:'+token).toString("base64"),
      'headers' : {
        'Content-Type' : 'multipart/form-data'
      },
      'formData' : payload
    };

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

    // End the request
    req.end();
  }else {
    callback('Given parameters were missing or invalid');
  }
};

// Export the module
module.exports = lib;
