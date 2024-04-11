import { CHART_REFRESH_MODE_MANUAL, CHART_TIME_RANGE_ABSOLUTE, chartShiftThreshold, timeRangeOptions } from "@/data/monitor/chartConstants";
import { reqClientType, resClientType } from "./clientSata";
import { MonitorClientState } from "./reducer";

function GetChartData(data: any) {
    if (!data || data.length === 0) return null;

    let dataFirstLabel = Number.MAX_VALUE;
    let dataLastLabel = 0;
    const clientNames: string[] = [];
    const chartDataDic: any = {};

    dataFirstLabel = (dataFirstLabel === 0 || dataFirstLabel > data.label[0]) ? data.label[0] : dataFirstLabel;
    dataLastLabel = (data.label.length > 0 && data.label.at(-1) > dataLastLabel) ? data.label.at(-1) : dataLastLabel;
    data.metrics.forEach((metric: any) => {
        const chartData = Array.from({ length: data.label.length }, (_, tIndex) => [data.label[tIndex], metric.values[tIndex]])
        clientNames.push(metric.category);
        chartDataDic[metric.category] = chartData;
    })

    return {
        dataFirstLabel: dataFirstLabel,
        dataLastLabel: dataLastLabel,
        clientNames: clientNames,
        dataDic: chartDataDic, // category -> [[1,2], [2,3]]
    }
}

export function ClientDataWork(reqParmas: reqClientType, refreshMode: string, state: MonitorClientState, response: any) : resClientType|null {
    if(!response) return null;
    const metricData = GetChartData(response);
    const clientState = state;
    if (refreshMode === CHART_REFRESH_MODE_MANUAL) {
        if (metricData) {
            return {
                minLabel: reqParmas.sTime,
                lastLabel: reqParmas.eTime,
                dataFirstLabel: metricData.dataFirstLabel,
                dataLastLabel: metricData.dataLastLabel,
                clientNames: metricData.clientNames,
                datas: Array.from({ length: metricData.clientNames.length }, (_, index) => metricData.dataDic[metricData.clientNames[index]]),
            }
        } else {
            return null;
        }
    } else {
        const mergedState: resClientType = {
            minLabel: reqParmas.eTime - (timeRangeOptions[clientState.timeRange.relative].value ?? timeRangeOptions[0].value),
            lastLabel: reqParmas.eTime,
            dataFirstLabel: metricData?.dataFirstLabel ?? Number.MAX_VALUE,
            dataLastLabel: (metricData && metricData.dataLastLabel > 0)? metricData.dataLastLabel : clientState.clientData.dataLastLabel,
            clientNames: (metricData) ? metricData.clientNames : clientState.clientData.clientNames,
            datas: []
        }
        if (clientState.clientData.datas[0] && clientState.clientData.datas[0].length > 0) {
            const shiftThreshold = mergedState.minLabel - chartShiftThreshold;
            clientState.clientData.datas.forEach((queue: number[][], qIndex: number) => {
                let shiftCount = 0;
                let index = 0;
                while (queue[index] && queue[index].length > 0 && queue[index++][0] < shiftThreshold) {
                    shiftCount++;
                }
                const clientChartData = metricData?.dataDic[metricData?.clientNames[qIndex]] ?? null;
                if (clientChartData && clientChartData.length > 0) {
                    if(shiftCount > 0) {
                        mergedState.datas[qIndex] = [...queue.slice(shiftCount, queue.length), ...clientChartData]
                    } else {
                        mergedState.datas[qIndex] = [...queue, ...clientChartData];
                    }
                } else {
                    if (shiftCount > 0) {
                        mergedState.datas[qIndex] = [...queue.slice(shiftCount, queue.length)];
                    } else {
                        mergedState.datas[qIndex] = queue;
                    }
                }
                mergedState.dataFirstLabel = (mergedState.datas[qIndex].length > 0 && mergedState.datas[qIndex][0][0] < mergedState.dataFirstLabel)? mergedState.datas[qIndex][0][0] : mergedState.dataFirstLabel;
            })

        } else {
            if (metricData) {
                mergedState.datas = Array.from({ length: metricData.clientNames.length }, (_, index) => metricData.dataDic[metricData.clientNames[index]]);
                return mergedState;
            } else {
                return null;
            }
        }

        return mergedState;
    }

}