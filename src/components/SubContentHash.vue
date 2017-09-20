<template>
    <Card :bordered="false" :dis-hover="true">
        <p slot="title">KEY: {{ $route.params.key }} <Button type="primary" class="delete" size="small" @click="deleteKey($route.params.key)">删除</Button></p>
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
                        title: '键值',
                        key: 'key',
                        sortable: true,
                        width: 150,
                        fixed: 'left'
                    },
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
             * 删除Key
             */
            deleteKey(key) {
                let self = this;
                this.$Modal.confirm({
                    title: '删除提示',
                    content: '确认删除该键值吗？',
                    onOk: () => {
                        self.redis.del(key).then(function (result) {
                            if (result === 1) {
                                self.$router.push({path: '/index'});
                                self.$('.refresh-btn').click();
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
                self.key = this.$route.params.key;
                self.content = [];
                self.redis.hgetall(this.$route.params.key).then(function (result) {
                    // console.log(result);
                    if (result) {
                        for(let i in result) {//不使用过滤
                            // console.log(i,":",man[i]);
                            self.content.push({
                                key: i,
                                context: result[i]
                            })
                        } 
                    }
                    // console.log(self.content);
                }).catch(res => {
                    self.content = [];
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
                let self = this;
                this.$Modal.confirm({
                    title: '删除提示',
                    content: '确认删除该键值吗？',
                    onOk: () => {
                        self.redis.hdel(self.$route.params.key, self.content[index].key).then(function (result) {
                            console.log(result);
                            if (result === 1) {
                                self.content.splice(index, 1);
                                // alert("删除成功！");
                            }
                            // console.log(self.content);
                        }).catch(res => {
                            self.content = [];
                            alert(res);
                        });
                    }
                });
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
    .delete {
        float: right;
        display: block;
        margin-right: 5px;
        margin-top: -2px;
    }
</style>
