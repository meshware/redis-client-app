<template>
    <div class="setting" id="statusDiv">
        <Card :bordered="false" :dis-hover="true" style="width:100%; height: 150px">
            <p slot="title">存储状态</p>
            <Row align="middle">
                <Col span="6">TODO状态图表</Col>
            </Row>
        </Card>
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
                <Button type="error" size="large" long :loading="modalLoading" @click="">删除</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    // import CodeMirror from 'codemirror/lib/codemirror';
    // import { codemirror } from 'vue-codemirror';
    // import SystemInformation from './landingPage/SystemInformation'

    export default {
        name: 'status',
        components: {},
        data() {
            return {
                delDBModel: false,
                modalLoading: false
            }
        },
        computed: {
            iconSize() {
                return this.spanLeft === 5 ? 14 : 24;
            }
        },
        methods: {

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
