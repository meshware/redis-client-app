/**
 * 应用配置
 *
 * @author Zhiguo.Chen
 */
"use strict";
import path from 'path';
import fs from 'fs';
import os from 'os';
import notify from '../common/notify';

const homeDir = os.homedir();

let config = {
    filePath: path.join(homeDir, "/RedisClient/"),
    fileName: "config.json",
    configFile: {
        serverHost: "127.0.0.1",
        serverPort: 8080,
        token: ""
    }
};

/**
 * 检查配置文件是否存在
 *
 * @returns {boolean}
 */
config.checkFileExist = function () {
    // console.log(config.getConfigFilePath());
    return fs.existsSync(config.getConfigFilePath());
};

/**
 * 创建配置文件
 *
 * @param configFile
 */
config.saveConfigFile = function (configFile) {
    let newConfigFile;
    if (configFile) {
        newConfigFile = JSON.stringify(configFile, null, 4);
        config.configFile = configFile;
        console.log("创建自定义配置文件！")
    } else {
        newConfigFile = JSON.stringify(config.configFile, null, 4);
        console.log("创建默认配置文件！")
    }
    fs.mkdir(config.filePath, function (err) {
        if (err) {
            notify(err);
            console.error(err);
        }
        console.log(newConfigFile);
        fs.writeFileSync(config.getConfigFilePath(), newConfigFile);
        console.log("config file creat done!");
    });
};

/**
 * 加载配置文件
 *
 * @param theConfig
 * @returns {configFile}
 */
config.loadConfigFile = function (theConfig) {
    if (config.checkFileExist()) {
        // console.log(fs.readFileSync(config.getConfigFilePath(), 'utf-8'));
        theConfig.configFile = JSON.parse(fs.readFileSync(config.getConfigFilePath(), 'utf-8'));
        // notify("Server Host：" + theConfig.configFile.serverHost);
        console.log("新的配置Host：" + theConfig.configFile.serverHost);
        return theConfig.configFile;
    } else {
        return null;
    }
};

/**
 * 获取服务器地址
 *
 * @returns {string}
 */
config.getServerUrl = function () {
    return "http://" + config.configFile.serverHost + ":" + config.configFile.serverPort;
};

/**
 * 获取配置文件地址
 *
 * @returns {string}
 */
config.getConfigFilePath = function () {
    return config.filePath + config.fileName;
};

/**
 * 预先加载配置
 */
config.loadConfigFile(config);

export default config;
