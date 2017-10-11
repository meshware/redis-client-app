<template>
    <div class="layout" id="app">
        <Row type="flex" style="height: 100%">
            <i-col class="layout-menu-left">
                <div v-if="showTitle" class="layout-logo">
                    <img style="margin-top: 7px;" src="asserts/icons/logo.png"/>
                    <!--<p style="text-align: center; padding-top: 6px; color: #ffffff">Redis Client</p>-->
                </div>
                <div class="menu-group">
                    <Button-group size="small">
                        <Button type="primary" @click="addNewDB"><Icon type="ios-plus"></Icon> {{lang.add}}</Button>
                        <Button type="primary" @click="updateDB"><Icon type="edit"></Icon> {{lang.edit}}</Button>
                        <Button type="primary" @click="delDBModel = true"><Icon type="trash-a"></Icon> {{lang.delete}}</Button>
                    </Button-group>
                    <Dropdown trigger="click" placement="bottom-end" style="margin-left: 170px; vertical-align: middle;">
                        <a href="javascript:void(0)">
                            <Icon type="settings" size="18"></Icon>
                        </a>
                        <Dropdown-menu slot="list">
                            <!--<Dropdown-item>其他</Dropdown-item>-->
                            <Dropdown placement="left-start">
                                <Dropdown-item>
                                    {{lang.theme}}
                                    <Icon type="ios-arrow-right"></Icon>
                                </Dropdown-item>
                                <Dropdown-menu slot="list">
                                    <Dropdown-item name='light' @click.native="themeType = 'light'">{{lang.white}}</Dropdown-item>
                                    <Dropdown-item name='dark' @click.native="themeType = 'dark'">{{lang.black}}</Dropdown-item>
                                </Dropdown-menu>
                            </Dropdown>
                            <Dropdown placement="left-start">
                                <Dropdown-item>
                                    {{lang.language}}
                                    <Icon type="ios-arrow-right"></Icon>
                                </Dropdown-item>
                                <Dropdown-menu slot="list">
                                    <Dropdown-item name='cn' @click.native="changeLanguage('cn')">中文</Dropdown-item>
                                    <Dropdown-item name='en' @click.native="changeLanguage('en')">English</Dropdown-item>
                                </Dropdown-menu>
                            </Dropdown>
                        </Dropdown-menu>
                    </Dropdown>
                </div>
                <div v-bind:class = "showTitle ? 'groups-div-mac' : 'groups-div-other'" id="keys">
                    <!-- <Menu :theme="themeType" active-name="1" width="auto">
                        <Menu-group title="===数据库连接列表===">
                            <Menu-item name="1" @dblclick.native="showSubWindows('localredis')">
                                <Icon type="document-text"></Icon>
                                连接1
                            </Menu-item>
                        </Menu-group>
                    </Menu> -->
                    <Menu :theme="themeType" width="auto">
                        <MenuItem :name="index" v-for="(dbConfig, index) in dbGroups" @click.native="chooseDB(index)" @dblclick.native="showSubWindows(dbConfig.alias)">
                            <Icon type="ios-navigate" :size="iconSize"></Icon>
                            <span class="layout-text">{{dbConfig.alias}}</span>
                        </MenuItem>
                    </Menu>
                </div>
                <div class="search-div">
                    <Input class="search-box" v-model="filterKey">
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
        <Modal v-model="delDBModel" title="custom" width="300">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>{{lang.delete_notice}}</span>
            </p>
            <div style="text-align:center">
                <p>{{lang.delete_db_notice1}}</p>
                <p>{{lang.delete_db_notice2}}</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="modal_loading" @click="doDeleteDB">{{lang.delete}}</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import AddDB from './components/addDB/AddDB.vue'
    import subMain from './sub_main';
    import config from './common/config_util';
    import addUpdateWindow from './scripts/manage/add_update_window';
    import i18n from './common/i18n';

    const dialog = require('electron').remote.dialog;
    const ipc = require('electron').remote.ipcMain;

    export default {
        name: 'redis-client',
        components: {},
        data() {
            return {
                iconSize: 15,
                showTitle: require('os').platform() === 'darwin',
                themeType: 'dark',
                dbGroups: config.configFile,
                selDBIndex: -1,
                addDBModel: false,
                delDBModel: false,
                lang: {}
            }
        },
        methods: {
            open(link) {
                this.$electron.shell.openExternal(link)
            },
            showSubWindows: function (redisAlias) {
                subMain.loadNewWindow(redisAlias);
            },
            chooseDB(index){
                this.selDBIndex = index;
            },
            doDeleteDB() {
                let self = this;
                this.delDBModel = false;
                if (this.selDBIndex >= 0) {
                    config.loadConfigFile();
                    config.configFile.splice(this.selDBIndex, 1);
                    config.saveConfigFile(config.configFile);
                    this.dbGroups = config.configFile;
                } else {
                    dialog.showErrorBox(self.lang.operate_error, self.lang.unselect_db);
                }
            },
            addNewDB () {
                addUpdateWindow.loadNewWindow();
            },
            /**
             * 修改数据库连接
             */
            updateDB: function (){
                let self = this;
                if (self.selDBIndex >= 0) {
                    addUpdateWindow.loadNewWindow(self.dbGroups[self.selDBIndex]);
                } else {
                    dialog.showErrorBox(self.lang.operate_error, self.lang.unselect_db);
                }
            },
            changeLanguage(lang) {
                let self = this;
                self.lang = i18n.getLang(lang);
                console.log(self.lang);
                window.localStorage.setItem('lang', lang);
//                global.lang = self.lang;
            }
        },
        mounted: function () {
            let self = this;
//            console.log(global.user_language);
            self.lang = self.i18n;
//            global.lang = self.lang;
            ipc.on('add-database', function (event, arg) {
                console.log('The group list has changed!');
                self.dbGroups = config.getDBGroups();
            });
            if (config.checkFileExist()) {
                self.dbGroups = config.getDBGroups();
            } else {
                config.saveConfigFile();
            }
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
        top: 35px;
        bottom: 50px;
        /*height: auto;*/
        /*height: 100%;*/
        width: 100%;
        overflow: auto;
    }

    .menu-group {
        margin: 5px 24px 0px 24px;

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

    .ivu-menu-vertical .ivu-menu-item-group-title {
        height: 10px;
    }
</style>
