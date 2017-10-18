<template>
    <div class="add-db">
    <Form ref="dbConfig" :model="dbConfig" :label-width="60" :rules="ruleInline">
        <Form-item :label="lang.alias" prop="alias">
            <Input v-model="dbConfig.alias" placeholder=""></Input>
        </Form-item>
        <Form-item :label="lang.ip" prop="host">
            <Input v-model="dbConfig.host" placeholder=""></Input>
        </Form-item>
        <Form-item :label="lang.port" prop="port">
            <InputNumber v-model="dbConfig.port"></InputNumber>
        </Form-item>
        <Form-item :label="lang.password">
            <Input v-model="dbConfig.password" placeholder=""></Input>
        </Form-item>
        
        <Button @click="saveDB" type="primary" long>{{lang.save}}</Button>

    </Form>
    </div>
</template>
<script>
    import config from '../../common/config_util';
    const ipc = require('electron').ipcRenderer;

    export default {
        name: "addDB",
        data () {
            let self = this;
            return {
                lang: self.i18n,
                update: false,
                oldAlias: '',
                dbConfig: {
                    family: 4,
                    host: "",
                    port: 6379,
                    type: 1,  //1:无密码模式，2:有密码
                    password: "",
                    db: 0,
                    alias: ""
                },
                ruleInline: {
                    host: [
                        { required: true, message: self.i18n.input_ip, trigger: 'blur' }
                    ],
                    alias: [
                        { required: true, message: self.i18n.input_alias, trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            /**
             * 修改或保存数据库连接
             */
            saveDB: function () {
                let self = this;
                this.$refs['dbConfig'].validate((valid) => {
                    if (valid) {
                        if (self.update) {
//                             let canEdit = true;
//                             config.configFile.forEach(function (element, index) {
//                                 if (element.alias === self.dbConfig.alias && self.dbConfig.alias !== self.oldAlias) {
//                                     self.$Message.error('存在相同别名数据库，请修改后再添加！');
// //                                    alert("存在相同别名数据库，请修改后再添加！");
//                                     canEdit = false;
//                                 }
//                             });
                            if (!self.checkDBAlias(self.dbConfig.alias) || self.dbConfig.alias === self.oldAlias) {
                                config.configFile.forEach(function(element, index) {
                                    if (element.alias === self.oldAlias) {
                                        // console.log(element.alias === self.oldAlias);
                                        config.configFile[index] = self.dbConfig;
                                        config.saveConfigFile(config.configFile);
                                        self.$Message.success(self.lang.update_db_info_success);
                                        //alert("修改数据库成功！");
                                        ipc.send('add-database', config.configFile);
                                    }
                                });
                            } else {
                                self.$Message.error(self.lang.has_same_alias_db);
                            }
                        } else if (!self.checkDBAlias(self.dbConfig.alias)) {
                            config.configFile.push(self.dbConfig);
                            config.saveConfigFile(config.configFile);
                            self.$Message.success(self.lang.add_db_info_success);
//                            alert("新增数据库成功！");
                            ipc.send('add-database', config.configFile);
                        } else {
                            self.$Message.error(self.lang.has_same_alias_db);
                        }
                    } else {
                        this.$Message.error(self.lang.verify_form_fail);
                        return false;
                    }
                });
            },
            /**
             * 检查数据库别名是否重复
             *
             * @param alias
             * @returns {boolean}
             */
            checkDBAlias(alias) {
                let self = this;
                let hasSameName = false;
                config.loadConfigFile();
                config.configFile.forEach(function (element) {
                    if (element.alias === alias) {
                        hasSameName = true;
                    }
                });
                return hasSameName;
            }
        },
        mounted: function () {
            let self = this;
            let $ = self.$;
            console.log("mounted...");
            $("title").html(self.lang.add_db_info);
            ipc.on('transferData', (event, message) => {
                console.log(message);
                self.dbConfig = message;
                self.oldAlias = message.alias;
                self.update = true;
                self.$("title").html(self.lang.update_db_info);
            })
        }
    }
</script>
<style scoped>
    @import url('./asserts/css/iview.css');
    
    .add-db {
        padding: 10px 20px 10px 20px;
    }
</style>
