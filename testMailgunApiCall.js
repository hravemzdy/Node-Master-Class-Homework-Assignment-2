
/*
 * PIZZA Shop rest API
 *
 * Test Mailgun API
 */

// Dependencies
var helpers = require('./lib/helpers');
var _mailgun = require('./lib/_utils_mailgun');
var _cart = require('./lib/_cart');

//  TEST data
var testEmail = 'ladislav.lisy@seznam.cz';

var testArticle = {
  'id' : '500',
  'name' : 'FONDANT DI CIOCCOLATO',
  'mixtureCzech' : 'čokoládový fondant s limetkovo-smetanovou omáčkou a vanilkovou zmrzlinou',
  'mixtureEnglish' : 'chocolate fondant with lime-cream sauce and vanilla ice cream',
  'price' : 85
};

var testUser = {
  'email' : testEmail,
  'fullname' : 'Ladislav Lisy',
  'address' : 'Hradebni 1362, CZ'
};

var testCart = _cart.recalculateCart(emptyCart);

console.log(testCart);

var testOrder = helpers.createRandomString(20);
var testDate = new Date(Date.now());

var testInvoice = _cart.createInvoice(testOrder, testDate, testUser, testCart);

console.log(testInvoice);

var testConfirm = _mailgun.createEmailConfirmation(testInvoice);

console.log(testConfirm);

var testPayment = _stripe.createCharge(testInvoice.totalCharge, 'usd');

console.log(testPayment);

_mailgun.notifyCustomerByEmail(testConfirm, function(err){
  if (!err){
    console.log("MAILGUN request ended successfully");
  }else{
    console.log(err);
  }
});
