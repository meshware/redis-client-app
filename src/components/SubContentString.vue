<template>
    <Card :bordered="false" :dis-hover="true" style="hight: 100px">
        <p slot="title">KEY: {{ $route.params.key }}</p>
        <p>
            <Input v-model="content" type="textarea" :autosize="true" placeholder="请输入..."></Input>
        </p>
    </Card>
    <!-- <div id="stringContent">{{content}}</div> -->
    <!-- <div class="codemirror">
        <codemirror v-model="content" :options="editorOption"></codemirror>
    </div> -->
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
            return {
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
            handleTabRemove (name) {
                this['tab' + name] = false;
            },
            toggleClick () {
                if (this.spanLeft === 5) {
                    this.spanLeft = 2;
                    this.spanRight = 22;
                } else {
                    this.spanLeft = 5;
                    this.spanRight = 19;
                }
            },
            /**
             * 获取Key对应值
             */
            doGetContent: function(){
                let self = this;
                this.key = this.$route.params.key;
                this.redis.get(this.$route.params.key).then(function (result) {
                    self.content = result;
                    console.log(result);
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

</style>
