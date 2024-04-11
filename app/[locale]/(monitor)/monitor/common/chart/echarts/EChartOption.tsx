import { ChartGrayFontColor, chartLegendDisabledColor, chartLegendEnabledColor } from "@/data/monitor/chartConstants";
import { GetChartLabelString } from "@/data/monitor/chartUtils";

interface ChartOption {
    chartType : string,
    stackMode ?: boolean,
    zoomDrag?: boolean,
    chartTitle?: string,
    legendPos?: string,
    colors?: string[],
    yFormatter?: (value:number,index:number) => string,
}

const EChartOption = (chartOption: ChartOption) => {
    return {
        chartType: chartOption.chartType,
        stackMode: chartOption.stackMode ?? false,
        zoomDrag: chartOption.zoomDrag ?? false,
        chartTitle: chartOption.chartTitle,
        option : {
            animation: false,
            color: chartOption.colors ?? undefined,
            grid: {
                left: '2%',
                right: (chartOption.legendPos && chartOption.legendPos === 'right') ? '15%' : '3%',
                bottom: (chartOption.legendPos && chartOption.legendPos === 'right') ? '3%' : '10%',
                top: '14%',
                containLabel: true 
            },
            xAxis: {
                animation: false,
                type: 'time',
                boundaryGap: false,
                axisLabel: {
                    formatter: (value: number) => { 
                        return (`${GetChartLabelString(value)}`);
                    },
                    fontSize:10,
                    color: ChartGrayFontColor,
                },
                axisLine: {
                    lineStyle: {
                        color: '#858d98'
                    },
                },
                splitNumber: 5, // but max is controlled by echarts.
            },
            yAxis: {
                animation: false,
                type: 'value',
                smooth: true,
                sampling: 'average', //check this
                axisLabel: {
                    fontSize:10,
                    formatter: chartOption.yFormatter,
                    color: ChartGrayFontColor,
                },
                splitLine: {
                    lineStyle: {
                        color: "rgba(133, 141, 152, 0.1)"
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#858d98'
                    },
                },
            },
            series: [], 
            legend: (chartOption.legendPos && chartOption.legendPos === 'right') ? {
                show: false,
                orient: 'vertical',
                top: 'center',
                right: 2,
                inactiveColor: chartLegendDisabledColor,
                textStyle: {
                    fontSize: 12,
                    color: chartLegendEnabledColor,
                },
                icon: "roundRect",
                itemWidth: 20,
                itemHeight: 12,
                formatter: function (name: string) {
                    return name.length > 20 ? name.slice(0, 20) + "..." : name;
                },
                data: [],
            } : { 
                show: false,
                type: 'scroll',
                pageIconColor: chartLegendEnabledColor,
                pageIconInactiveColor: chartLegendDisabledColor,
                left: 'center',
                inactiveColor: chartLegendDisabledColor,
                textStyle: {
                    fontSize: 10,
                    color: chartLegendEnabledColor,
                },
                bottom: '0%',
                icon: "roundRect",
                itemWidth: 15,
                itemHeight: 10,
                data: [],
            },
            title: {
                show: (chartOption.chartTitle)? true : false,
                text: (chartOption.chartTitle)? `  ${chartOption.chartTitle}` : undefined,
                textStyle: {
                    // fontFamily: 'Inter, sans-serif',
                    fontSize: 12,
                    color: "#F8F8F8",
                },
                top: '0%'
            },
            dataZoom: [
                {
                    show: true,
                    type: 'inside',
                    // filterMode: 'none',
                    filterMode: 'filter',
                    xAxisIndex: [0],
                    throttle: 50,
                    zoomOnMouseWheel: 'ctrl', 
                }
            ],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'line' // 'shadow' as default; can also be 'line' or 'shadow'
                },
            },
            toolbox: (chartOption.zoomDrag) ? {
                orient: 'vertical',
                itemSize: 13,
                top: 15,
                right: -6,
                feature: {
                    // hack for zoom-drag.
                    dataZoom: {
                        yAxisIndex: 'none',
                        icon: {
                            zoom: 'path://', // hack to remove zoom button
                            back: 'path://', // hack to remove restore button
                        },
                    },
                    restore: {
                        icon: 'path://'
                    }
                },
            }: undefined,
        } ,
    };
};
export default EChartOption;
