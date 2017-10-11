import {app, Tray, ipcMain, Menu, dialog} from 'electron';
import path from 'path';

let appIcon = {};

appIcon.loadTray = function (main) {
    const iconName = process.platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png';
    const iconPath = path.join(__dirname, '../asserts/icons', iconName);
    appIcon = new Tray(iconPath);
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Open',
            type: 'normal',
            // accelerator: 'CommandOrControl+Q',
            click: function () {
                if (main.mainWindow === null) {
                    main.createWindow();
                } else {
                    main.mainWindow.focus();
                }
            }
        },
        {
            label: 'Exit',
            type: 'normal',
            accelerator: 'CommandOrControl+Q',
            click: function () {
                const options = {
                    type: 'info',
                    title: 'Exit',
                    message: "Are you sure to exit?",
                    buttons: ['Yes', 'No']
                };
                dialog.showMessageBox(options, function (index) {
                    if (index === 0) {
                        app.quit();
                    }
                });
                // if (process.platform !== 'darwin') {
                //     // appIcon.destroy();
                //     app.quit();
                // } else {
                //     // notify("自个去任务栏退出APP！");
                //     console.log("自个去任务栏退出APP！");
                // }
                // event.sender.send('remove-tray');
            }
        }
    ]);
    appIcon.setToolTip('Redis Client');
    appIcon.setContextMenu(contextMenu);
};

export default appIcon;
