<template>
    <div class="layout" id="app">
        <Row type="flex" style="height: 100%">
            <i-col span="5" class="layout-menu-left">
                <!--<div class="layout-logo-left"></div>-->
                <div v-bind:class="isMac ? 'topbar-mac' : 'topbar'">
                    <Select class="db-select" v-model="selectedDB" size="small" placeholder="请选择DB...">
                        <Option v-for="(dbIndex, index) in dbNums" :value="index" :key="index"
                                @click.native="openSubmenu(index)">当前DB：{{ index }}
                        </Option>
                    </Select>
                    <Button class="refresh-btn" type="primary" shape="circle" size="small" @click="doSearchKey"><Icon type="refresh" size="20"></Icon></Button>
                </div>
                <div v-bind:class="isMac ? 'keys-div-mac' : 'keys-div'" class="" id="keys">
                    <Menu theme="dark" width="auto">
                        <Menu-item v-for="(key, index) in keys" :name="key.name" @click.native="showContent(key.type,key.name)"
                                   style="padding: 5px 24px 5px 15px">
                            <span class="key-type" style="">{{key.type}}</span> 
                            <span class="layout-text" style="display:block; line-height:15px; margin-left:39px; white-space:nowrap;">{{key.name}}</span>
                        </Menu-item>
                    </Menu>
                </div>
                <Input class="key-filter" v-model="searchKey" icon="ios-eye" placeholder="请输入查询表达式..."
                       @on-change="doSearchKey" size="small"/>
            </i-col>
            <i-col span="19" style="height: 100%">
                    <div id="right-content" style="height: 100%; padding-left:10px; padding-top: 10px">
                    <!--<div class="layout-breadcrumb">-->
                        <!--<Breadcrumb>-->
                            <!--<Breadcrumb-item href="#">DB1</Breadcrumb-item>-->
                            <!--<Breadcrumb-item>KEY1</Breadcrumb-item>-->
                        <!--</Breadcrumb>-->
                    <!--</div>-->
                    <Tabs value="content" style="-webkit-app-region: drag;">
                        <Tab-pane label="内容" name="content" icon="document-text">
                            <router-view></router-view>
                        </Tab-pane>
                        <Tab-pane label="终端" icon="ios-pulse-strong">
                            标签二的内容
                        </Tab-pane>
                        <Tab-pane label="设置" icon="gear-a">
                            标签三的内容
                        </Tab-pane>
                    </Tabs>
                <!--<div class="layout-copy">-->
                    <!--2011-2017 &copy; UUGU-->
                <!--</div>-->
                </div>
            </i-col>
        </Row>
    </div>
</template>

<script>
    import rds from '../common/redis';
    import router from '../routes';
    const ipc = require('electron').ipcRenderer;

    export default {
        // name: 'RedisClient-client',
        data() {
            return {
                isMac: require('os').platform() === 'darwin',
                dbNums: 1,
                keys: [],
                selectedDB: 0,
                searchKey: '',
                redisAlias: this.redisAlias
            }
        },
        computed: {
            typeIcon: function (type) {
                return "<Icon type=\"document-text\"></Icon>"
            }
        },
        methods: {
            open(link) {
                this.$electron.shell.openExternal(link)
            },

            /**
             * 选择数据库并显示Keys
             */
            openSubmenu: function (dbIndex) {
                let self = this;
                // console.log(this.redis);
                this.redis.select(dbIndex).then(resolve => {
                    if (resolve !== 'OK') {
                        throw new Error('连接DB' + dbIndex + "失败！");
                    }
                    self.selectedDB = dbIndex;
                    self.doSearchKey();

                }).catch(error => {
                    console.log(error);
                    alert(error);
                });
            },

            /**
             * 显示子内容页
             */
            showContent: function (type, key) {
                router.push({path: '/content/'+ type + "/" + key});
                // console.log(key);
            },

            /**
             * 搜索Key列表
             */
            doSearchKey: function () {
                let self = this;
                this.redis.keys(self.searchKey === '' ? '*' : self.searchKey).then(result => {
                    // console.log(res);
                    // console.log(result);
                    self.keys = []; //先清空历史数据
                    if (result && result.length !== 0) {
                        result.forEach(function (key) {
                            self.redis.type(key).then(res => {
//                                console.log(res);
                                self.keys.push({
                                    name: key,
                                    type: res
                                })
                            });
                        })
                    }
                });
            }
        },
        created() {
            router.push({path: '/index'});
            console.log("created...");
        },
        mounted: function () {
            let self = this;
            console.log("mounted...");
            ipc.on('createRedisConnection', (event, message) => {
                rds.connect(message);
                rds.getDBCount().then(result => this.dbNums = result).then(
                    self.openSubmenu(0)
                );
            })
        }
    }
</script>

<style scoped>
    @import url('./asserts/css/iview.css');

    ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
        background-color: transparent;
    }

    ::-webkit-scrollbar-track {
        width: 10px;
        /*border: 0 solid black;*/
        border-color: transparent;
        background-color: transparent;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #373e50;
    }

    ::-webkit-scrollbar-thumb:hover{
        background-color:#9f9f9f;
    }

    ::-webkit-scrollbar-corner {
        background-color: transparent;
    }

    .layout {
        height: 100%;
        /*border: 1px solid #d7dde4;*/
        /*background: #f5f7f9;*/
        position: relative;
    }

    .layout-breadcrumb {
        padding: 10px 15px 0;
    }

    .layout-content {
        height: auto;
        min-height: 80%;
        margin: 15px;
        overflow: hidden;
        background: #fff;
        border-radius: 4px;
    }

    .layout-content-main {
        padding: 10px;
    }

    .layout-copy {
        text-align: center;
        padding: 10px 0 10px;
        color: #9ea7b4;
    }

    .layout-menu-left {
        -webkit-app-region: drag;
        height: auto;
        background: #464c5b;
    }

    .layout-header {
        height: 30px;
        background: #fff;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
    }

    .layout-logo-left {
        width: 90%;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        margin: 35px 25px 5px 15px;
    }

    .topbar {
        width: 100%;
        margin: 5px 0px 0px 0px;
    }

    .topbar-mac {
        width: 100%;
        margin: 35px 0px 0px 0px;
    }

    .db-select {
        width: 70%;
        /*height: 30px;*/
        background: transparent;
        /*background-color: transparent;*/
        border-radius: 3px;
        margin: 0px 5px 10px 15px;
        float: left;
    }

    .refresh-btn {
        -webkit-app-region: drag;
        /*height: 30px;*/
        background: transparent;
        border-color: transparent;
        /*border-radius: 3px;*/
        margin: 0px 5px 10px 5px;
        float: right;
    }

    .keys-div {
        position: absolute;
        top: 32px;
        bottom: 42px;
        /*height: auto;*/
        /*height: 100%;*/
        width: 100%;
        overflow: auto;
        /*background-color: #5b6270;*/
    }

    .keys-div-mac {
        position: absolute;
        top: 62px;
        bottom: 42px;
        /*height: auto;*/
        /*height: 100%;*/
        width: 100%;
        overflow: auto;
        /*background-color: #5b6270;*/
    }

    .key-filter {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 90%;
        height: 25px;
        background: transparent;
        /*background-color: transparent;*/
        border-radius: 3px;
        margin: 5px 25px 10px 15px;
        float: left;
    }

    .key-type {
        display: block;
        height: 15px;
        width: 36px;
        background-color: #9f9f9f;
        text-align: center;
        line-height:15px;
        border-radius: 2px;
        float: left;
    }
</style>
