// Dependencies
var helpers = require('./lib/helpers');
var _mailgun = require('./lib/_utils_mailgun');
var _stripe = require('./lib/_utils_stripe');
var _cart = require('./lib/_cart');

var testEmail = 'ladis@lav.lisy@seznam.cz';
var emptyCart = _cart.createEmptyCart(testEmail);

var testArticle = {
  'id' : '500',
  'name' : 'FONDANT DI CIOCCOLATO',
  'mixtureCzech' : 'čokoládový fondant s limetkovo-smetanovou omáčkou a vanilkovou zmrzlinou',
  'mixtureEnglish' : 'chocolate fondant with lime-cream sauce and vanilla ice cream',
  'price' : 85
};


emptyCart.cartItems.push(testArticle);
var testCart = _cart.recalculateCart(emptyCart);

console.log(testCart);

var testUser = {
  'email' : 'ladislav.lisy@seznam.cz',
  'fullname' : 'Ladislav Lisy',
  'address' : 'Hradebni 1362, CZ'
};

var testOrder = helpers.createRandomString(20);
var testDate = new Date(Date.now());

var testInvoice = _cart.createInvoice(testOrder, testDate, testUser, testCart);

console.log(testInvoice);

var testConfirm = _mailgun.createEmailConfirmation(testInvoice);

console.log(testConfirm);

var testPayment = _stripe.createCharge(testInvoice.totalCharge, 'usd');

console.log(testPayment);

_stripe.chargeCustomer(testCart.totalPrice, 'usd', function(err){
  if (!err){
    console.log("STRIPE request ended successfully");
  }else{
    console.log(err);
  }
});

//_mailgun.notifyCustomerByEmail(testConfirm, function(err){
//  if (!err){
//    console.log("MAILGUN request ended successfully");
//  }else{
//    console.log(err);
//  }
//});
