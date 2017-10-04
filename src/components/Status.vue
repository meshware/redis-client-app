<template>
    <div style="" id="statusDiv">
        <div class="quyu clearfix">
            <div class="q-left"></div>
            <Button type="error" class="delete" size="small" @click="refreshStatus">刷新</Button>
            <!--<a href="javascript:;" class="delete" @click="deleteKey($route.params.key)">删除</a>-->
        </div>
        <div class="text-area">
            <div style="width: 98%">
                <Row align="middle">
                    <Col span="12">
                    <div style="height:400px" id="serverChart">
                    </div>
                    <!--<p style="text-align:center;">-->
                        <!--<Button type="error" size="small" @click="refreshStatus">刷新</Button>-->
                    <!--</p>-->
                    </Col>
                    <Col span="12">
                    <div style="height:400px" id="memoryChart">
                    </div>
                    <!--<p style="text-align:center;">-->
                        <!--<Button type="error" size="small" @click="refreshStatus">刷新</Button>-->
                    <!--</p>-->
                    </Col>
                </Row>
            </div>
            <div style="width: 98%; margin-top: 10px">
                <Row align="middle">
                    <Col span="6" style="text-align: right">
                    Redis版本：
                    </Col>
                    <Col span="6">
                    {{serverInfo.redis_version}}
                    </Col>
                    <Col span="6" style="text-align: right">
                    Redis模式：
                    </Col>
                    <Col span="6">
                    {{serverInfo.redis_mode}}
                    </Col>
                </Row>
                <Row align="middle">
                    <Col span="6" style="text-align: right">
                    当前连接数：
                    </Col>
                    <Col span="6">
                    {{clientInfo.connected_clients}}
                    </Col>
                    <Col span="6" style="text-align: right">
                    服务器版本：
                    </Col>
                    <Col span="6">
                    {{serverInfo.os}}
                    </Col>
                </Row>
                <Row align="middle">
                    <Col span="6" style="text-align: right">
                    进程ID：
                    </Col>
                    <Col span="6">
                    {{serverInfo.process_id}}
                    </Col>
                    <Col span="6" style="text-align: right">
                    运行天数：
                    </Col>
                    <Col span="6">
                    {{serverInfo.uptime_in_days}}
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
    const ipc = require('electron').remote.ipcMain;
//    const ipc = require('electron').remote.ipcRenderer;

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
                memoryPeakData: [],
                clientInfo: {connected_clients: 0},
                serverInfo: {},
                dbInfo: {}
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
                    self.redis.info("clients").then(function (result) {
                        console.log(result.split('\n'));
                        result.split('\n').forEach(function (element) {
                             if (element.indexOf('connected_clients:') >= 0) {
                                 self.clientInfo.connected_clients = parseFloat(element.replace('connected_clients:', ''));
                             }
                             if (element.indexOf('client_biggest_input_buf:') >= 0) {
                                 self.clientInfo.client_biggest_input_buf = parseFloat(element.replace('client_biggest_input_buf:', ''));
                             }
                        });

                    }).catch(res => {
                        console.log(res);
                        alert(res);
                    });
                    self.redis.info("server").then(function (result) {
                        console.log(result.split('\n'));
                        result.split('\n').forEach(function (element) {
                            if (element.indexOf('redis_version:') >= 0) {
                                self.serverInfo.redis_version = element.replace('redis_version:', '');
                            }
                            if (element.indexOf('redis_mode:') >= 0) {
                                self.serverInfo.redis_mode = element.replace('redis_mode:', '');
                            }
                            if (element.indexOf('os:') >= 0) {
                                self.serverInfo.os = element.replace('os:', '');
                            }
                            if (element.indexOf('arch_bits:') >= 0) {
                                self.serverInfo.arch_bits = element.replace('arch_bits:', '');
                            }
                            if (element.indexOf('process_id:') >= 0) {
                                self.serverInfo.process_id = element.replace('process_id:', '');
                            }
                            if (element.indexOf('tcp_port:') >= 0) {
                                self.serverInfo.tcp_port = element.replace('tcp_port:', '');
                            }
                            if (element.indexOf('uptime_in_days:') >= 0) {
                                self.serverInfo.uptime_in_days = element.replace('uptime_in_days:', '');
                            }
                            if (element.indexOf('config_file:') >= 0) {
                                self.serverInfo.config_file = element.replace('config_file:', '');
                            }
                        });
                    }).catch(res => {
                        console.log(res);
                        alert(res);
                    });
                    self.redis.info("keyspace").then(function (result) {
                        console.log(result.split('\n'));
                        result.split('\n').forEach(function (element) {
                            if (element.indexOf('db0:keys=') >= 0) {
                                self.dbInfo.db0Keys = element.replace('db0:keys=', '');
                            }
                        });
                    }).catch(res => {
                        console.log(res);
                        alert(res);
                    });
                } else {
                    self.drawServerChart([{name: '使用内存', y: 0}, {name: '剩余内存', y: 0}]);
                    self.drawMemoryChart([{name: '峰值内存', y: 0}, {name: '剩余内存', y: 0}]);
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
                                enabled: false,
                                format: '<b>{point.name}</b>: {point.percentage:.1f} % | {point.human}',
                                style: {
                                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                }
                            },
                            showInLegend: true //显示
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
                                enabled: false,
                                format: '<b>{point.name}</b>: {point.percentage:.1f} % | {point.human}',
                                style: {
                                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                }
                            },
                            showInLegend: true //显示
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
            ipc.on('redisConnectionDone', function (event, arg) {
                if(arg === 'success'){
                    self.refreshStatus();
                }
            })
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
        /*border-bottom: 1px solid #e9eaec;*/
        /*line-height: 1;*/
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
        /*position: absolute;*/
        left: 0;
        top: 0px;
        /* right: 0; */
        bottom: 10px;
        overflow-y: auto;
    }
</style>
