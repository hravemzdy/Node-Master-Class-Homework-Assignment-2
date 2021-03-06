/*
 * PIZZA Shop rest API
 * 
 * Start HTTP & HTTPS server
 * 
*/

// Dependencies
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var fs = require('fs');
var path = require('path');
var util = require('util');
var debugModule = util.debuglog('server');
var helpers = require('./helpers');
var router = require('./router');
var config = require('./config');

// Container object for module
var server = {};

// intantiate the http server
server.httpServer = http.createServer(function(req, res) {
    server.createRestApiServer(req, res);
});
  
// intantiate the http server
server.httpsServerOptions = {
    'key' : fs.readFileSync(path.join(__dirname, '../https/key.pem')),
    'cert' : fs.readFileSync(path.join(__dirname, '../https/cert.pem'))
};

server.httpsServer = https.createServer(server.httpsServerOptions, function(req, res) {
    server.createRestApiServer(req, res);
});

server.createRestApiServer = function(req, res) {
    var requestUrl = url.parse(req.url, true);
    
    // get the PATH
    var requestPath = requestUrl.pathname;

    // get the http method
    var method = req.method.toLowerCase();

    // get the query string as an object
    var queryStringObject = requestUrl.query;

    // get the headers as an object
    var headers = req.headers;

    var handlerPath = server.getTrimedPath(requestPath);
 
    // get the payload, if any
    var decoder = new StringDecoder('utf-8');

    var buffer = '';
    req.on('data', function(data){
        buffer += decoder.write(data);
    });
    
    req.on('end', function(){
        buffer+= decoder.end();
 
        // Construct the data object to send to the handler
        var handlerData = {
            'handlerPath' : handlerPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : server.parseJsonPayloadToObject(buffer)
        };
    
        var responseHandler = router.findHandler(handlerPath);

        responseHandler(handlerData, function(statusCode, payload) {
            // Use the status code called back by the handler, or set the default status code to 200
            statusCode = server.statusCodeOrDefault(statusCode);
            // Use the payload called back by handler, or set the default payload to an empty object
            payload = server.payloadOrDefault(payload);
            // Convert the payload to a string
            var payloadString = JSON.stringify(payload);
            // Return response
            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            // If the response is 200, print green, otherwise print red
            if(statusCode == 200){
                helpers.debug_ok(debugModule, method.toUpperCase()+' /'+handlerPath+' '+statusCode);
            } else {
                helpers.debug_err(debugModule, method.toUpperCase()+' /'+handlerPath+' '+statusCode);
            }
        });
    });
};

server.getTrimedPath = function(pathname){
    const trimePattern = /^\/+|\/+$/g;
    return pathname.replace(trimePattern, '');
};

server.statusCodeOrDefault = function(statusCode) {
    if (typeof(statusCode) == 'number') {
        return  statusCode ;
    }
    return 200;
};

server.payloadOrDefault = function(payload) {
    if (typeof(payload) == 'object') {
        return  payload ;
    }
    return {};
};

// Parse a JSON string to an object in all cases, without throwing
// debug payload
server.parseJsonPayloadToObject = function(str){
    var stringObject = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : false;
    if (!stringObject) {
        return {};
    } else {
        try{
            var obj = JSON.parse(stringObject);
            helpers.debug_ok(debugModule, stringObject);
            return obj;
        } catch(e){
            helpers.debug_err(debugModule, e);
            helpers.debug_err(debugModule, str);
            return {};
        }
    }
};

// Init script
server.init = function(){
    // Start the HTTP server
    server.httpServer.listen(config.httpPort,function(){
        console.log('\x1b[36m%s\x1b[0m','The HTTP server is running on port '+config.httpPort);
    });

    // Start the HTTPS server
    server.httpsServer.listen(config.httpsPort,function(){
        console.log('\x1b[35m%s\x1b[0m','The HTTPS server is running on port '+config.httpsPort);
    });
};
   
   // Export the module
module.exports = server;
