<template>
    <div class="layout" id="app" style="-webkit-user-select: none;" ondragstart="return false;">
        <Row type="flex" style="height: 100%">
            <i-col span="5" class="layout-menu-left">
                <!--<div class="layout-logo-left"></div>-->
                <div v-bind:class="isMac ? 'topbar-mac' : 'topbar'" style="-webkit-app-region: drag;">
                    <Select class="db-select" v-model="selectedDB" size="small">
                        <Option v-for="(dbIndex, index) in dbNums" :value="index" :key="index"
                                @click.native="openSubmenu(index)">DB：{{ index }}
                        </Option>
                    </Select>
                    <Button class="refresh-btn" type="primary" shape="circle" size="small" @click="doSearchKey">
                        <Icon type="android-happy" size="18"></Icon>
                    </Button>
                    <Button class="refresh-btn" id="refreshBtn" type="primary" shape="circle" size="small"
                            @click="doSearchKey">
                        <Icon type="refresh" size="18"></Icon>
                    </Button>
                </div>
                <div v-bind:class="isMac ? 'keys-div-mac' : 'keys-div'" id="keys">
                    <Menu theme="dark" width="auto">
                        <Menu-item v-for="(key, index) in keys" :name="key.name"
                                   @click.native="showContent(key.type,key.name)"
                                   style="padding: 5px 24px 5px 15px">
                            <span class="key-type" style="">{{key.type}}</span>
                            <span class="layout-text"
                                  style="display:block; line-height:15px; margin-left:39px; white-space:nowrap;">{{key.name}}</span>
                        </Menu-item>
                    </Menu>
                </div>
                <Input class="key-filter" v-model="searchKey" icon="ios-eye" :placeholder="lang.search_notice"
                       @on-change="doSearchKey" size="small"/>
            </i-col>
            <i-col span="19" style="height: 100%">
                <div id="right-content" style="height:100%; padding-left:10px; padding-top: 2px;">
                    <div class="bd-title clearfix" style="-webkit-app-region: drag;">
                        <ul class="cont-qie clearfix">
                            <li id="contentTab" class="cur-li"><a href="javascript:;">{{lang.content}}</a></li>
                            <li><a href="javascript:;">{{lang.add_content}}</a></li>
                            <li><a href="javascript:;">{{lang.setting}}</a></li>
                            <li><a href="javascript:;">{{lang.status}}</a></li>
                        </ul>
                    </div>

                    <div class="cont-detail">
                        <div class="content-new content-new-show" style="">
                            <router-view></router-view>
                        </div>
                        <div class="content-new">
                            <insert-data-to-redis @doSearchKey="doSearchKey"></insert-data-to-redis>
                        </div>
                        <div class="content-new">
                            <Setting ref="lang"></Setting>
                        </div>
                        <div class="content-new">
                            <Status></Status>
                        </div>
                    </div>
                </div>
            </i-col>
        </Row>
    </div>
</template>

<script>
    import rds from '../common/redis';
    import router from '../routes';
    import Setting from './Setting.vue';
    import Status from './Status.vue';
    import insertDataToRedis from './InsertDataToRedis.vue'

    const ipc = require('electron').ipcRenderer;

    export default {
        name: 'sub-main',
        components: {
            Setting,
            Status,
            insertDataToRedis
        },
        data() {
            let self = this;
            return {
                isMac: require('os').platform() === 'darwin',
                dbNums: 1,
                keys: [],
                selectedDB: 0,
                searchKey: '',
                redisAlias: this.redisAlias,
                modalLoading: false,
                lang: self.i18n
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
                this.$('#contentTab').click();
                router.push({path: '/content/' + type + "/" + key});
                // console.log(key);
            },

            /**
             * 搜索Key列表
             */
            doSearchKey: function () {
                let self = this;
                this.redis.keys(self.searchKey === '' ? '*' : '*' + self.searchKey + '*').then(result => {
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
            let $ = self.$;
            console.log("mounted...");
            $(".cont-qie li").on("click", function () {
                $(this).addClass("cur-li").siblings().removeClass("cur-li");
                var index = $(this).index();
                $(".cont-detail .content-new").hide().eq(index).show();
            });

            ipc.on('createRedisConnection', (event, message) => {
                let promise = rds.connect(message);
                console.log(promise);
                promise.then(
                    function (redis) {
                        ipc.send('redisConnectionDone', 'success');
                        rds.getDBCount().then(
                            result => self.dbNums = result,
                            message => alert(message)
                        ).then(
                            self.openSubmenu(0),
                            message => alert(message)
                        ).catch(
                            error => alert(error)
                        );
                    },
                    function (s) {
                        alert(s);
                    }
                ).catch(error => {
                        console.log(error);
                        alert(error);
                    }
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

    ::-webkit-scrollbar-thumb:hover {
        background-color: #9f9f9f;
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
        /*-webkit-app-region: drag;*/
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
        margin: 13px 0px 0px 0px;
    }

    .topbar-mac {
        width: 100%;
        margin: 35px 0px 0px 0px;
    }

    .db-select {
        width: 80px;
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
        margin: -2px 5px 0 0;
        float: right;
    }

    .keys-div {
        position: absolute;
        top: 40px;
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
        background-color: #2d8cf0;
        text-align: center;
        line-height: 15px;
        border-radius: 2px;
        float: left;
        color: #fff;
    }

    .clearfix {
        display: inline-table;
        display: block;
        zoom: 1
    }

    .clearfix:after {
        clear: both;
        content: ".";
        display: block;
        height: 0;
        visibility: hidden
    }

    * {
        padding: 0;
        margin: 0;
    }

    a:hover, a:link, a:visited {
        text-decoration: none
    }

    li {
        list-style: none;
    }

    .content-new {
        position: absolute;
        left: 20px;
        top: 40px;
        right: 20px;
        bottom: 0;
        display: none;
    }

    .content-new-show {
        display: block;
    }

    .bd-title {
        font-size: 16px;
        position: absolute;
        left: 20px;
        top: 10px;
        bottom: 0;
        right: 0;
        height: 27px;
        border-bottom: 1px solid #eee;
    }

    .cont-qie {
        float: left;
    }

    .cont-qie li {
        float: left;
        margin-right: 20px;
    }

    .cont-qie li a {
        color: #5a5a5a;
    }

    .cont-qie .cur-li a {
        color: #f52f3e;
        border-bottom: 2px solid #f52f3e;
        display: block;
    }
</style>
