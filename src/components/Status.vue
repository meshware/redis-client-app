<template>
    <div style="" id="statusDiv">
        <!-- <div class="quyu clearfix">
            <div class="q-left"></div>
            <Button type="error" class="delete" size="small" @click="refreshStatus($route.params.key)">刷新</Button>
            <a href="javascript:;" class="delete" @click="deleteKey($route.params.key)">删除</a>
        </div> -->
        <div class="text-area">
            <div style="width: 98%" class="clearfix">
                <Row align="middle">
                    <Col span="12">
                    <div id="serverChart">
                    </div>
                    <p style="text-align:center">
                        <Button type="error" size="small" @click="refreshStatus">刷新</Button>
                    </p>
                    </Col>
                    <Col span="12">
                    <div id="memoryChart">
                    </div>
                    <p style="text-align:center">
                        <Button type="error" size="small" @click="refreshStatus">刷新</Button>
                    </p>
                    </Col>
                </Row>
            </div>
        </div>
    </div>
    <!-- <div class="setting" id="statusDiv">
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
    </div> -->
</template>

<script>
    import Highcharts from 'highcharts';
    import $ from 'jquery';

    require('highcharts/modules/exporting')(Highcharts);
    require('highcharts/highcharts-more')(Highcharts);

    export default {
        name: 'status',
        components: {},
        data() {
            return {
                delDBModel: false,
                modalLoading: false,
                memoryData: [],
                memoryPeakData: []
            }
        },
        computed: {
            iconSize() {
                return this.spanLeft === 5 ? 14 : 24;
            }
        },
        methods: {
            refreshStatus: function () {
                let self = this;
                $('#serverChart').html('');
                let usedMemory = {};
                let totalMemory = {};
                let usedMemoryPeak = {};
                let totalMemoryPeak = {};
                if (self.redis) {
                    self.redis.info("memory").then(function (result) {
                        console.log(result.split('\n'));
                        result.split('\n').forEach(function (element) {
                            // if (element.indexOf('used_memory:') >= 0) {
                            //     usedMemory.name = '使用内存';
                            //     usedMemory.y = parseFloat(element.replace('used_memory:', ''));
                            // }
                            // if (element.indexOf('used_memory_human:') >= 0) {
                            //     usedMemory.human = element.replace('used_memory_human:', '');
                            // }
                            if (element.indexOf('used_memory_rss:') >= 0) {
                                usedMemory.name = '使用内存';
                                usedMemory.y = parseFloat(element.replace('used_memory_rss:', ''));
                            }
                            if (element.indexOf('used_memory_rss_human:') >= 0) {
                                usedMemory.human = element.replace('used_memory_rss_human:', '');
                            }
                            if (element.indexOf('used_memory_peak:') >= 0) {
                                usedMemoryPeak.name = '使用峰值';
                                usedMemoryPeak.y = parseFloat(element.replace('used_memory_peak:', ''));
                            }
                            if (element.indexOf('used_memory_peak_human:') >= 0) {
                                usedMemoryPeak.human = element.replace('used_memory_peak_human:', '');
                            }
                            if (element.indexOf('total_system_memory:') >= 0) {
                                totalMemory.name = '剩余内存';
                                totalMemory.y = parseFloat(element.replace('total_system_memory:', '')) - usedMemory.y;

                                totalMemoryPeak.name = '剩余内存';
                                totalMemoryPeak.y = parseFloat(element.replace('total_system_memory:', '')) - usedMemoryPeak.y;
                            }
                            if (element.indexOf('total_system_memory_human:') >= 0) {
                                totalMemory.human = (totalMemory.y / 1073741824).toFixed(2) + 'G' //element.replace('total_system_memory_human:', '');
                                totalMemoryPeak.human = (totalMemoryPeak.y / 1073741824).toFixed(2) + 'G' //element.replace('total_system_memory_human:', '');
                            }
                        });
                        self.memoryData = [usedMemory, totalMemory];
                        self.drawServerChart(self.memoryData);
                        self.memoryPeakData = [usedMemoryPeak, totalMemoryPeak];
                        self.drawMemoryChart(self.memoryPeakData);
                    }).catch(res => {
                        console.log(res);
                        alert(res);
                    });
                } else {
                    self.drawServerChart([{name: '使用内存', y: 0},{name: '剩余内存', y: 0}]);
                    self.drawMemoryChart([{name: '峰值内存', y: 0},{name: '剩余内存', y: 0}]);
                }
            },
            drawMemoryChart: function (dataArray) {
                Highcharts.chart("memoryChart", {
                    exporting: {
                        enabled: false
                    },
                    credits: {
                        text: '',
                        href: ''
                    },
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false
                    },
                    title: {
                        text: '内存使用峰值占比'
                    },
                    tooltip: {
                        headerFormat: '{series.name}<br>',
                        pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b> | <b>{point.human}</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: false
                            },
                            showInLegend: true
                        }
                    },
                    series: [{
                        type: 'pie',
                        name: '内存使用峰值占比',
                        data: dataArray
                    }]
                });
            },
            drawServerChart: function (dataArray) {
                Highcharts.chart("serverChart", {
                    exporting: {
                        enabled: false
                    },
                    credits: {
                        text: '',
                        href: ''
                    },
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false
                    },
                    title: {
                        text: '内存使用占比'
                    },
                    tooltip: {
                        headerFormat: '{series.name}<br>',
                        pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b> | <b>{point.human}</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: false
                            },
                            showInLegend: true
                        }
                    },
                    series: [{
                        type: 'pie',
                        name: '内存使用占比',
                        data: dataArray
                    }]
                });
            }
        },
        created() {

        },
        mounted: function () {
            let self = this;
            let $ = self.$;
            console.log("status mounted...");
//            self.refreshStatus();
        },
        watch: {
            // 如果路由有变化，会再次执行该方法
//            '$route': 'doGetContent'
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

    .quyu {
        padding: 13px 0 23px 0;
        border-bottom: 1px solid #e9eaec;
        line-height: 1;
    }

    .content-new .q-left {
        float: left;
        font-size: 14px;
        color: #1c2438;
        font-weight: 700;
        overflow: hidden;
    }

    .content-new .delete {
        float: right;
        display: block;
        margin-right: 10px;
        margin-top: -7px;
    }

    .text-area {
        /* position: absolute; */
        left: 0;
        top: 45px;
        /* right: 0; */
        bottom: 10px;
        overflow-y: auto;
    }
</style>
