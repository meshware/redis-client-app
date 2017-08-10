/**
 * 命令执行器
 *
 * @author Zhiguo.Chen
 */
"use strict";
import sysProcess from 'child_process';

let executor = {};

executor.run = function (command) {
    if (command) {
        sysProcess.exec(command, function (err, stdout, stderr) {
            if (err) {
                console.log(stderr);
            } else {
                // var data = JSON.parse(stdout);
                console.log(stdout);
            }
        });
    } else {
        console.log("未输入正确命令！");
    }
};

executor.runFile = function (filePath) {
    if (filePath) {
        sysProcess.execFile(filePath, null, {cwd: '/export'},
            function (error, stdout, stderr) {
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
    } else {
        console.log("未输入正确命令！");
    }
};

export default executor;