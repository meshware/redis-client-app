/**
 * 程序主入口
 */
import { app, BrowserWindow, ipcMain } from 'electron';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import { enableLiveReload } from 'electron-compile';
import path from 'path';
import menu from './common/menu';
import appIcon from './common/tray';
import log from './common/logger';

// const pref = require('./server/pref');
let user_language = (app.getLocale() || '').split('-')[0].toLowerCase() || 'en';
global.user_language = user_language;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let main = {};

const isDevMode = process.execPath.match(/[\\/]electron/);

if (isDevMode) enableLiveReload();

const iconName = process.platform === 'darwin' ? 'icon.icns' : 'icon.ico';
const iconPath = path.join(__dirname, './asserts/icons', iconName);
console.log(iconPath);

main.createWindow = async () => {
    // Create the browser window.
    main.mainWindow = new BrowserWindow({
        icon: iconPath,
        title: 'Redis Client Application',
        // minHeight: 566,
        // minWidth: 400,
        height: 566,
        width: 400,
        // maximizable: false,
        fullscreenable: false,
        skipTaskbar: true,
        useContentSize: true,
        titleBarStyle: 'hidden-inset',
        autoHideMenuBar: true,
        frame: true,
        resizable: false,
        darkTheme: true,
        transparent: false //窗口透明
    });

    // and load the index.html of the app.
    main.mainWindow.loadURL(`file://${__dirname}/index.html`);

    // Open the DevTools.
    if (isDevMode) {
        await installExtension(VUEJS_DEVTOOLS);
        main.mainWindow.webContents.openDevTools();
    }

    // Emitted when the window is closed.
    main.mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        main.mainWindow = null;
    });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    main.createWindow();
    menu.menuInit();
    appIcon.loadTray(main);
    log.info("Load main process success! Current system language type:" + user_language);
    // Promise.race(menu.menuInit, appIcon.loadTray).then(function (message) {
    //     log.info("Load main process success!");
    // }).catch(function (exception) {
    //     log.info(exception);
    // });
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (main.mainWindow === null) {
        main.createWindow();
    }
});

// relaunch
ipcMain.on('relaunch', () => {
    app.relaunch({args: process.argv.slice(1) + ['--relaunch']});
    app.exit(0)
});