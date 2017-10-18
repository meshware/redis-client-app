import {app, Tray, ipcMain, Menu, dialog, shell} from 'electron';
import path from 'path';

let appIcon = {};

appIcon.loadTray = function (main) {
    const iconName = process.platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png';
    const iconPath = path.join(__dirname, '../asserts/icons', iconName);
    appIcon = new Tray(iconPath);
    let menu = [];

    if (process.platform === 'darwin') {
        menu.push({
            label: 'Show/Hide Dock',
            type: 'normal',
            // accelerator: 'CommandOrControl+D',
            click: () => {
                let is_dock_visible = app.dock.isVisible();
                if (is_dock_visible) {
                    app.dock.hide();
                } else {
                    app.dock.show();
                }
            }
        })
    }

    menu = menu.concat([
        {
            label: 'Feedback',
            type: 'normal',
            click: () => {
            shell.openExternal('https://github.com/UUGU/redis-client-app/issues');
        }
        },
        {
            type: 'separator'
        },
        {
            label: 'Open',
            type: 'normal',
            // accelerator: 'CommandOrControl+O',
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
    const contextMenu = Menu.buildFromTemplate(menu);
    appIcon.setToolTip('Redis Client');
    appIcon.setContextMenu(contextMenu);
};

export default appIcon;
