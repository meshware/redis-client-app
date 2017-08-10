/**
 * 日志输出
 */
'use strict';
import log from 'electron-log';
import util from 'util';
import fs from 'fs';
import os from 'os';
import path from 'path';

const homeDir = os.homedir();
const appFilePath = path.join(homeDir, "/RedisClient");
const logFilePath = path.join(homeDir, "/RedisClient/Logs");

log.transports.console.level = 'debug';

log.transports.console = function (msg) {
    let text = util.format.apply(util, msg.data);
    console.log(`[${msg.date.toLocaleTimeString()} ${msg.level}] ${text}`);
};

// Set approximate maximum log size in bytes. When it exceeds,
// the archived log will be saved as the log.old.log file
log.transports.file.maxSize = 5 * 1024 * 1024;

// Same as for console transport
log.transports.file.level = 'info';
log.transports.file.format = '[{m}-{d} {h}:{i}:{s}:{ms}] {text}';

let promise = new Promise(function (resolve, reject) {
    if (!fs.existsSync(appFilePath)) {
        fs.mkdir(appFilePath, function (err) {
            if (err) {
                console.error(err);
            } else {
                console.log("Create app folder done!");
            }
        });
    }
    resolve();
});

promise.then(function () {
    if (!fs.existsSync(logFilePath)) {
        fs.mkdir(logFilePath, function (err) {
            if (err) {
                console.error(err);
            } else {
                console.log("Create log folder done!");
            }
        });
    }
}).then(function(){
    // Write to this file, must be set before first logging
    log.transports.file.file = logFilePath + '/log.txt';
    // fs.createWriteStream options, must be set before first logging
    log.transports.file.streamConfig = { encoding: 'utf8', flags: 'a' };
    // set existed file stream
    log.transports.file.stream = fs.createWriteStream(log.transports.file.file, log.transports.file.streamConfig);
}).catch(error => console.error(error));

log.transports.file.appName = 'redis-client';

export default log;