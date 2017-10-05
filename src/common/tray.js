import {app, Tray, ipcMain, Menu, dialog} from 'electron';
import path from 'path';

let appIcon = {};

appIcon.loadTray = function (main) {
    const iconName = process.platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png';
    const iconPath = path.join(__dirname, '../asserts/icons', iconName);
    appIcon = new Tray(iconPath);
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '打开',
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
            label: '退出',
            type: 'normal',
            accelerator: 'CommandOrControl+Q',
            click: function () {
                const options = {
                    type: 'info',
                    title: '退出系统',
                    message: "确认要退出量化平台客户端吗?",
                    buttons: ['是', '否']
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
