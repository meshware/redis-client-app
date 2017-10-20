<template>
    <!--<div class="content">-->
        <!--<Row style="margin-outside: 1px">-->
            <!--<Col span="2"><p style="text-align: center; font-size: 16px">Key:</p></Col>-->
            <!--<Col span="20"><p style="text-align: left; font-size: 16px">{{ $route.params.key }}</p></Col>-->
            <!--<Col span="2"><Button type="dashed" size="small" @click="deleteKey($route.params.key)">删除</Button></Col>-->
        <!--</Row>-->
        <!--<div style="height: 100%; top: 20px; bottom: 10px; width: 100%; padding: 0 10px 0 0;">-->
            <!--<Input v-model="content" type="textarea" :autosize="false" placeholder="请输入..."></Input>-->
        <!--</div>-->
    <!--</div>-->
    <!-- <div id="stringContent">{{content}}</div> -->
    <!-- <div class="codemirror">
        <codemirror v-model="content" :options="editorOption"></codemirror>
    </div> -->
    <div style="">
        <div class="quyu clearfix">
            <div class="q-left">KEY: {{ $route.params.key }}</div>
            <Button type="error" class="delete" size="small" @click="deleteKey($route.params.key)">{{lang.delete}}</Button>
            <!-- <a href="javascript:;" class="delete" @click="deleteKey($route.params.key)">删除</a> -->
        </div>
        <div class="text-area">
            <textarea v-model="content"></textarea>
        </div>
    </div>
</template>

<script>
    // import CodeMirror from 'codemirror/lib/codemirror';
    // import { codemirror } from 'vue-codemirror';
    // import SystemInformation from './landingPage/SystemInformation'

    // import executor from '../common/executor';

//    executor.run("ls /");

    export default {
        name: 'landing-page',
        components: {},
        data () {
            let self = this;
            return {
                lang: self.i18n,
                type: this.$route.params.type,
                key: this.$route.params.key,
                content: null,
                // codemirror: null,
                editorOption: {
                    tabSize: 4,
                    styleActiveLine: false,
                    lineNumbers: false,
                    line: true,
                    foldGutter: true,
                    styleSelectedText: true,
                    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                    highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
                    mode: 'text/javascript',
                    // hint.js options
                    hintOptions:{
                        // 当匹配只有一项的时候是否自动补全
                        completeSingle: false
                    },
                    //快捷键 可提供三种模式 sublime、emacs、vim
                    keyMap: "sublime",
                    matchBrackets: true,
                    showCursorWhenSelecting: true,
                    theme: "monokai",
                    extraKeys: { "Ctrl": "autocomplete" }
                },
                spanLeft: 5,
                spanRight: 19,
                tab0: true,
                tab1: true,
                tab2: true
            }
        },
        computed: {
            iconSize () {
                return this.spanLeft === 5 ? 14 : 24;
            }
        },
        methods: {
            open(link) {
                this.$electron.shell.openExternal(link)
            },
            /**
             * 删除Key
             */
            deleteKey(key) {
                let self = this;
                this.$Modal.confirm({
                    title: this.lang.delete,
                    content: this.lang.delete_notice,
                    okText: this.lang.ok,
                    cancelText: this.lang.cancel,
                    scrollable: true,
                    onOk: () => {
                        self.redis.del(key).then(function (result) {
                            if (result === 1) {
                                self.$router.push({path: '/index'});
                                self.$('#refreshBtn').click();
                            }
                        }).catch(res => {
                            self.content = [];
                            alert(res);
                        });
                    }
                });
            },
            /**
             * 获取Key对应值
             */
            doGetContent: function(){
                let self = this;
                this.key = this.$route.params.key;
                this.redis.get(this.$route.params.key).then(function (result) {
                    self.content = result;
                }).catch(res => {
                    self.content = null;
                    alert(res);
                });
            }
        },
        created() {
            
            this.doGetContent();
        },
        watch: {
            // 如果路由有变化，会再次执行该方法
            '$route': 'doGetContent'
        },
        mounted:function(){
            let self = this;
            // self.codemirror = CodeMirror('stringContent', {
            //     mode: 'javascript',
            //     lineNumbers: true
            //     })
        }
    }
</script>

<style scoped>
    /* @import url('codemirror/lib/codemirror.css');  */
    /* @import url('codemirror/mode/javascript/javascript'); */
    .content {
        overflow-y: auto;
        position: absolute;
        width: 100%;
        top: 10px;
        right: 10px;
        bottom: 10px;
        left: 10px;
        height: 100%;
    }

    .quyu {
        /*height: 20px;*/
        /* line-height: 30px; */
        /*color: #5e5e5e;*/
        /*font-size: 16px;*/
        /*font-family: "Microsoft Yahei";*/
        padding: 13px 0 23px 0;
        border-bottom:1px solid #e9eaec;
        line-height: 1;
    }

    .content-new .q-left {
        float: left;
        font-size: 14px;
        color: #1c2438;
        font-weight: 700;
        overflow: hidden;
    }

    .content-new .delete {
        float: right;
        display: block;
        /* width: 40px;
        height: 30px;
        font-size: 14px;
        border: 1px dashed #ddd;
        text-align: center; */
        margin-right: 10px;
        margin-top: -7px;
        /* color: #5a5a5a;
        line-height: 30px;
        border-radius: 2px; */
    }

    .text-area {
        position: absolute;
        left: 0;
        top: 45px;
        right: 0;
        bottom: 10px;
        /* background: #000; */
    }

    textarea {
        resize: none;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        /*text-indent: 10px;*/
        line-height: 24px;
        color: #5e5e5e;
        font-size: 14px;
        width: 100%;
        overflow-y: auto;
    }
</style>
