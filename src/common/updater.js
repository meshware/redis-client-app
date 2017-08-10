/**
 * 自动更新器
 */
'use strict';
import {autoUpdater} from "electron-updater";
import os from 'os';
import {app, dialog} from 'electron';

const log = global.logger;

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

//这里设置更新服务器域名或IP地址
const UPDATE_SERVER = '';
var updateFeed = 'http://' + UPDATE_SERVER + '/updates/latest';
const appVersion = require('./package.json').version;
const feedURL = updateFeed + '?v=' + appVersion;
autoUpdater.setFeedURL(feedURL);

//更新可用, 可以通过通知系统告知用户有更新可用
autoUpdater.addListener("update-available", function (event) {
    alert("update-available");
});
//更新下载完成后, 可提示用户重启应用程序
autoUpdater.addListener("update-downloaded", function (event, releaseNotes, releaseName, releaseDate, updateURL) {
    alert("update-downloaded");
});
//更新错误
autoUpdater.addListener("error", function (error) {
    alert("error");
});
//正在检查更新
autoUpdater.addListener("checking-for-update", function (event) {
    alert("checking-for-update");
});
//没有新版本
autoUpdater.addListener("update-not-available", function (event) {
    alert("update-not-available");
});

let updater = {};
updater.checkUpdate = function () {
    try {
        autoUpdater.checkForUpdates();
        autoUpdater.on('update-downloaded', () => {
            const ret = dialog.showMessageBox(app.$mainWindow, {
                type: 'question',
                buttons: ['重启并使用新版本', '下次打开时升级'],
                defaultId: 0,
                cancelId: 1,
                title: '新版本已经准备好了',
                message: '马上重启并使用新版本吗？'
            });
            if (ret === 0) {
                autoUpdater.quitAndInstall()
            }
        })
    } catch (e) {
        console.log(e)
    }
};

export default updater;
