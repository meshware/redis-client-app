/**
 * 程序界面主入口
 *
 * @author Zhiguo.Chen
 */
'use strict';
import Vue from 'vue/dist/vue.js';
import axios from 'axios';
import jquery from 'jquery';
import {remote, ipcRenderer} from 'electron';
import App from './components/SubMain.vue';
import router from './routes';

import iView from 'iview';
// import 'iview/dist/styles/iview.css';    // 使用 CSS

const currentWindow = remote.getCurrentWindow();

//  pIndex = getQueryUrlString('index');
// ipcRenderer.on('dataJsonPort', function(event, message) { // 监听父页面定义的端口
//     console.log(message);
// });
Vue.use(iView);
// const ipc = electron.ipcRenderer;

// ipc.send('put-in-tray');

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));

axios.defaults.withCredentials = true;
Vue.axios = Vue.prototype.$axios = axios;
Vue.$ = Vue.prototype.$ = jquery;
Vue.config.productionTip = false;

//拦截器
axios.interceptors.response.use((response) => {
    return response;
}, (error) => {
    console.log(error);
    if (error.response && error.response.status == 401) {
        router.push({path: '/login'});
    }
});

// console.log(currentWindow);
// console.log(currentWindow.redisAlias);
// ipcRenderer.on('redisAlias', function (event, arg) {
//     const message = `Asynchronous message reply: ${arg}`;
//     console.log(message);
//     Vue.redisAlias = Vue.prototype.redisAlias = arg;
// });

/* eslint-disable no-new */
new Vue({
    components: {App},
    router,
    template: '<App/>'
}).$mount('#app');

// const app = new Vue({
//     router,
//     render: h => h(App)
// }).$mount('#app');
