<template>
    <div id="wrapper">
        <main>
            <div class="left-side">
                <span class="title">
                    Menu {{ $route.params.userId }}
                </span>    
                <router-link :to="{ name: 'index' }">Index</router-link>
            </div>
    
            <div class="right-side">
                <div class="doc">
                    <div class="title">Getting Started</div>
                    <p>
                        Test
                    </p>
                    <br/>
                    <Button type="info" @click="createEditor">Create Editor</Button>
                    <br/>
                    <pre id="editor">TODO</pre>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
import Sockjs from 'sockjs-client';
import notify from '../common/notify';
import querystring from 'querystring';
import config from '../common/config_util';
//import '../scripts/ace/ace.js';
//import '../scripts/ace/theme-xcode.js';
//import '../scripts/ace/theme-monokai.js';
//import '../scripts/ace/mode-python.js';
//import '../scripts/ace/ext-language_tools.js';
//import '../scripts/ace/ext-statusbar.js';
//import '../scripts/ace/snippets/stocks.js';

export default {
    name: 'test',
    components: {},
    methods: {
        open(link) {
            this.$electron.shell.openExternal(link)
        },
        createEditor: function () {
//            var editor = ace.edit("editor");
//            editor.setTheme("ace/theme/xcode");
//            editor.getSession().setMode("ace/mode/python");
//            editor.setValue("123");
//            editor.setFontSize(14);
//            editor.setShowPrintMargin(false);
        },
        test: function () {
            let self = this;
            this.$axios.get(config.getServerUrl() + '/index'
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
                    if (response.data.success) {
                        self.$router.push({ path: '/index' });
                    }
                })
                .catch(function (error) {
                    console.log("error");
                    console.log(error);
                });
        }
    },
    created() {
        //            this.test();
        console.log("load test.vue!");
    }
}
</script>

<style>
    #editor {
        position: absolute;
        width: 500px;
        height: 400px;
    }
</style>
