/**
 * Redis
 *
 * @author Zhiguo.Chen
 */
"use strict";
import sysProcess from 'child_process';
import Redis from 'redis';

let RDS_PORT = 6379,        //端口号
    RDS_HOST = '127.0.0.1',    //服务器IP
    RDS_OPTS = {},            //设置项
    client;

let rds = {};

rds.connect = function (redisAlias) {
    RDS_HOST = '172.27.35.1';
    client = Redis.createClient(RDS_PORT, RDS_HOST, RDS_OPTS);

    client.on('ready', function (res) {
        rds.client = client;
        console.log('ready');
    });

    client.on("error", function (err) {
        console.log("Error " + err);
    });
};

rds.getServerInfo = function () {
    console.log(client);
};

export default rds;