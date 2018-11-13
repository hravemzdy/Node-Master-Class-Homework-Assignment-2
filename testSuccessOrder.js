
/*
 * PIZZA Shop rest API
 *
 * Test Success Order
 */

// Dependencies
var helpers = require('./lib/helpers');
var _user_service = require('./lib/Users_service');
var _token_service = require('./lib/tokens_service');
var _shopping_service = require('./lib/shopping_service');
var _checkout_service = require('./lib/checkout_service');
var _mailgun = require('./lib/_utils_mailgun');
var _stripe = require('./lib/_utils_stripe');
var _cart = require('./lib/_cart');

//  TEST data
var testUserEmail = 'ladislav.test@seznam.cz';
var testUserFullname = 'Ladislav Test';
var testUserAddress = 'Na Pankraci 125, Praha 4';
var testUserPassword = 'verySecretAndPersonal';

_user_service.create(testUserEmail,testUserPassword,testUserFullname,testUserAddress,function(err){
  console.log('USER SERVICE ERROR: ', err);
  if (err==200){
    _user_service.findByEmail(testUserEmail,function(err,userData){
      console.log('FIND USER SERVICE ERROR: ', err);
      if (err==200){
        console.log('USER DATA: ', userData);
        _token_service.create(testUserEmail,testUserPassword,function(err,tokenData){
          console.log('TOKEN SERVICE ERROR: ', err);
          if (err==200){
            console.log('TOKEN CREATED: ', tokenData);
            _shopping_service.addToCart('100',testUserEmail,function(err,userCart){
              console.log('CART SERVICE ERROR: ', err);
              if (err==200){
                  console.log('ARTICLE ADDED: ', userCart);
                  _shopping_service.addToCart('105',testUserEmail,function(err,userCart){
                    console.log('CART SERVICE ERROR: ', err);
                    if (err==200){
                      console.log('ARTICLE ADDED: ', userCart);
                      _checkout_service.placeOrder(testUserEmail,function(err,userInvoice){
                        console.log('CHECKUT SERVICE ERROR: ', err);
                        if (err==200){
                          console.log('ORDER PLACED: ', userInvoice);
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
    });
  }
});
