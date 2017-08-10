/**
 * 程序界面主入口
 *
 * @author Zhiguo.Chen
 */
'use strict';
const BrowserWindow = require('electron').remote.BrowserWindow;
const path = require('path');

const isDevMode = process.execPath.match(/[\\/]electron/);

// if (isDevMode) enableLiveReload();

let sub = {};

sub.loadNewWindow = function () {
    const modalPath = path.join('file://', __dirname, './sub_index.html');
    let win = new BrowserWindow({
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

    // Open the DevTools.
    if (isDevMode) {
        win.webContents.openDevTools();
    }
};

export default sub;