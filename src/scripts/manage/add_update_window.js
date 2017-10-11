/**
 * 编辑数据库链接界面
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

let updateWindow = {};

console.log(__dirname);
updateWindow.loadNewWindow = function (configFile) {
    const modalPath = path.join('file://', __dirname, '../../components/addDB/addDB.html');
    let win = new BrowserWindow({
        icon: iconPath,
        title: '',
        minHeight: 300,
        minWidth: 300,
        height: 300,
        width: 300,
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
    if (configFile) {
        win.webContents.on('did-finish-load', function () {
            win.webContents.send('transferData', configFile);
        });
    }

    // Open the DevTools.
    if (isDevMode) {
        win.webContents.openDevTools();
    }
};

export default updateWindow;