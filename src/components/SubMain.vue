<template>
    <div class="layout" id="app">
        <Row type="flex" style="height: 100%">
            <i-col span="5" class="layout-menu-left">
                <Menu active-name="1-2" theme="dark" width="auto" :open-names="['1']">
                    <div class="layout-logo-left"></div>
                    <Submenu name="1">
                        <template slot="title">
                            <Icon type="ios-navigate"></Icon>
                            DB1
                        </template>
                        <Menu-item name="1-1"><Icon type="ios-checkmark"></Icon> Key1</Menu-item>
                        <Menu-item name="1-2"><Icon type="ios-close"></Icon> Key1</Menu-item>
                        <Menu-item name="1-3"><Icon type="ios-close"></Icon> Key1</Menu-item>
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

    export default {
        // name: 'RedisClient-client',
        methods: {
            open(link) {
                this.$electron.shell.openExternal(link)
            }
        }
    }
</script>

<style>
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
