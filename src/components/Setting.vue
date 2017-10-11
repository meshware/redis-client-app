<template>
    <div class="setting" id="settingDiv">
        <Card :bordered="false" :dis-hover="true" style="width:100%; height: 150px">
            <p slot="title">{{lang.set_content}}</p>
            <Row align="middle">
                <Col span="19">{{lang.flush_db_notice}}</Col>
                <Col span="5">
                    <Button style="margin-top: -5px;" @click="flushDB" type="error" size="small">{{lang.confirm}}</Button>
                </Col>
            </Row>
        </Card>
        <Modal v-model="delDBModel" title="${lang.flush_db}" width="300">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>{{lang.flush_db}}</span>
            </p>
            <div style="text-align:center">
                <p>{{lang.flush_db_notice2}}</p>
                <p>{{lang.flush_db_notice3}}</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="modalLoading" @click="doFlushDB">{{lang.delete}}</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    // import CodeMirror from 'codemirror/lib/codemirror';
    // import { codemirror } from 'vue-codemirror';
    // import SystemInformation from './landingPage/SystemInformation'

    export default {
        name: 'setting',
        components: {},
        data() {
            let self = this;
            return {
                delDBModel: false,
                modalLoading: false,
                lang: self.i18n
            }
        },
        computed: {
            iconSize() {
                return this.spanLeft === 5 ? 14 : 24;
            }
        },
        methods: {
            /**
             * 清空DB确认弹窗
             */
            flushDB: function () {
                let self = this;
                self.delDBModel = true;
            },
            /**
             * 执行清空DB
             */
            doFlushDB: function () {
                let self = this;
                self.modalLoading = true;
                self.redis.flushdb().then(resolve => {
                    console.log(resolve);
                    self.$('#refreshBtn').click();
                    self.modalLoading = false;
                    self.delDBModel = false;
                }).catch(error => {
                    console.log(error);
                    alert(error);
                    self.modalLoading = false;
                    self.delDBModel = false;
                });
            }
        },
        created() {

        },
        watch: {
            // 如果路由有变化，会再次执行该方法
//            '$route': 'doGetContent'
        },
        mounted: function () {

        }
    }
</script>

<style scoped>
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
</style>
