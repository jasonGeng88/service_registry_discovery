var proxy = require('http-proxy').createProxyServer({});
var loadbalance = require('loadbalance')
var cache = require('../middlewares/local-storage');
var constants = require("../constants");
var process = require('process');
var debug = require('debug')('dev:reserveProxy');

function reverseProxy(req, res, next) {

    var serviceName = req.headers[constants.SERVICE_NAME];
    var apiName = req.headers[constants.API_NAME];
    var serviceNode = constants.SERVICE_ROOT_PATH + '/' + serviceName;

    debug(cache.getItem(constants.ROUTE_KEY)[serviceNode]);

    var host = cache.getItem(constants.ROUTE_KEY)[serviceNode].pick();
    var url = 'http://' + host + apiName;
    debug('The proxy url is ' + url);
    proxy.web(req, res, {
        target: url
    });
}

module.exports = reverseProxy;