/**
 * 程序界面主入口
 *
 * @author Zhiguo.Chen
 */
'use strict';
const BrowserWindow = require('electron').remote.BrowserWindow;
const path = require('path');
const ipc = require('electron').remote.ipcMain;

const isDevMode = process.execPath.match(/[\\/]electron/);

// if (isDevMode) enableLiveReload();

const iconName = process.platform === 'darwin' ? 'icon.icns' : 'icon.ico';
const iconPath = path.join(__dirname, './asserts/icons', iconName);

let sub = {};

sub.loadNewWindow = function (redisAlias) {
    const modalPath = path.join('file://', __dirname, './sub_index.html');
    let win = new BrowserWindow({
        icon: iconPath,
        title: 'RCA [Server:' + redisAlias + ']',
        minHeight: 600,
        minWidth: 1000,
        height: 666,
        width: 1088,
        fullscreenable: false,
        useContentSize: true,
        titleBarStyle: 'hidden-inset',
        autoHideMenuBar: true,
        frame: true,
        darkTheme: true,
        transparent: false //窗口透明
    });

    win.on('close', function () { win = null });
    win.loadURL(modalPath);
    win.show();

    //页面加载完成后，发送事件创建redis连接
    win.webContents.on('did-finish-load', function () {
        win.webContents.send('createRedisConnection', redisAlias);
    });

    // Open the DevTools.
    if (isDevMode) {
        win.webContents.openDevTools();
    }
};

export default sub;