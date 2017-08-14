/**
 * 程序界面主入口
 *
 * @author Zhiguo.Chen
 */
'use strict';
const BrowserWindow = require('electron').remote.BrowserWindow;
const path = require('path');
const ipc = require('electron').ipcRenderer;

// ipc.on('asynchronous-message', function (event, arg) {
//     event.sender.send('asynchronous-reply', 'pong')
// })

const isDevMode = process.execPath.match(/[\\/]electron/);

// if (isDevMode) enableLiveReload();

const iconName = process.platform === 'win32' ? 'icon.ico' : 'icon.icns';
const iconPath = path.join(__dirname, './asserts/icons', iconName);

let sub = {};

sub.loadNewWindow = function (redisAlias) {
    const modalPath = path.join('file://', __dirname, './sub_index.html');
    let win = new BrowserWindow({
        icon: iconPath,
        title: 'Redis Client Application',
        minHeight: 600,
        minWidth: 1000,
        height: 666,
        width: 1088,
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
    // win.redisAlias = redisAlias;
    // ipc.send('redisAlias', redisAlias);
    // win.webContents.on('did-start-loading', function(){
    //     win.webContents.send('redisAlias', redisAlias);
    // });
    // Open the DevTools.
    if (isDevMode) {
        win.webContents.openDevTools();
    }
};

export default sub;