<template>
    <div class="layout" id="app">
        <Row type="flex" style="height: 100%">
            <i-col class="layout-menu-left">
                <div v-if="showTitle" class="layout-logo"><p style="text-align: center">Redis Client App {{platform}}</p></div>
                <div class="menu-group">
                    <Button-group size="small">
                        <Button type="primary"><Icon type="ios-plus-outline"></Icon> 添加</Button>
                        <Button type="primary"><Icon type="ios-plus-outline"></Icon> 前进</Button>
                        <!--<Button type="primary" icon="ios-skipforward"></Button>-->
                        <!--<Button type="primary" icon="ios-skipforward"></Button>-->
                        <!--<Button type="primary" icon="ios-skipforward"></Button>-->
                    </Button-group>
                </div>
                <div v-bind:class = "showTitle ? 'groups-div-mac' : 'groups-div-other'" id="keys">
                    <Menu theme="dark" width="auto" :open-names="['1']">
                        <!--<Button-group style="margin: 5px 15px 5px 20px">-->
                        <!--<Button type="ghost" icon="android-cloud-done"></Button>-->
                        <!--<Button type="ghost" icon="ios-sunny-outline"></Button>-->
                        <!--<Button type="ghost" icon="ios-crop"></Button>-->
                        <!--<Button type="ghost" icon="ios-color-filter-outline"></Button>-->
                        <!--</Button-group>-->
                        <Submenu name="1">
                            <template slot="title" style="padding: 10px 24px">
                                <Icon type="ios-navigate"></Icon>
                                GROUP1
                            </template>
                            <Menu-item name="1-1" @dblclick.native="showSubWindows('localredis')">
                                <Icon type="ios-checkmark"></Icon>
                                LINK1
                            </Menu-item>
                            <Menu-item name="1-2">
                                <Icon type="ios-close"></Icon>
                                LINK2
                            </Menu-item>
                            <Menu-item name="1-3">
                                <Icon type="ios-close"></Icon>
                                LINK3
                            </Menu-item>
                        </Submenu>
                        <Submenu name="2" v-for="dbGourp">
                            <template slot="title">
                                <Icon type="ios-keypad"></Icon>
                                GROUP2
                            </template>
                            <Menu-item name="2-1">DB1</Menu-item>
                            <Menu-item name="2-2">DB2</Menu-item>
                        </Submenu>
                        <Submenu name="3">
                            <template slot="title">
                                <Icon type="ios-analytics"></Icon>
                                GROUP3
                            </template>
                            <Menu-item name="3-1">DB1</Menu-item>
                            <Menu-item name="3-2">DB2</Menu-item>
                        </Submenu>
                    </Menu>
                </div>
                <div class="search-div">
                    <Input class="search-box" v-model="value13">
                    <!--<Select v-model="select3" slot="prepend" style="width: 80px">-->
                        <!--<Option value="day">日活</Option>-->
                        <!--<Option value="month">月活</Option>-->
                    <!--</Select>-->
                    <Button slot="append" icon="ios-search"></Button>
                    </Input>
                </div>
            </i-col>
            <!--<i-col span="19" style="height: 100%">-->
            <!--<router-view></router-view>-->
            <!--</i-col>-->
        </Row>
    </div>
</template>

<script>
    import subMain from './sub_main';
    import config from './common/config_util';

    export default {
        name: 'redis-client',
        data() {
            return {
                showTitle: require('os').platform() === 'darwin',
                dbGroups: []
            }
        },
        methods: {
            open(link) {
                this.$electron.shell.openExternal(link)
            },
            showSubWindows: function (redisAlias) {
                subMain.loadNewWindow(redisAlias);
            }
        },
        mounted:function(){
            let self = this;
            self.dbGroups = config.getDBGroups();
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
        -webkit-user-select: none;
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
        height: auto;
        width: 100%;
        background: #464c5b;
    }

    .layout-header {
        height: 30px;
        background: #fff;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
    }

    .layout-logo {
        -webkit-app-region: drag;
        width: 100%;
        height: 40px;
        background: #205080;
        /*border-radius: 3px;*/
        margin: 0;
        font-size: 16px;
        text-align: center;
        color: #000000;
    }

    .groups-div-mac {
        position: absolute;
        top: 75px;
        bottom: 50px;
        /*height: auto;*/
        /*height: 100%;*/
        width: 100%;
        overflow: auto;
    }

    .groups-div-other {
        position: absolute;
        top: 50px;
        bottom: 50px;
        /*height: auto;*/
        /*height: 100%;*/
        width: 100%;
        overflow: auto;
    }

    .menu-group {
        margin: 5px 24px 5px 24px;

    }

    .search-div {
        position: absolute;
        left: 20px;
        bottom: 15px;
        width: 90%;
    }

    .search-box {
        background-color: #5b6270;
    }
</style>
