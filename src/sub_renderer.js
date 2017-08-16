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

const currentWindow = remote.getCurrentWindow();

Vue.use(iView);
// const ipc = electron.ipcRenderer;

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

// if (!rds.client) {
//     new Promise(function (resolve, reject) {
//         console.log("开始创建Redis连接！");
//         resolve(rds.connect(currentWindow.redisAlias));
//         // resolve(rds.redis);
//     }).then(function (redis) {
//         console.log(redis);
//         Vue.redis = Vue.prototype.redis = redis;
//     }).catch(function (error) {
//         console.error(error);
//     });
// } else {
//     console.log("Redis连接已存在！");
//     console.log(rds.redis);
// }

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
