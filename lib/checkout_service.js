/*
 * PIZZA Shop rest API
 *
 * Checkout service module
 *
*/

// Dependencies
var helpers = require('./helpers');
var errors = require('./errors');
var _data = require('./_data');
var _tokens = require('./_tokens');
var _cart = require('./_cart');
var _stripe = require('./utils_stripe');
var _mailgun = require('./utils_mailgun');
var util = require('util');
var debugModule = util.debuglog('service');

// Container object for module
var service = {};

service.placeOrder = function(emailParam,callback){
  var userEmail = helpers.getValidEmailStringOrFalse(emailParam);
  if (userEmail) {
    // Lookup user data for cart id
    _data.read('users',userEmail,function(err, userData){
      if (!err && userData) {
        var userCartId = helpers.getValidStringExactLenOrFalse(userData.cartId, 20);
        if (userCartId) {
          // Lookup the user's cart
          _data.read('carts', saveCartId, function(err, cartData){
            if (!err && cartData) {
              if (userEmail == cartData.userEmail){
                if (cartData.totalPrice > 0 && cartData.totalCount > 0){
                  var orderNumber = helpers.createRandomString(20);
                  var orderDate = new Date(Date.now());
                  // Create payment
                  service.._createPaymentAndChargeAndNotify(orderNumber,orderDate,userData,cartData,function(err,errMsg,invoiceData){
                    if (!err){
                      callback(200, invoiceData);
                    }else {
                      callback(err, errMsg);
                    }
                  });
                  }else {
                    callback(500, errors.ErrCreate("Cannot create payment object for user"));
                  }
                }else {
                  callback(400, errors.ErrCreate("Nothing to order, user's cart is empty"));
                }
              }else {
                helpers.debug_err(debugModule, errors.ErrCreate("User's email doen't correspond with cart's email"));
                callback(403);
              }
            }else {
              callback(500, errors.ErrCreate("Could not find the user's cart"));
            }
          });
        }else {
          callback(400, errors.ErrCreate("Nothing to order, user's cart doesn't exist"));
        }
      }else {
        helpers.debug_err(debugModule, errors.ErrCreate(err));
        callback(403);
      }
    });
  }else {
    callback(400, errors.ErrCreate("Missing required field"));
  }
};

service._createPaymentAndChargeAndNotify(orderNumber,orderDate,userData,cartData,callback){
  var chargePayment = _stripe.createCharge(cartData.totalPrice, 'us');
  if (chargePayment){
    // Call charge API
    _stripe.chargeCustomer(chargePayment, function(err){
      if (!err){
        // Create invoice object
        var invoiceToUser = _cart.createInvoice(orderNumber,orderDate,userData,cartData);
        if (invoiceToUser)
        {
          // Create email to customer
          service._createEmailAndNotify(invoiceToUser,function(err,errMsg){
            if (!err) {
              callback(false, false, invoiceToUser);
            }else {
              callback(err, errMsg);
            }
          });
        } else {
          callback(500, errors.ErrCreate("Error encountered when creating invoice, user was carged, but invoice cannot be sent"));
        }
      }else {
        callback(400, err);
      }
    });
};

service._createEmailAndNotify(invoiceToUser,callback){
  var emailConfirmation = _mailgun.createEmailConfirmation(invoiceToUser);
  if (emailConfirmation)
  {
    // Call mailgun API
    _mailgun.notifyCustomerByEmail(emailConfirmation, function(err){
      if (!err){
        // return invoice object
        helpers.debug_ok(debugModule, errors.OkCreate("User's order was place successfully"));
        callback(false);
      }else {
        callback(500, errors.ErrCreate("Error encountered when sending email to user, user was carged, but confirmation has't be sent successfully"));
      }
  }else {
    callback(500, errors.ErrCreate("Error encountered when creating email confirmation, user was carged, but invoice cannot be sent"));
  }
};


// Export the module
module.exports = service;
