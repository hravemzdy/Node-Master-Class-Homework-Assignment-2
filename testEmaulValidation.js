
/*
 * PIZZA Shop rest API
 *
 * Test Email Validation
 */

// Dependencies
var helpers = require('./lib/helpers');

//  TEST data
var testEmailGood = 'homework@example.cz';
var testEmailFail = 'h@mework@example.cz';

// Tests
var testReultGood = helpers.getValidEmailStringOrFalse(testEmailGood);
var testReultFail = helpers.getValidEmailStringOrFalse(testEmailFail);
console.log(helpers.msg_ok('Good result:'), testReultGood);
console.log(helpers.msg_err('Fail result:'), testReultFail);

var testRegExGood = testEmailGood.match(helpers.emailRegExPattern);
var testRegExFail = testEmailFail.match(helpers.emailRegExPattern);
console.log(helpers.msg_ok('Good result:'), testRegExGood);
console.log(helpers.msg_err('Fail result:'), testRegExFail);
