/*
 * PIZZA Shop rest API
 *
 * stripe API functions
 *
*/

// Dependencies

// Container object for module
var lib = {};

lib.apiChargePath = 'https://api.stripe.com/v1/charges';

lib.createCharge = function(priceParam,currencyParam){
  var currency = helpers.getValidStringExactLenOrFalse(currencyParam, 3);
  var price = helpers.getValidNumberOrFalse(priceParam);

  if (currency && price){
    var payment = {
      'amount' : price,
      'currency' : currency,
      'description' : 'Example charge',
      'statement_descriptor' : 'Pizza Shop Order',
      'source' : 'tok_visa'
    };
    return payment;
  }else{
    return false;
  }
};

lib.chargeCustomer = function(payment, callback){
  callback(false);
};

// Export the module
module.exports = lib;
