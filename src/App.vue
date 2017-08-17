<template>
    <div class="layout" id="app">
        <Row type="flex" style="height: 100%">
            <i-col class="layout-menu-left">
                <div v-if="showTitle" class="layout-logo"><p style="text-align: center">Redis Client App {{platform}}</p></div>
                <div class="menu-group">
                    <Button-group size="small">
                        <Button type="primary" @click="addDBModel = true"><Icon type="ios-plus-outline"></Icon> 添加</Button>
                        <Button type="primary" @click="delDBModel = true"><Icon type="ios-plus-outline"></Icon> 删除</Button>
                        <!--<Button type="primary" icon="ios-skipforward"></Button>-->
                        <!--<Button type="primary" icon="ios-skipforward"></Button>-->
                        <!--<Button type="primary" icon="ios-skipforward"></Button>-->
                    </Button-group>
                        <Dropdown trigger="click" style="margin-left: 20px">
                            <a href="javascript:void(0)">
                                click 触发
                                <Icon type="arrow-down-b"></Icon>
                            </a>
                            <Dropdown-menu slot="list">
                                <Dropdown-item>驴打滚</Dropdown-item>
                                <Dropdown-item>炸酱面</Dropdown-item>
                                <Dropdown-item>豆汁儿</Dropdown-item>
                                <Dropdown-item>冰糖葫芦</Dropdown-item>
                                <Dropdown-item>北京烤鸭</Dropdown-item>
                            </Dropdown-menu>
                        </Dropdown>
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
                                默认分组
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
                        <Submenu name="2" v-for="dbGroup in dbGroups">
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
         <Modal v-model="addDBModel" title="自定义宽度" width="300" @on-ok="ok">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>增加数据库连接</span>
            </p>
            <div style="text-align:center">
                <!-- <Form-item label="输入框">
                    <Input v-model="formItem.input" placeholder="请输入"></Input>
                </Form-item>
                <Form-item label="输入框">
                    <Input v-model="formItem.input" placeholder="请输入"></Input>
                </Form-item>
                <Form-item label="选择器">
                    <Select v-model="formItem.select" placeholder="请选择">
                        <Option value="beijing">北京市</Option>
                        <Option value="shanghai">上海市</Option>
                        <Option value="shenzhen">深圳市</Option>
                    </Select>
                </Form-item> -->
            </div>
            <!-- <div slot="footer">
                <Button type="error" size="large" long :loading="modal_loading" @click="del">删除</Button>
            </div> -->
        </Modal>
        <Modal v-model="delDBModel" title="自定义宽度" width="300">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>删除确认</span>
            </p>
            <div style="text-align:center">
                <p>此任务删除后，下游 10 个任务将无法执行。</p>
                <p>是否继续删除？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="modal_loading" @click="del">删除</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import subMain from './sub_main';
    import config from './common/config_util';
    const dialog = require('electron').remote.dialog;

    export default {
        name: 'redis-client',
        data() {
            return {
                showTitle: require('os').platform() === 'darwin',
                dbGroups: [],
                addDBModel: false,
                delDBModel: false
            }
        },
        methods: {
            open(link) {
                this.$electron.shell.openExternal(link)
            },
            showSubWindows: function (redisAlias) {
                subMain.loadNewWindow(redisAlias);
            },
            addNewDB () {
                this.$Modal.confirm({
                    render: (h) => {
                        return h('Input', {
                            props: {
                                value: this.value,
                                autofocus: true,
                                placeholder: 'Please enter your name...'
                            },
                            on: {
                                input: (val) => {
                                    this.value = val;
                                }
                            }
                        })
                    }
                })
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
        top: 35px;
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
