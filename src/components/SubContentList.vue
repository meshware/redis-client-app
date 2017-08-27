<template>
    <Card :bordered="false" :dis-hover="true">
        <p slot="title">KEY: {{ $route.params.key }}</p>
        <p>
            <Table size="small" width="100%" border :columns="columns" :data="content"></Table>
        </p>
    </Card>
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
                columns: [
                    {
                        title: '内容',
                        key: 'context',
                        sortable: true
                        // width: 500,
                        // fixed: 'left'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.show(params.index)
                                        }
                                    }
                                }, '查看'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                content: [],
                // codemirror: null,
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
             * 获取Key对应值
             */
            doGetContent: function(){
                let self = this;
                this.key = this.$route.params.key;
                this.redis.lrange(this.$route.params.key, 0, -1).then(function (result) {
                    if (result && result.length !== 0) {
                        result.forEach(function (key) {
                            self.content.push({
                                context: key
                            })
                        })
                    }
                    console.log(self.content);
                }).catch(res => {
                    self.content = null;
                    alert(res);
                });
            },
            show (index) {
                this.$Modal.info({
                    title: '详细内容',
                    content: `${this.content[index].context}`
                })
            },
            remove (index) {
                this.content.splice(index, 1);
            }
        },
        created() {
            //获取内容
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
    @import url('codemirror/lib/codemirror.css'); 
    @import url('codemirror/mode/javascript/javascript');

</style>
