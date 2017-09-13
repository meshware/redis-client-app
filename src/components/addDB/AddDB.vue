<template>
    <div class="add-db">
    <Form :model="formItem" :label-width="50">
        <Form-item label="别名">
            <Input v-model="dbConfig.alias" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="IP地址">
            <Input v-model="dbConfig.host" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="端口">
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
                dbConfig: {
                    family: 4,
                    host: "",
                    port: 6379,
                    type: 1,  //1:无密码模式，2:有密码
                    password: "",
                    db: 0,
                    alias: ""
                }
            }
        },
        methods: {
            saveDB: function () {
                let self = this;
                if (!self.checkDBAlias(self.dbConfig.alias)) {
                    config.configFile.push(self.dbConfig);
                    config.saveConfigFile(config.configFile);
                    alert("新增数据库成功！");
                    ipc.send('add-database', 'ping');
                } else {
                    alert("存在相同别名数据库，请修改后再添加！");
                }
            },
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
        }
    }
</script>
<style scoped>
    @import url('./asserts/css/iview.css');
    
    .add-db {
        padding: 10px 20px 10px 20px;
    }
</style>
