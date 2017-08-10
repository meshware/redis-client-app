<template>
    <div class="layout" id="app">
        <Row type="flex" style="height: 100%">
            <i-col span="5" class="layout-menu-left">
                <Menu theme="dark" width="auto">
                    <div class="layout-logo-left"></div>
                    <Submenu v-for="(db, index) in dbs" :name="db.dbId" @click.native="openSubmenu(db.dbId)">
                        <template slot="title">
                            <Icon type="ios-navigate"></Icon>
                            DB{{db.dbId}} Keys:{{db.keySize}}
                        </template>
                        <template>
                            <Menu-item v-for="(key, index) in keys" :name="key.name"><span style="color: red">{{key.type}}</span>{{key.name}}</Menu-item>
                        </template>
                        <!--<Menu-item name="1-2"><Icon type="ios-close"></Icon> Key1</Menu-item>-->
                        <!--<Menu-item name="1-3"><Icon type="ios-close"></Icon> Key1</Menu-item>-->
                    </Submenu>
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
                </Menu>
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
            <i-col span="19" style="height: 100%">
                <router-view></router-view>
            </i-col>
        </Row>
    </div>
</template>

<script>
    import rds from '../common/redis';

    export default {
        // name: 'RedisClient-client',
        data() {
            return {
                dbs: [],
                keys:[],
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
                    },
                ]
            },

            openSubmenu: function (dbIndex) {
                let self = this;
                rds.client.select(dbIndex, function() {
                    console.log("selected db" + dbIndex);
                    self.keys = [{name:'123', type: 'string'},{name:'456', type: 'set'}, {name:'789', type: 'map'}];
//                    rds.client.set("nodejstest", "test");
//                    rds.client.get("nodejstest", function (err, reply) {
//                        console.log(reply.toString()); // Will print `OK`
//                    });
//                    rds.client;
//                    rds.client.multi().get('*').execAsync().then(function(res) {
//                        console.log(res); // => 'bar'
//                    });
                });

            }
        },
        created() {
            rds.connect();
            this.getDB();
        }
    }
</script>

<style scoped>
    @import url('./asserts/css/iview.css');

    .layout{
        height: 100%;
        /*border: 1px solid #d7dde4;*/
        /*background: #f5f7f9;*/
        position: relative;
    }
    .layout-breadcrumb{
        padding: 10px 15px 0;
    }
    .layout-content{
        height: auto;
        min-height: 80%;
        margin: 15px;
        overflow: hidden;
        background: #fff;
        border-radius: 4px;
    }
    .layout-content-main{
        padding: 10px;
    }
    .layout-copy{
        text-align: center;
        padding: 10px 0 10px;
        color: #9ea7b4;
    }
    .layout-menu-left{
        height: auto;
        background: #464c5b;
    }
    .layout-header{
        height: 30px;
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .layout-logo-left{
        width: 90%;
        height: 30px;
        /*background: #5b6270;*/
        border-radius: 3px;
        margin: 0;
    }
    .search-div{
        /*padding-bottom: 15px;*/
        /*margin-bottom: 65px;*/
        width: 90%;
        height: 30px;
        /*background: #5b6270;*/
        border-radius: 3px;
        margin: 15px auto;
    }
    .search-box{
        background-color: #5b6270;
    }
</style>
