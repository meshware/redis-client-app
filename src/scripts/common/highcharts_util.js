/**
 * HighCharts Util
 */
'use strict';
import Highcharts from 'highcharts';

let highchartsUtil = {};

/**
 * 绘制回测结果图
 * 
 * @param baseData 基础图形数据
 * @param customerList 用户自定义绘图数据
 */
highchartsUtil.showMutiChartFunc = function (baseData, customerList) {
    let xMaxDate = baseData.xMaxDate;
    let xMinDate = baseData.xMinDate;
    let groupingUnits = [['week', [1]], ['month', [1, 2, 3, 4, 6]]];
    let chartConfig = {
        container: 'mainContainer',
        title: '量化交易收益图',
        xAxis: {
            //                tickInterval: tickIntervalvalue,
            minorTickInterval: 5,
            minTickInterval: 80,
            min: xMinDate,
            max: xMaxDate,
            gridLineWidth: 1,
            startOnTick: true,
            ordinal: false,
            dateTimeLabelFormats: {
                second: "%Y-%m-%d<br/>%H:%M:%S",
                minute: "%Y-%m-%d<br/>%H:%M",
                hour: "%Y-%m-%d<br/>%H:%M",
                day: "%Y<br/>%m-%d",
                week: "%Y<br/>%m-%d",
                month: "%Y-%m",
                year: "%Y"
            }
        },
        yAxis: [
            {
                minorTickInterval: 'auto',
                minorTickLength: 10,
                labels: {
                    align: 'right',
                    format: '{value}%',
                    x: -3
                },
                opposite: true,
                title: {
                    text: '累计收益'
                },
                height: '22%',
                lineWidth: 0,
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            {
                minorTickInterval: 'auto',
                minorTickLength: 10,
                labels: {
                    align: 'right',
                    x: -3,
                    formatter: function () {
                        let val = this.value;
                        if (this.value >= 1000 && this.value < 10000) {
                            val = this.value / 1000 + '千';
                        } else if (this.value >= 10000 && this.value < 1000000) {
                            val = this.value / 10000 + '万';
                        } else if (this.value >= 1000000 && this.value < Math.pow(10, 8)) {
                            val = this.value / 1000000 + '百万';
                        } else if (this.value >= Math.pow(10, 8)) {
                            val = this.value / 100000000 + '亿';
                        }
                        if (this.value <= -1000 && this.value > -10000) {
                            val = this.value / 1000 + '千';
                        } else if (this.value <= -10000 && this.value > -1000000) {
                            val = this.value / 10000 + '万';
                        } else if (this.value <= -1000000 && this.value > -Math.pow(10, 8)) {
                            val = this.value / 1000000 + '百万';
                        } else if (this.value <= -Math.pow(10, 8)) {
                            val = this.value / 100000000 + '亿';
                        }
                        return val;
                    }
                },
                opposite: true,
                title: {
                    text: '当日盈亏'
                },
                top: '52%',
                height: '22%',
                offset: 0,
                lineWidth: 0
            },
            {
                minorTickInterval: 'auto',
                minorTickLength: 10,
                labels: {
                    align: 'right',
                    x: -3,
                    formatter: function () {
                        let val = this.value;
                        if (this.value >= 1000 && this.value < 10000) {
                            val = this.value / 1000 + '千';
                        } else if (this.value >= 10000 && this.value < 1000000) {
                            val = this.value / 10000 + '万';
                        } else if (this.value >= 1000000 && this.value < Math.pow(10, 8)) {
                            val = this.value / 1000000 + '百万';
                        } else if (this.value >= Math.pow(10, 8)) {
                            val = this.value / 100000000 + '亿';
                        }
                        if (this.value <= -1000 && this.value > -10000) {
                            val = this.value / 1000 + '千';
                        } else if (this.value <= -10000 && this.value > -1000000) {
                            val = this.value / 10000 + '万';
                        } else if (this.value <= -1000000 && this.value > -Math.pow(10, 8)) {
                            val = this.value / 1000000 + '百万';
                        } else if (this.value <= -Math.pow(10, 8)) {
                            val = this.value / 100000000 + '亿';
                        }
                        return val;
                    }
                },
                opposite: true,
                title: {
                    text: '当日买卖'
                },
                top: '78%',
                height: '22%',
                offset: 0,
                lineWidth: 0
            }
        ],
        seriesArray: [
            {
                type: 'spline',
                name: baseData.incomeList1.name,
                data: baseData.incomeList1.data,
                dataGrouping: {
                    units: groupingUnits
                },
                tooltip: {
                    valueSuffix: '%'
                }
            },
            {
                type: 'areaspline',
                name: baseData.incomeList2.name,
                data: baseData.incomeList2.data,
                dataGrouping: {
                    units: groupingUnits
                },
                tooltip: {
                    valueSuffix: '%'
                }
            },
            {
                type: 'column',
                name: baseData.totalDayProfitList1.name,
                data: baseData.totalDayProfitList1.data,
                yAxis: 2,
                //color: '',
                dataGrouping: {
                    units: groupingUnits
                },
                tooltip: {
                    valuePrefix: '￥',
                    valueSuffix: '元'
                }
            },
            {
                type: 'column',
                name: baseData.totalDayProfitList2.name,
                data: baseData.totalDayProfitList2.data,
                yAxis: 2,
                dataGrouping: {
                    units: groupingUnits
                },
                tooltip: {
                    valuePrefix: '￥',
                    valueSuffix: '元'
                }
            },
            {
                type: 'column',
                name: baseData.transactionList1.name,
                data: baseData.transactionList1.data,
                yAxis: 3,
                dataGrouping: {
                    units: groupingUnits
                },
                tooltip: {
                    valuePrefix: '￥',
                    valueSuffix: '元'
                }
            },
            {
                type: 'column',
                name: baseData.transactionList2.name,
                data: baseData.transactionList2.data,
                yAxis: 3,
                dataGrouping: {
                    units: groupingUnits
                },
                tooltip: {
                    valuePrefix: '￥',
                    valueSuffix: '元'
                }
            }
        ]
    };
    if (customerList) {
        chartConfig.yAxis.push({
            minorTickInterval: 'auto',
            minorTickLength: 10,
            labels: {
                align: 'right',
                x: -30
            },
            opposite: true,
            //title: {
            //    text: '自定义'
            //},
            top: '26%',
            height: '22%',
            lineWidth: 0,
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        });
        for (let i in customerList) {
            let series = {
                type: 'spline',
                name: customerList[i].name,
                data: customerList[i].data,
                yAxis: 1,
                dataGrouping: {
                    units: groupingUnits
                },
                tooltip: {
                    valueSuffix: ''
                }
            };
            chartConfig.seriesArray.push(series);
        }
    }

    HighChartsUtil.initCharts(chartConfig);
};

let initHighCharts = function (opt) {
    let cntId = opt.container;
    Highcharts.setOptions({
        global: {
            timezoneOffset: (new Date()).getTimezoneOffset(),
            useUTC: false
        },
        exporting: {
            enabled: false
        },
        lang: {
            weekdays: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
            shortMonths: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            printChart: '打印图表',
            downloadPNG: '下载JPEG 图片',
            downloadJPEG: '下载JPEG文档',
            downloadPDF: '下载PDF 图片',
            downloadSVG: '下载SVG 矢量图',
            contextButtonTitle: '下载图片',
            rangeSelectorZoom: '缩放',
            rangeSelectorFrom: '从',
            rangeSelectorTo: '到'
        }
    });

    $('#' + cntId).highcharts('StockChart', {
        rangeSelector: {
            buttons: [{//定义一组buttons,下标从0开始
                type: 'week',
                count: 1,
                text: '1周'
            }, {
                type: 'month',
                count: 1,
                text: '1月'
            }, {
                type: 'month',
                count: 3,
                text: '3月'
            }, {
                type: 'month',
                count: 6,
                text: '6月'
            }, {
                type: 'year',
                count: 1,
                text: '1年'
            }, {
                type: 'all',
                text: '全部'
            }],
            buttonTheme: {
                width: 36,
                height: 16,
                padding: 1,
                r: 0,
                stroke: '#68A',
                zIndex: 7
            },
            selected: 6,
            inputDateFormat: '%Y-%m-%d',
            inputEditDateFormat: '%Y-%m-%d'
        },

        title: {
            text: ''
        },

        plotOptions: {
            series: {
                marker: {
                    states: {
                        hover: {
                            radiusPlus: 0,
                            lineWidthPlus: 1,
                            lineColor: "#fff",
                            radius: 5
                        }
                    }, symbol: "circle"
                }, states: { hover: { radiusPlus: 0, lineWidthPlus: 0, halo: { size: 0 } } }
            },
            spline: {
                fillOpacity: 0.15,
                dataGrouping: {
                    // groupPixelWidth: 5,
                    enabled: false
                },
                softThreshold: !1
            },
            areaspline: {
                fillOpacity: 0.15,
                dataGrouping: {
                    // groupPixelWidth: 5,
                    enabled: false
                },
                softThreshold: !1
            },
            line: {
                turboThreshold: Number.MAX_VALUE,
                dataGrouping: {
                    // groupPixelWidth: 10,
                    enabled: false
                },
                connectNulls: !0,
                lineWidth: 1.2,
                states: {
                    hover: { lineWidth: 0.2 }
                }
            },
            column: {
                turboThreshold: Number.MAX_VALUE,
                dataLabels: {
                    y: 10
                },
                dataGrouping: {
                    // groupPixelWidth: 10,
                    enabled: false
                }
            }
        },
        navigator: {
            enabled: true,
            adaptToUpdatedData: false,
            margin: 0,
            height: 30,
            series: { color: "#fff", lineWidth: 0 }
        },
        credits: { enabled: false },
        colors: ["#994A4D", "#4C71A9", "#e74c3c", "#2ecc71", "#34495e", "#3498db", "#e67e22", "#95a5a6"],
        tooltip: {
            backgroundColor: { linearGradient: [0, 0, 0, 60], stops: [[0, "#FFFFFF"], [1, "#E0E0E0"]] },
            useHTML: true,
            borderRadius: 10,
            crosshairs: [true, false],
            xDateFormat: "%Y-%m-%d %H:%M:%S",
            valueDecimals: 2
        },
        scrollbar: { enabled: false, height: 0 },
        xAxis: opt.xAxis,
        yAxis: opt.yAxis,

        series: opt.seriesArray
    });
};

export default highchartsUtil;