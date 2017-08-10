import {app, Tray, ipcMain, Menu, dialog} from 'electron';
import path from 'path';

let appIcon = {};

appIcon.loadTray = function (event) {
    const iconName = process.platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png';
    const iconPath = path.join(__dirname, '../asserts/icons', iconName);
    appIcon = new Tray(iconPath);
    const contextMenu = Menu.buildFromTemplate([
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
        },
        {
            label: '其他',
            type: 'normal',
            // accelerator: 'CommandOrControl+Q',
            click: function () {
                const options = {
                    type: 'info',
                    title: '其他事件提醒',
                    message: "确认要XXXX吗?",
                    buttons: ['是', '否']
                };
                dialog.showMessageBox(options, function (index) {
                    if (index === 0) {
                        // app.quit();
                        alert("Do something!");
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

// ipcMain.on('remove-tray', function () {
//     console.log("Invoked remove tray...");
//     if (process.platform !== 'darwin') {
//         appIcon.destroy();
//         app.quit();
//     } else {
//         // notify("自个去任务栏退出APP！");
//         console.log("自个去任务栏退出APP！");
//     }
// });

export default appIcon;
