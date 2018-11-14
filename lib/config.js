/*
 * PIZZA Shop rest API
 *
 * config options for app
 *
*/

var options = {};

// Staging (default) options
options.staging = {
    'httpPort' : 3000,
    'httpsPort' : 3001,
    'envName' : 'staging',
    'hashingSecret' : 'thisIsFirstSecret'
};

// Production options
options.production = {
    'httpPort' : 5000,
    'httpsPort' : 5001,
    'envName' : 'staging',
    'hashingSecret' : 'thisIsSecondSecret'
};

// Determining with environment was passed as a command-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check if the current enviromnent is one of the enviromnents above, if not, default to staging
var configToExport = typeof(options[currentEnvironment]) == 'object' ? options[currentEnvironment] : options.staging;

// Export the module
module.exports = configToExport;
