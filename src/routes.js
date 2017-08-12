/**
 * 程序页面路由配置
 */
'use strict';
import Vue from 'vue/dist/vue.js';
import Router from 'vue-router/dist/vue-router.js';

Vue.use(Router);

let router = new Router({
    scrollBehavior: () => ({ y: 0 }),
    routes: [
        {
            path: '/',
            redirect: '/index'
        },
        {
            name: 'login',
            path: '/login',
            component: require('./components/Login.vue')
            // component: resolve => System.import('./components/Login.vue')
            // component: () => import('./components/Login.vue')
            // component: asyncLoader("./components/Login.vue")
            // component: view('Login')
            // component: (resolve) => { require(['./components/Login.vue'], resolve); }
            // component:  () => require('./components/Login.vue')
        },
        {
            name: 'index',
            path: '/index',
            component: require('./components/SubIndex.vue'),
            children: [
                {
                    name: 'default',
                    path: '/systemInformation',
                    component: resolve => require(['./components/landingPage/SystemInformation.vue'], resolve)
                },
                {
                    name: 'test2',
                    path: '/test2/:userId',
                    component: resolve => require(['./components/Test.vue'], resolve)
                }
            ]
        },
        {
            name: 'content',
            path: '/content/:key',
            component: require('./components/SubContent.vue')
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
});

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * @param  {string}   name     the filename (basename) of the view to load.
 */
function view(name) {
    return function (resolve) {
        require(['./components/' + name + '.vue'], resolve);
    }
}
// function view(name) {
//     return function(resolve) {
//         System.import(`./components/${name}.vue`).then(mod => {
//             resolve(mod)
//         })
//     }
// }

export default router;
