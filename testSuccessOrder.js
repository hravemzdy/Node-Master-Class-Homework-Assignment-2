
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
var testUserEmail = 'test@example.cz';
var testUserFullname = 'Homework Test';
var testUserAddress = 'Homework 125, Praha 4';
var testUserPassword = 'verySecretAndPersonal';

_user_service.create(testUserEmail,testUserPassword,testUserFullname,testUserAddress,function(err, errCreateUser){
  console.log('USER SERVICE STATUS: ', err);
  if (err==200){
    _user_service.findByEmail(testUserEmail,function(err,userData){
      console.log('FIND USER SERVICE STATUS: ', err);
      if (err==200){
        console.log('USER DATA: ', userData);
        _token_service.create(testUserEmail,testUserPassword,function(err,tokenData){
          console.log('TOKEN SERVICE STATUS: ', err);
          if (err==200){
            console.log('TOKEN CREATED: ', tokenData);
            _shopping_service.addToCart('100',testUserEmail,function(err,userCart){
              console.log('CART SERVICE STATUS: ', err);
              if (err==200){
                  console.log('ARTICLE ADDED: ', userCart);
                  _shopping_service.addToCart('105',testUserEmail,function(err,userCart){
                    console.log('CART SERVICE STATUS: ', err);
                    if (err==200){
                      console.log('ARTICLE ADDED: ', userCart);
                      _checkout_service.placeOrder(testUserEmail,function(err,userInvoice){
                        console.log('CHECKUT SERVICE STATUS: ', err);
                        if (err==200){
                          console.log('ORDER PLACED: ', userInvoice);
                          console.log(helpers.msg_ok('TEST SUCCESFUL'));
                        }else{
                          console.log('ORDER ERROR: ', userInvoice);
                          console.log(helpers.msg_err('TEST FAILED'));
                      }
                      });
                    }else{
                      console.log('ORDER ERROR: ', userCart);
                      console.log(helpers.msg_err('TEST FAILED'));
                    }
                  });
                }else{
                  console.log('ORDER ERROR: ', userCart);
                  console.log(helpers.msg_err('TEST FAILED'));
                }
              });
            }else{
              console.log('ORDER ERROR: ', tokenData);
              console.log(helpers.msg_err('TEST FAILED'));
            }
          });
        }else{
          console.log('ORDER ERROR: ', userData);
          console.log(helpers.msg_err('TEST FAILED'));
        }
    });
  }else{
    console.log('ORDER ERROR: ', errCreateUser);
    console.log(helpers.msg_err('TEST FAILED'));
  }
});
