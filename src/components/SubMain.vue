<template>
    <div class="layout" id="app">
        <Row type="flex" style="height: 100%">
            <i-col span="5" class="layout-menu-left">
                <!--<div class="layout-logo-left"></div>-->
                <!--<Dropdown trigger="click" class="db-select">-->
                <!--<a href="javascript:void(0)">-->
                <!--DB选择：-->
                <!--<Icon type="arrow-down-b"></Icon>-->
                <!--</a>-->
                <!--<Dropdown-menu slot="list">-->
                <!--<Dropdown-item v-for="item in cityList">{{ item.label }}</Dropdown-item>-->
                <!--</Dropdown-menu>-->
                <!--</Dropdown>-->
                <Select class="db-select" v-model="model2" size="small" placeholder="请选择DB...">
                    <Option v-for="(db, index) in dbs" :value="db.dbId" :key="db.dbId"
                            @click.native="openSubmenu(db.dbId)">当前DB：{{ db.dbId }}
                    </Option>
                </Select>
                <div class="keys-div" id="keys">
                    <Menu theme="dark" width="auto">
                        <Menu-item v-for="(key, index) in keys" :name="key.name" @click.native="showContent(key.name)"
                                   style="padding: 5px 24px">
                            <Icon type="ios-navigate" :size="iconSize"></Icon>
                            <span class="layout-text">{{key.name}}</span>
                        </Menu-item>
                    </Menu>
                </div>
                <!--<Menu theme="dark" width="auto">-->
                <!--<Submenu v-for="(db, index) in dbs" :name="db.dbId" @click.native="openSubmenu(db.dbId)">-->
                <!--<template slot="title">-->
                <!--<Icon type="ios-navigate"></Icon>-->
                <!--DB{{db.dbId}} Keys:{{db.keySize}}-->
                <!--</template>-->
                <!--<Menu-item v-for="(key, index) in keys" :name="key.name"><span style="color: red">{{key.type}}</span>{{key.name}}</Menu-item>-->
                <!--&lt;!&ndash;<Menu-item name="1-2"><Icon type="ios-close"></Icon> Key1</Menu-item>&ndash;&gt;-->
                <!--&lt;!&ndash;<Menu-item name="1-3"><Icon type="ios-close"></Icon> Key1</Menu-item>&ndash;&gt;-->
                <!--</Submenu>-->
                <!--<Submenu name="2">-->
                <!--<template slot="title">-->
                <!--<Icon type="ios-keypad"></Icon>-->
                <!--GROUP2-->
                <!--</template>-->
                <!--<Menu-item name="2-1">DB1</Menu-item>-->
                <!--<Menu-item name="2-2">DB2</Menu-item>-->
                <!--</Submenu>-->
                <!--<Submenu name="3">-->
                <!--<template slot="title">-->
                <!--<Icon type="ios-analytics"></Icon>-->
                <!--GROUP3-->
                <!--</template>-->
                <!--<Menu-item name="3-1">DB1</Menu-item>-->
                <!--<Menu-item name="3-2">DB2</Menu-item>-->
                <!--</Submenu>-->
                <!--</Menu>-->
                <!--<div class="search-div">-->
                <!--<Input class="search-box" v-model="value13" size="small">-->
                <!--<Select v-model="select3" slot="prepend" style="width: 80px" size="small">-->
                <!--<Option value="day">日活</Option>-->
                <!--<Option value="month">月活</Option>-->
                <!--</Select>-->
                <!--<Button slot="append" icon="ios-search" size="small"></Button>-->
                <!--</Input>-->
                <!--</div>-->
                <div class="search-div">
                    <Input class="db-select" v-model="searchKey" icon="ios-clock-outline" placeholder="请输入查询表达式..."
                           size="small"/>
                </div>
            </i-col>
            <i-col span="19" style="height: 100%">
                <router-view></router-view>
            </i-col>
        </Row>
    </div>
</template>

<script>
    //    import rds from '../common/redis';

    export default {
        // name: 'RedisClient-client',
        data() {
            return {
                dbs: [],
                keys: [],
                selectedDB: 0,
                searchKey: '',
                redisAlias: this.redisAlias,
                password: ''
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

            getDB: function () {
                let self = this;
                self.dbs = [
                    {
                        dbId: 0,
                        keySize: 124
                    },
                    {
                        dbId: 1,
                        keySize: 1554
                    },
                    {
                        dbId: 2,
                        keySize: 164
                    }
                ]
            },

            openSubmenu: function (dbIndex) {
                let self = this;
                console.log(this.redis);

                this.redis.select(dbIndex).then(resolve => {
                    if (resolve !== 'OK') {
                        throw new Error('连接DB' + dbIndex + "失败！");
                    }
                    self.selectedDB = dbIndex;
                    this.redis.keys(self.searchKey === '' ? '*' : self.searchKey).then(result => {
//                            console.log(res)
                        console.log(result);
                        if (result && result.length !== 0) {
                            result.forEach(function (key) {
                                self.redis.type(key).then(res => {
                                    console.log(res);
                                    self.keys.push({
                                        name: key,
                                        type: res
                                    })
                                });
                            })
                        } else {
                            console.log("该库无数据！");
                            self.keys = [];
                        }
                    });
                }).catch(error => {
                    console.log(error);
                    alert(error);
                });
            },

            showContent: function (key) {
                alert(key);
            }
        },
        created() {
            console.log(this.redisAlias);
//            rds.connect(this.redisAlias);
            this.getDB();
//            console.log(this.redis);
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

    .db-select {
        -webkit-app-region: drag;
        width: 90%;
        /*height: 30px;*/
        background: transparent;
        /*background-color: transparent;*/
        border-radius: 3px;
        margin: 35px 25px 10px 15px;
    }

    .search-div {
        position: absolute;
        bottom: 0;
        width: 100%;
        /*height:100px;*/
        /*background-color: #ffc0cb;*/
    }

    .keys-div {
        position: absolute;
        top: 62px;
        bottom: 38px;
        /*height: auto;*/
        /*height: 100%;*/
        width: 100%;
        overflow: auto;
        /*background-color: #5b6270;*/
    }
</style>
