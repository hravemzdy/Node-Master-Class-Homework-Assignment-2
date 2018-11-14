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
var _stripe = require('./_utils_stripe');
var _mailgun = require('./_utils_mailgun');
var util = require('util');
var debugModule = util.debuglog('service');

// Container object for module
var service = {};

// SUCCESS: callback to caller (ok=false)
// FAILURE: callback to caller (err=errorText)
service._updateUserInvoicePaid = function(orderNumber,callback){
  // Lookup order data
  _data.read('orders',orderNumber,function(err, orderData){
    if (!err && orderData) {
      // update order data with payment
      orderData.invoicePaid = true;
      _data.update('orders',orderNumber,orderData,function(err){
        if (!err){
          callback(false);
        }else {
          callback("Failed to update order data with InvoicePaid");
        }
      });
    } else {
      callback("Failed to read order data for update with InvoicePaid");
    }
  });
};

// SUCCESS: callback to caller (ok=false)
// FAILURE: callback to caller (err=errorText)
service._updateUserInvoiceSent = function(orderNumber,callback){
  // Lookup order data
  _data.read('orders',orderNumber,function(err, orderData){
    if (!err && orderData) {
      // update order data with payment
      orderData.invoiceSent = true;
      _data.update('orders',orderNumber,orderData,function(err){
        if (!err){
          callback(false);
        }else {
          helpers.debug_err(debugModule, errors.ErrCreate("Failed to update order data with InvoicePaid"));
          callback("Failed to update order data with InvoiceSent");
        }
      });
    } else {
      callback("Failed to read order data for update with InvoiceSent");
    }
  });
};

// SUCCESS: callback to caller (ok=false)
// FAILURE: callback to caller (err=errorText)
service._updateUserCartEmpty = function(userEmail,userCartId,callback){
  var userCartId = helpers.getValidStringExactLenOrFalse(userCartId, 20);
  if (userCartId) {
    var cartEmpty = _cart.createEmptyCart(userEmail);
    // update user's carts data with empty cart
    _data.update('carts',userCartId,cartEmpty,function(err){
      if (!err){
        callback(false);
      }else {
        helpers.debug_err(debugModule, errors.ErrCreate("Failed to empty user's cart"));
        callback("Failed to empty user's cart");
      }
    });
  }else{
    callback(false);
  }
};

// SUCCESS: callback to caller (ok=false, dataObject)
// FAILURE: callback to caller (err=errorText)
service._createInvoice = function(userEmail,userData,cartData,callback){
  if (cartData.totalPrice > 0 && cartData.totalCount > 0){
    var orderNumber = helpers.createRandomString(20);
    var orderDate = new Date(Date.now());
    // Create order, invoice and place order
    var orderInvoice = _cart.createInvoice(orderNumber,orderDate,userData,cartData);
    if (orderInvoice) {
      callback(false,orderInvoice);
    } else {
      helpers.debug_err(debugModule, errors.ErrCreate("Failed to update order data with InvoiceSent"));
      callback("Error encountered when creating invoice");
    }
  }else {
    callback("Nothing to order, user's cart is empty");
  }
};

// SUCCESS: callback to caller (ok=statusCode(200), dataObject)
// FAILURE: callback to caller (err=statusCode, errorObject)
service.placeOrder = function(emailParam,callback){
  var userEmail = helpers.getValidEmailStringOrFalse(emailParam);
  if (userEmail) {
    // Lookup user data for cart id
    _data.read('users',userEmail,function(err, userData){
      if (!err && userData) {
        var userCartId = helpers.getValidStringExactLenOrFalse(userData.cartId, 20);
        if (userCartId) {
          // Lookup the user's cart
          _data.read('carts', userCartId, function(err, cartData){
            if (!err && cartData) {
              if (userEmail == cartData.userEmail){
                service._createInvoice(userEmail,userData,cartData,function(errInvoice,orderInvoice){
                  if (!errInvoice && orderInvoice){
                    // Create order in user data
                    _data.create('orders',orderInvoice.orderNumber,orderInvoice,function(err){
                      if (!err){
                        var userOrders = helpers.getValidArrayOrEmpty(userData.orders);
                        userOrders.push(orderInvoice.orderNumber);
                        userData.orders = userOrders;
                        // update User data with placed orders
                        _data.update('users',userEmail,userData,function(err){
                          if (!err){
                            service._updateUserCartEmpty(userEmail,userCartId,function(err){
                              if (!err){
                                // Create payment
                                service._createChargeAndNotifyToEmail(userEmail,orderInvoice,function(errCharge,errChargeMsg){
                                  if (!errCharge){
                                    helpers.debug_ok(debugModule, errors.OkCreate("User's order was place successfully"));
                                    // return invoice object
                                    callback(200, orderInvoice);
                                  }else {
                                    callback(errCharge, errChargeMsg);
                                  }
                                });
                              }else {
                                callback(500, errors.ErrCreate("Error updating user's cart to empty state"));
                              }
                            });
                          }else {
                            callback(500, errors.ErrCreate("Error updating user's data with placed order"));
                          }
                        });
                      }else {
                        callback(500, errors.ErrCreate("Error creating and saving order"));
                      }
                    });
                  }else {
                    callback(500, errors.ErrCreate(errInvoice));
                  }
                });
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

// SUCCESS: callback to caller (ok=false, false)
// FAILURE: callback to caller (err=statusCode, errorObject)
service._createChargeAndNotifyToEmail = function(userEmail,orderInvoice,callback){
  // Call charge API
  _stripe.chargeCustomer(orderInvoice.orderNumber, orderInvoice.totalCharge, 'usd', function(errCharge){
    if (!errCharge){
      service._updateUserInvoicePaid(orderInvoice.orderNumber,function(errUpdatePaid){
        // Create email to customer
        service._createEmailAndNotifyToEmail(orderInvoice,function(errEmail,errEmailMsg){
          if (!errEmail) {
            if (!errUpdatePaid){
              callback(false, false);
            }else {
              callback(500, errors.ErrCreate(errUpdatePaid));
            }
          }else {
            callback(errEmail, errEmailMsg);
          }
        });
      });
    }else {
      callback(500, errCharge)
    }
  });
};

// SUCCESS: callback to caller (ok=false, false)
// FAILURE: callback to caller (err=statusCode, errorObject)
service._createEmailAndNotifyToEmail = function(orderInvoice,callback){
  var emailConfirmation = _mailgun.createEmailConfirmation(orderInvoice);
  if (emailConfirmation)
  {
    // Call mailgun API
    _mailgun.notifyCustomerByEmail(emailConfirmation, function(errEmail){
      if (!errEmail){
        service._updateUserInvoiceSent(orderInvoice.orderNumber,function(errUpdateSent){
          if (!errUpdateSent){
            callback(false, false);
          }else {
            callback(500, errors.ErrCreate(errUpdateSent));
          }
        });
      } else {
        callback(500, errors.ErrCreate(errEmail));
      }
    });
  }else {
    callback(500, errors.ErrCreate("Error encountered when creating email confirmation, user was carged, but invoice cannot be sent"));
  }
};


// Export the module
module.exports = service;
