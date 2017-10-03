<template>
    <div style="">
        <div class="quyu clearfix">
            <div class="q-left">KEY: {{ $route.params.key }}</div>
            <Button type="error" class="delete" size="small" @click="deleteKey($route.params.key)">删除</Button>
            <!-- <a href="javascript:;" class="delete" @click="deleteKey($route.params.key)">删除</a> -->
        </div>
        <div class="text-area">
            <Table size="small" width="100%" border :columns="columns" :data="content"></Table>
        </div>
    </div>
</template>

<script>
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
                                }, '查看')
                                // h('Button', {
                                //     props: {
                                //         type: 'error',
                                //         size: 'small'
                                //     },
                                //     on: {
                                //         click: () => {
                                //             this.remove(params.index)
                                //         }
                                //     }
                                // }, '删除')
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
                self.key = this.$route.params.key;
                self.content = [];
                self.redis.smembers(this.$route.params.key).then(function (result) {
                    if (result && result.length !== 0) {
                        result.forEach(function (key) {
                            self.content.push({
                                context: key
                            })
                        })
                    }
                    console.log(self.content);
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
    .quyu {
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
        margin-right: 10px;
        margin-top: -7px;
    }

    .text-area {
        position: absolute;
        left: 0;
        top: 45px;
        /* right: 0; */
        bottom: 10px;
        overflow-y: auto;
    }
</style>
