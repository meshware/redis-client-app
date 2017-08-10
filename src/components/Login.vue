<template>
    <div id="wrapper">
        <main>
            <div class="right-side">
                <div class="doc">
                    <h2>Login</h2>
                        用户名：<input v-model="username" name="username" value="" placeholder="Username"/>
                        <br>
                        密  码：<input type="password" v-model="password" name="password" placeholder="Password"/>
                    <br>
                    <button type="button" id="login" value="Login" @click="doLogin()">登录</button>
                </div>
                <router-link :to="{ name: 'index' }">Index</router-link>
            </div>
        </main>
    </div>
</template>

<script>
    import config from '../common/config_util';
//    import axios from 'axios';
//    import $ from "jquery";
    import querystring from 'querystring';

    //    $(document).ready(function(){
    //        $("#login").click(function(){
    //            login.doLogin();
    //        });
    //    });

    export default {
        name: 'login',
        components: {},
        data() {
            return {
                username: '',
                password: ''
            }
        },
        methods: {
            /**
             * 打开新窗口
             */
            open(link) {
                this.$electron.shell.openExternal(link)
            },

            /**
             * 登录事件
             */
            doLogin: function () {
                let self = this;
                this.$axios.post(config.getServerUrl() + '/doLogin',
                    querystring.stringify({
                    username: this.username,
                    password: this.password
                    })
//                    {
//                        headers: {
//                            "Content-Type": "application/json;charset=utf-8"
//                        },
//                        withCredentials: true
//                    }
                    )
                    .then(function (response) {
                        console.log(response);
                        console.log(self);
                        if(response.data.success) {
                            config.configFile.token = response.data.token;
                            config.saveConfigFile(config.configFile);
                            self.$router.push({path: '/index'});
                        }
                    })
                    .catch(function (error) {
                        console.log("error");
                        console.log(error);
                    });
            }
        },
        created() {
            console.log("Login.vue has created!");
        }
    }
</script>

<style>
    @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    body {
        font-family: 'Source Sans Pro', sans-serif;
    }

    #wrapper {
        background: radial-gradient(
                ellipse at top left,
                rgba(255, 255, 255, 1) 40%,
                rgba(229, 229, 229, .9) 100%
        );
        height: 100vh;
        padding: 60px 80px;
        width: 100vw;
    }

    #logo {
        height: auto;
        margin-bottom: 20px;
        width: 420px;
    }

    main {
        display: flex;
        justify-content: space-between;
    }

    main > div {
        flex-basis: 50%;
    }

    .left-side {
        display: flex;
        flex-direction: column;
    }

    .welcome {
        color: #555;
        font-size: 23px;
        margin-bottom: 10px;
    }

    .title {
        color: #2c3e50;
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 6px;
    }

    .title.alt {
        font-size: 18px;
        margin-bottom: 10px;
    }

    .doc p {
        color: black;
        margin-bottom: 10px;
    }
</style>
