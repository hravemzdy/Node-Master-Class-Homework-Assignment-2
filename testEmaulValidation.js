
/*
 * PIZZA Shop rest API
 *
 * Test Email Validation
 */

// Dependencies
var helpers = require('./lib/helpers');

//  TEST data
var testEmailGood = 'ladislav.lisy@seznam.cz';
var testEmailFail = 'ladis@lav.lisy@seznam.cz';

// Tests
var testReultGood = helpers.getValidEmailStringOrFalse(testEmailGood);
var testReultFail = helpers.getValidEmailStringOrFalse(testEmailFail);
console.log('Good result:', testReultGood);
console.log('Fail result:', testReultFail);

var testRegExGood = testEmailGood.match(helpers.emailRegExPattern);
var testRegExFail = testEmailFail.match(helpers.emailRegExPattern);
console.log('Good result:', testRegExGood);
console.log('Fail result:', testRegExFail);
