/**
 * 函数库界面
 *
 * @author Zhiguo.Chen
 */
'use strict';
const BrowserWindow = require('electron').remote.BrowserWindow;
const path = require('path');
const ipc = require('electron').remote.ipcMain;

const isDevMode = process.execPath.match(/[\\/]electron/);

// if (isDevMode) enableLiveReload();

const iconName = process.platform === 'win32' ? 'icon.ico' : 'icon.icns';
const iconPath = path.join(__dirname, './asserts/icons', iconName);

let addWindow = {};

console.log(__dirname);
addWindow.loadNewWindow = function () {
    const modalPath = path.join('file://', __dirname, '../../components/addDB/addDB.html');
    let win = new BrowserWindow({
        icon: iconPath,
        title: '增加数据库连接',
        minHeight: 500,
        minWidth: 500,
        height: 500,
        width: 666,
        useContentSize: true,
        // titleBarStyle: 'hidden-inset',
        autoHideMenuBar: true,
        frame: true,
        darkTheme: true,
        transparent: false //窗口透明
    });

    win.on('close', function () { win = null });
    win.loadURL(modalPath);
    win.show();

    //页面加载完成后，发送事件
    // win.webContents.on('did-finish-load', function () {
    //     win.webContents.send('transferData', {strategyId: strategyId, strategyVersionId: strategyVersionId});
    // });

    // Open the DevTools.
    if (isDevMode) {
        win.webContents.openDevTools();
    }
};

export default addWindow;