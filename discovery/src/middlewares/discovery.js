"use strict";

var zookeeper = require('node-zookeeper-client');
var loadbalance = require('loadbalance');
var cache = require('./local-storage');
var constants = require('../constants');
var debug = require('debug')('dev:discovery');

var zkClient = zookeeper.createClient(constants.ZK_HOSTS);
cache.setItem(constants.ROUTE_KEY, {});


function connect() {
    zkClient.connect();

    zkClient.once('connected', function() {
        console.log('Connected to ZooKeeper.');
        getServices(constants.SERVICE_ROOT_PATH);
    });
}

/**
 * 获取服务列表
 */
function getServices(path) {
    zkClient.getChildren(
        path,
        function(event) {
            console.log('Got Services watcher event: %s', event);
            getServices(constants.SERVICE_ROOT_PATH);
        },
        function(error, children, stat) {
            if (error) {
                console.log(
                    'Failed to list children of %s due to: %s.',
                    path,
                    error
                );
                return;
            }

            // 遍历服务列表，获取服务节点信息
            children.forEach(function(item) {
                getService(path + '/' + item);
            })

        }
    );
}

/**
 * 获取服务节点信息（IP,Port）
 */
function getService(path) {
    zkClient.getChildren(
        path,
        function(event) {
            console.log('Got Serivce watcher event: %s', event);
            getService(path);
        },
        function(error, children, stat) {
            if (error) {
                console.log(
                    'Failed to list children of %s due to: %s.',
                    path,
                    error
                );
                return;
            }
            // 打印节点信息
            debug('path: ' + path + ', children is ' + children);

            if (children.length > 0) {
                //设置本地缓存和负载策略
                cache.getItem(constants.ROUTE_KEY)[path] = loadbalance.roundRobin(children);
            }

        }
    );
}

module.exports = connect;