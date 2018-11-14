
/*
 * PIZZA Shop rest API
 *
 * Test Stripes API with Mock
 */

// Dependencies
var helpers = require('./lib/helpers');
var _stripe = require('./lib/_utils_stripe');
var _cart = require('./lib/_cart');

//  TEST data
var testEmail = 'test@example.cz';

var testArticle = {
  'id' : '500',
  'name' : 'FONDANT DI CIOCCOLATO',
  'mixtureCzech' : 'čokoládový fondant s limetkovo-smetanovou omáčkou a vanilkovou zmrzlinou',
  'mixtureEnglish' : 'chocolate fondant with lime-cream sauce and vanilla ice cream',
  'price' : 85
};

var testUser = {
  'email' : testEmail,
  'fullname' : 'Homework Test',
  'address' : 'Homework 1362, CZ'
};

var emptyCart = _cart.createEmptyCart(testEmail);

emptyCart.cartItems.push(testArticle);

var testCart = _cart.recalculateCart(emptyCart);

console.log(helpers.msg_ok('CART:'));
console.log(testCart);

var testOrder = helpers.createRandomString(20);
var testDate = new Date(Date.now());

var testInvoice = _cart.createInvoice(testOrder, testDate, testUser, testCart);

console.log(helpers.msg_ok('INVOICE:'));
console.log(testInvoice);

var testPayment = _stripe.createCharge(testInvoice.totalCharge, 'usd');

console.log(helpers.msg_ok('PAYMENT:'));
console.log(testPayment);

_stripe.chargeCustomerMock(testOrder, testInvoice.totalCharge, 'usd', function(err){
  if (!err){
    console.log(helpers.msg_ok("STRIPE request ended successfully"));
  }else{
    console.log(elpers.msg_err(err));
  }
});
