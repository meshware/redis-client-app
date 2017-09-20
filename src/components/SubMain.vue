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
                    <Button class="refresh-btn" type="primary" shape="circle" size="small" @click="doSearchKey">
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
                <Input class="key-filter" v-model="searchKey" icon="ios-eye" placeholder="请输入查询表达式..."
                       @on-change="doSearchKey" size="small"/>
            </i-col>
            <i-col span="19" style="height: 100%">
                <div id="right-content" style="height:100%; padding-left:10px; padding-top: 2px;">
                    <div class="bd-title clearfix" style="-webkit-app-region: drag;">
                        <ul class="cont-qie clearfix">
                            <li class="cur-li"><a href="javascript:;">内容</a></li>
                            <li><a href="javascript:;">添加</a></li>
                            <li><a href="javascript:;">设置</a></li>
                            <li><a href="javascript:;">状态</a></li>
                        </ul>
                    </div>

                    <div class="cont-detail">
                        <div class="content-new content-new-show" style="">
                            <router-view></router-view>
                        </div>
                        <div class="content-new">
                            <Card>
                                <Form :model="insertRedisFormValue" :rules="ruleValidate" ref="insertRedisForm" :label-width="80" style="with:95%;font-size: 30px; color: #6d7380; font-weight:900;">
                                    <FormItem label="请选择插入的类型:" :label-width="120" prop="insertRedisType">
                                        <RadioGroup v-model="insertRedisFormValue.insertRedisType">
                                            <Radio label="String"></Radio>
                                            <Radio label="Hash"></Radio>
                                            <Radio label="List"></Radio>
                                            <Radio label="Set"></Radio>
                                        </RadioGroup>
                                    </FormItem>
                                    <FormItem label="Key:" prop="insertStringKey">
                                        <Input v-model="insertRedisFormValue.insertStringKey"/>
                                    </FormItem>
                                    <FormItem label="Value:" prop="insertStringValue">
                                        <Input v-model="insertRedisFormValue.insertStringValue"/>
                                    </FormItem>
                                    <FormItem>
                                        <Button @click.native.prevent="submitInsertForm" type="primary" shape="circle">保存</Button>
                                    </FormItem>
                                    <Card style="color:red" v-show="showRedisInsertError">
                                        <div style="margin-left: 10px">
                                        <span>错误:</span>
                                        <Row style="width: 100%; word-wrap:break-word;">{{errorRedisInsertMessage}}</Row>
                                        </div>
                                    </Card>
                                </Form>
                            </Card>
                        </div>
                        <div class="content-new">
                            <div class="setting" id="settingDiv">
                                <Card :bordered="false" :dis-hover="true" style="width:100%; height: 150px">
                                    <p slot="title">内容设置</p>
                                    <Row align="middle">
                                        <Col span="6">清空此库</Col>
                                        <Col span="6"><Button @click="flushDB" type="error" size="small">确认清空</Button></Col>
                                    </Row>
                                </Card>
                            </div>
                        </div>
                        <div class="content-new">
                            查看数据库状态
                        </div>
                    </div>
                </div>
            </i-col>
        </Row>
        <Modal v-model="delDBModel" title="清空数据库" width="300">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>数据清空</span>
            </p>
            <div style="text-align:center">
                <p>清空数据后，数据将不可找回。</p>
                <p>是否继续清空？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="modalLoading" @click="doFlushDB">删除</Button>
            </div>
        </Modal>
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
                redisAlias: this.redisAlias,
                delDBModel: false,
                modalLoading: false,
                insertRedisFormValue: {
                    insertStringKey:'',
                    insertStringValue:'',
                    insertRedisType:'String',
                },
                ruleValidate: {
                    insertStringKey: [
                        { required: true, message: 'Key必填', trigger: 'blur' }
                    ],
                    insertStringValue: [
                        { required: true, message: 'Value必填', trigger: 'blur' },
                    ]
                },
                showRedisInsertError: false,
                errorRedisInsertMessage:''
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
            },
            flushDB: function () {
                let self = this;
                self.delDBModel = true;
            },
            doFlushDB: function () {
                let self = this;
                self.modalLoading = true;
                this.redis.flushdb().then(resolve => {
                    console.log(resolve);
                    self.doSearchKey();
                    self.modalLoading = false;
                    self.delDBModel = false;
                }).catch(error => {
                    console.log(error);
                    alert(error);
                    self.modalLoading = false;
                    self.delDBModel = false;
                });
            },
            /*
             * redis插入数据
             *
             * */
            submitInsertForm(){
                this.$refs.insertRedisForm.validate((valid) => {
                    if (valid) {
                        let me = this;
                        let insertRedisMethod = "";
                        let redisKey = this.insertRedisFormValue.insertStringKey;
                        let redisType = this.insertRedisFormValue.insertRedisType;
                        let redisValue = this.insertRedisFormValue.insertStringValue;
                        console.log(redisValue);
                        if(redisType=="String"){
                            insertRedisMethod = me.redis.set(redisKey,redisValue);
                        }else if(redisType=="Set"){
                            insertRedisMethod = me.redis.sadd(redisKey,redisValue);
                        }else if(redisType=="List"){
                            insertRedisMethod = me.redis.lpush(redisKey,redisValue);
                        }else if(redisType=="Hash"){
                            let valueJson = "";
                            try {
                                valueJson = JSON.parse(redisValue.toString());
                            } catch (e) {
                                me.showRedisInsertError=true;
                                me.errorRedisInsertMessage="Value不是正确的Json格式";
                                return false;
                            }
                            insertRedisMethod = me.redis.hmset(redisKey,valueJson);
                        }
                        if(insertRedisMethod==""){
                            me.$Message.error('请选择插入的类型');
                        }else{
                            insertRedisMethod.then(function (result) {
                                if(result==0){
                                    me.showRedisInsertError=true;
                                    me.errorRedisInsertMessage="插入未成功,数据重复";
                                }else if(result =="OK"||result>0){
                                    me.$Message.info('添加成功');
                                    me.doSearchKey();
                                    me.showRedisInsertError=false;
                                    me.errorRedisInsertMessage='';
                                    me.$refs['insertRedisForm'].resetFields();
                                }else{
                                    me.showRedisInsertError=true;
                                    me.errorRedisInsertMessage=result;
                                }
                            }).catch((error) => {
                                me.showRedisInsertError=true;
                                if(error.message=="WRONGTYPE Operation against a key holding the wrong kind of value")
                                {
                                    me.errorRedisInsertMessage="其它数据类型占有此key";
                                }else{
                                    me.errorRedisInsertMessage=error;
                                }
                            });
                        }
                    } else {
                        return false;
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

    .setting {
        /*position: absolute;*/
        top: 0px;
        bottom: 0px;
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
    }
</style>
