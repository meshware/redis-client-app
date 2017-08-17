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

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const isDevMode = process.execPath.match(/[\\/]electron/);

if (isDevMode) enableLiveReload();

const iconName = process.platform === 'win32' ? 'icon.ico' : 'icon.icns';
const iconPath = path.join(__dirname, './asserts/icons', iconName);
console.log(iconPath);

const createWindow = async () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        icon: iconPath,
        title: 'Redis Client Application',
        // minHeight: 566,
        // minWidth: 400,
        height: 566,
        width: 400,
        useContentSize: true,
        titleBarStyle: 'hidden-inset',
        autoHideMenuBar: true,
        frame: true,
        resizable: false,
        darkTheme: true,
        transparent: false //窗口透明
    });

    // and load the index.html of the app.
    mainWindow.loadURL(`file://${__dirname}/index.html`);

    // Open the DevTools.
    if (isDevMode) {
        await installExtension(VUEJS_DEVTOOLS);
        mainWindow.webContents.openDevTools();
    }

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    createWindow();
    menu.menuInit();
    appIcon.loadTray();
    log.info("Load main process success!");
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
    if (mainWindow === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
