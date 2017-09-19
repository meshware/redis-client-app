<template>
    <div class="add-db">
    <Form ref="dbConfig" :model="dbConfig" :label-width="60" :rules="ruleInline">
        <Form-item label="别名" prop="alias">
            <Input v-model="dbConfig.alias" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="IP地址" prop="host">
            <Input v-model="dbConfig.host" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="端口" prop="port">
            <InputNumber v-model="dbConfig.port"></InputNumber>
        </Form-item>
        <Form-item label="密码">
            <Input v-model="dbConfig.password" placeholder="请输入"></Input>
        </Form-item>
        
        <Button @click="saveDB" type="primary" long>保存</Button>

    </Form>
    </div>
</template>
<script>
    import config from '../../common/config_util';
    const ipc = require('electron').ipcRenderer;

    export default {
        name: "addDB",
        data () {
            return {
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
                        { required: true, message: '请填写IP地址', trigger: 'blur' }
                    ],
                    alias: [
                        { required: true, message: '请填写别名', trigger: 'blur' }
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
                            config.configFile.forEach(function (element, index) {
                                let canEdit = true;
                                if (element.alias === self.dbConfig.alias && self.dbConfig.alias !== self.oldAlias) {
                                    self.$Message.error('存在相同别名数据库，请修改后再添加！');
//                                    alert("存在相同别名数据库，请修改后再添加！");
                                    canEdit = false;
                                }
                                if (canEdit && element.alias === self.oldAlias) {
                                    config.configFile[index] = self.dbConfig;
                                    config.saveConfigFile(config.configFile);
                                    self.$Message.success('修改数据库成功！');
//                                    alert("修改数据库成功！");
                                    ipc.send('add-database', 'ping');
                                }
                            });
                        } else if (!self.checkDBAlias(self.dbConfig.alias)) {
                            config.configFile.push(self.dbConfig);
                            config.saveConfigFile(config.configFile);
                            self.$Message.success('新增数据库成功！');
//                            alert("新增数据库成功！");
                            ipc.send('add-database', 'ping');
                        } else {
                            self.$Message.error('存在相同别名数据库，请修改后再添加！');
                        }
                    } else {
                        this.$Message.error('表单验证失败，请修改后重试!');
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
            ipc.on('transferData', (event, message) => {
                console.log(message);
                self.dbConfig = message;
                self.oldAlias = message.alias;
                self.update = true;
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
