/*
 * PIZZA Shop rest API
 *
 * Create router for API handlers
 *
*/

// Dependencies
var apihandlers = require('./api_handlers');

// Container object for module
var router = {};

router.defaultHandler = apihandlers.notFound;

router.handlers = {
    'ping' : apihandlers.ping,
    'users' : apihandlers.users,
    'login' : apihandlers.login,
    'logout' : apihandlers.logout,
    'offer' : apihandlers.offer,
    'shopping' : apihandlers.shopping,
    'checkout' : apihandlers.checkout
};

router.findHandler = function(path) {
    if (typeof(router.handlers[path]) != 'undefined') {
        return router.handlers[path];
    }
    return router.defaultHandler;
};

// Export the module
module.exports = router;
