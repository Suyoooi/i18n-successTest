export const FEATURE_CHART_CHECKRANGE = true;

import { RES_CHART_CONNECTION_TITLE, RES_CHART_PENDING_TITLE, RES_CHART_THROUGHPUT_TITLE, RES_CHART_TITLE_CPU_USAGE, RES_CHART_TITLE_DISK_USAGE, RES_CHART_TITLE_MEMORY_USAGE, RES_CHART_TITLE_NETWORK_USAGE } from "./resources";

export const CHART_DATA_MODE_COUNT = 'count';
export const CHART_DATA_MODE_BYTES = 'bytes';

export const CHART_REFRESH_MODE_MANUAL = 'manual';
export const CHART_REFRESH_MODE_REALTIME = 'realtime';

export const CHART_TIME_RANGE_ABSOLUTE = 'absolute';
export const CHART_TIME_RANGE_RELATIVE = 'relative';

export const PENDING_CNT = "pendMsgCnt";
export const PENDING_SIZE = "pendMsgSize";
export const IN_MSG_RATE = "inMsgRate";
export const IN_BYTE_RATE = "inByteRate";
export const OUT_MSG_RATE = "outMsgRate";
export const OUT_BYTE_RATE = "outByteRate";

/* x-axis time range */
export const timeRangeOptions = [
    { value: 5 * 60 * 1000, label: 'last 5 minutes' },
    { value: 15 * 60 * 1000, label: 'last 15 minutes' },
    { value: 30 * 60 * 1000, label: 'last 30 minutes' },
    { value: 1 * 3600 * 1000, label: 'last 1 hour' },
    { value: 3 * 3600 * 1000, label: 'last 3 hours' },
    { value: 6 * 3600 * 1000, label: 'last 6 hours' },
    { value: 12 * 3600 * 1000, label: 'last 12 hours' },
    { value: 24 * 3600 * 1000, label: 'last 24 hours' },
    { value: 2 * 86400 * 1000, label: 'last 2 days' },
    { value: 7 * 86400 * 1000, label: 'last 7 days' }
];

export const refreshOptions = [
    { value: 0, label: 'off' },
    // { value: 1 * 1000, label: '1s' }, //temporary 
    { value: 5 * 1000, label: '5s' },
    // { value: 10 * 1000, label: '10s' },
    { value: 20 * 1000, label: '20s' },
    { value: 1 * 60 * 1000, label: '1m' },
    { value: 5 * 60 * 1000, label: '5m' },
    { value: 15 * 60 * 1000, label: '15m' },
    { value: 30 * 60 * 1000, label: '30m' },
    { value: 3600 * 1000, label: '1h' },
    { value: 2 * 3600 * 1000, label: '2h' },
    { value: 86400 * 1000, label: '1d' }
];

/* display queue types*/
export const queuesOptions = [
    // { value: `${(props.queues)? props.queues.join(','): ''}`, sort: 'ASC', label: `${(props.queues)? props.queues.join(',') : 'choice types...'}` },
    { value: '', sort: 'ASC', label: 'Choose types...' },
    { value: 'manual', sort: 'DESC', label: 'Select Monitoring Queues' },
    { value: 'pendMsgCnt', sort: 'DESC', label: 'Top5. Pending Queues' },
    { value: 'inMsgRate', sort: 'DESC', label: 'Top5. 60s High Message In Rate' },
    { value: 'inMsgRate', sort: 'ASC', label: 'Top5. 60s Low Message In Rate' },
    { value: 'outMsgRate', sort: 'DESC', label: 'Top5. 60s High Message Out Rate' },
    { value: 'outMsgRate', sort: 'ASC', label: 'Top5. 60s Low Message Out Rate' },
];

export const dataSourceType = {
    PENDING: "pending",
    THROUGHPUT: "throughput",
    CONNECTION: "connection",
    CPU_USAGE: "cpuUsage",
    DISK_USAGE: "diskUsage",
    MEMORY_USAGE: "memoryUsage",
    NETWORK_USAGE: "networkUsage",
    DISK_STATUS: "diskStatus",
    CPU_STATUS: "cpuStatus",
    MEMORY_STATUS: "memStatus"
};

export const monitorOptions = [
    { value: dataSourceType.PENDING, label: RES_CHART_PENDING_TITLE },
    { value: dataSourceType.THROUGHPUT, label: RES_CHART_THROUGHPUT_TITLE },
    { value: dataSourceType.CONNECTION, label: RES_CHART_CONNECTION_TITLE },
    { value: dataSourceType.CPU_USAGE, label: RES_CHART_TITLE_CPU_USAGE },
    { value: dataSourceType.DISK_USAGE, label: RES_CHART_TITLE_DISK_USAGE },
    { value: dataSourceType.MEMORY_USAGE, label: RES_CHART_TITLE_MEMORY_USAGE },
    { value: dataSourceType.NETWORK_USAGE, label: RES_CHART_TITLE_NETWORK_USAGE},
];

export const ENABLE_MARKAREA = true;
export const defaultMarkArea = {
  silent: true,
  data: [],
  itemStyle: {
    color: 'rgba(255,230,204,0.3)',
    borderColor: 'orange',
  },
  label: {
    show: false,
    // formatter: '{start} - {end}'
  }
};

export const chartReloadThreshold = 1000*2;
export const chartShiftThreshold = 0;//1000*60*60;

export const ChartRedColor = "#DE0202"
export const ChartOrangeColor = "#E7B400"
export const ChartYellowColor = "#FFE70D"
export const ChartGreenColor = "#03C75A"
export const ChartGrayColor = '#4C4C4C'
export const ChartGrayFontColor = "#A2A4A9"

// export const GaugeDangerColor = 'rgba(255,0,0,0.5)';
// export const GaugeSafetyColor = 'rgba(0,255,0,0.5)';
// export const GaugeCautionColor = 'rgba(255,165,0,0.5)';
// export const GaugeRemainColor = 'rgba(192,192,192,0.5)';
export const GaugeDangerColor = ChartRedColor
export const GaugeCautionColor = ChartOrangeColor;
export const GaugeSafetyColor = ChartGreenColor;
export const GaugeRemainColor = ChartGrayColor;
// export const GaugePadColor = ChartGrayColor;
export const GaugePadColor = 'rgba(255,255,255,0.5)';

export const defaultChartColor = ["#2E64E0","#3B8342","#9FCC2E","#F16F62","#FA9F1B","#03A9F4", "#98A3B0","#516C98","#394A68","#57617B","#FF6384","#35CABC","#FFE70D","#EA916A","#D2649D","#BF9BDE","#74D1EA","#00B796","#5DBE66","#686DE3"];
// export const chartLegendDisabledColor = 'rgba(80,80,80,0.5)';
export const chartLegendEnabledColor = '#DFDFDF';
export const chartLegendDisabledColor = '#686868';

