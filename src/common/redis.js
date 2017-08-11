/**
 * Redis
 *
 * @author Zhiguo.Chen
 */
"use strict";
import sysProcess from 'child_process';
// import Redis from 'redis';
import Redis from 'ioredis';

let RDS_PORT = 6379,        //端口号
    RDS_HOST = '127.0.0.1',    //服务器IP
    RDS_OPTS = {},            //设置项
    redis;

let rds = {};

rds.connect = function (redisAlias) {
    console.log("redisAlias:" + redisAlias);
    RDS_HOST = '172.27.35.1';
    redis = new Redis(RDS_PORT, RDS_HOST);
    // redis.Command("keys *");

    redis.once('error', function (error) {
        console.error("Error " + error);
    });
    redis.once('end', function () {
        console.info("end");
    });
    // redis.on('ready', function (res) {
    //     console.log(redis);
    //     rds.redis = redis;
    //     console.log('ready:' + res);
    // });
    rds.redis = redis;
    return redis;
    // client.on("error", function (err) {
    //     console.log("Error " + err);
    // });
};

rds.getServerInfo = function () {
    console.log(redis);
};

export default rds;