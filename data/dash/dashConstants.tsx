export const HA_HOST_PRIMARY = 'primary'
export const HA_HOST_SECONDARY = 'secondary'

// export const HOST_STATUS_ACTIVE = 'active'
// export const HOST_STATUS_STANDBY = 'standby'
export const HOST_STATUS_ALIVE = 'alive'
export const HOST_STATUS_DEAD = 'dead'

export const ALERT_DATA_ANOMALY = 'anomaly'
export const ALERT_DATA_FAILURE = 'failure'
export const ALERT_DATA_EXCEPTION = 'exception'

export const ALERT_LEVEL_CRITICAL = 'CRI'
export const ALERT_LEVEL_MAJOR = 'MAJ'
export const ALERT_LEVEL_MINOR = 'MIN'

export const TableHeight = 150;
export const TableRowHeight = 30;

export const AlertChartRedColor = "#DE0202"
export const AlertChartOrangeColor = "#FF800C"
export const AlertChartYellowColor = "#FFE70D"
export const AlertChartGreenColor = "#03C75A"
export const AlertChartGrayFontColor = "#A2A4A9"

export const getTimeString = (value: any) => {
    const dateTime: Date = (typeof value === 'number') ? new Date(value) : new Date(Number(value));
    const hours = dateTime.getHours().toString().padStart(2, "0");
    const minutes = dateTime.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
}

export const defaultChartOption = {
    animation: false,
    legend: {
        show: false,
        selectedMode: false
    },
    grid: {
        left: '2%',
        right: '2%',
        bottom: '5%',
        top: '5%',
        containLabel: true
    },
    xAxis: {
        animation: false,
        type: 'time',
        boundaryGap: false,
        axisLabel: {
            formatter: (value: number) => {
                return (`${getTimeString(value)}`);
            },
            fontSize: 10,
        },
        axisLine: {
            lineStyle: {
                color: '#858d98'
            },
        },
        splitNumber: 12, // but max is controlled by echarts.
    },
    yAxis: {
        animation: false,
        type: 'value',
        smooth: true,
        axisLabel: {
            fontSize: 10,
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
        itemStyle: {
            borderColor: `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`,
            borderWidth: 2,
        }
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'line' // 'shadow' as default; can also be 'line' or 'shadow'
        },
        order: 'seriesDesc'
    },
    series: []
};

