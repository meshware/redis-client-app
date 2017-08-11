<template>
    <div class="layout" id="app">
        <Row type="flex" style="height: 100%">
            <i-col class="layout-menu-left">
                <div class="layout-logo-left"><p style="text-align: center">Redis Client App</p></div>
                <div class="groups-div" id="keys">
                    <Menu active-name="1-2" theme="dark" width="auto" :open-names="['1']">
                        <!--<Button-group style="margin: 5px 15px 5px 20px">-->
                        <!--<Button type="ghost" icon="android-cloud-done"></Button>-->
                        <!--<Button type="ghost" icon="ios-sunny-outline"></Button>-->
                        <!--<Button type="ghost" icon="ios-crop"></Button>-->
                        <!--<Button type="ghost" icon="ios-color-filter-outline"></Button>-->
                        <!--</Button-group>-->
                        <Submenu name="1">
                            <template slot="title">
                                <Icon type="ios-navigate"></Icon>
                                GROUP1
                            </template>
                            <Menu-item name="1-1" @click.native="showSubWindows('localredis')">
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
                        <Submenu name="2">
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
                    <Select v-model="select3" slot="prepend" style="width: 80px">
                        <Option value="day">日活</Option>
                        <Option value="month">月活</Option>
                    </Select>
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

    export default {
        // name: 'redis-client',
        methods: {
            open(link) {
                this.$electron.shell.openExternal(link)
            },
            showSubWindows: function (redisAlias) {
                subMain.loadNewWindow(redisAlias);
            }
        }
    }
</script>

<style scoped>
    @import url('./asserts/css/iview.css');

    ::-webkit-scrollbar-track {
        border: 0px solid black;
        background-color: #464c5b;
    }

    ::-webkit-scrollbar {
        width: 10px;
        background-color: #464c5b;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #373e50;
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
        height: auto;
        width: 100%;
        background: #464c5b;
    }

    .layout-header {
        height: 30px;
        background: #fff;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
    }

    .layout-logo-left {
        -webkit-app-region: drag;
        width: 90%;
        height: 30px;
        /*background: #5b6270;*/
        border-radius: 3px;
        margin: 5px 15px 0px 15px;
        font-size: 16px;
        text-align: center;
        color: #000000;
    }

    .groups-div {
        position: absolute;
        top: 52px;
        bottom: 50px;
        /*height: auto;*/
        /*height: 100%;*/
        width: 100%;
        overflow: auto;
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
