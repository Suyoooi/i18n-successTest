import { CHART_REFRESH_MODE_MANUAL, CHART_TIME_RANGE_ABSOLUTE, IN_BYTE_RATE, IN_MSG_RATE, OUT_BYTE_RATE, OUT_MSG_RATE, chartShiftThreshold, timeRangeOptions } from "@/data/monitor/chartConstants";
import { reqQueueType, resTpsType } from "./queueSaga";
import { MonitorQueueState } from "./reducer";

function GetChartData(data: any[]) {
    if (!data || data.length === 0) return null;

    const queueNames = data.map((item: any) => item.queueName);
    const chartDataDic: any = {};

    let dataFirstLabel = Number.MAX_VALUE;
    let dataLastLabel = 0;
    data.forEach((item: any, index) => {
        dataFirstLabel = (dataFirstLabel > item.label[0]) ? item.label[0] : dataFirstLabel;
        dataLastLabel = (item.label.length > 0 && item.label.at(-1) > dataLastLabel) ? item.label.at(-1) : dataLastLabel;
        item.metrics.forEach((metric: any) => {
            const chartData = Array.from({ length: item.label.length }, (_, tIndex) => [item.label[tIndex], metric.values[tIndex]])
            if (metric.type in chartDataDic) {
                chartDataDic[metric.type].push(chartData);
            } else {
                chartDataDic[metric.type] = [chartData];
            }
        })
    });

    return {
        dataFirstLabel: dataFirstLabel,
        dataLastLabel: dataLastLabel,
        queueNames: queueNames,
        dataDic: chartDataDic,
    }
}

export function TpsWork(reqParams: reqQueueType, refreshMode: string, state: MonitorQueueState, response: any) : resTpsType|null {
    if(!response) return null;
    const metricData = GetChartData(response);
    const tpsState = state;

    if (refreshMode === CHART_REFRESH_MODE_MANUAL) {
        if (metricData) {
            return {
                minLabel: reqParams.sTime,
                lastLabel: reqParams.eTime,
                dataFirstLabel: metricData.dataFirstLabel,
                dataLastLabel: metricData.dataLastLabel,
                queueNames: metricData.queueNames,
                tpsInDatas: (IN_MSG_RATE in metricData.dataDic) ? metricData.dataDic[IN_MSG_RATE] : metricData.dataDic[IN_BYTE_RATE],
                tpsOutDatas: (OUT_MSG_RATE in metricData.dataDic) ? metricData.dataDic[OUT_MSG_RATE] : metricData.dataDic[OUT_BYTE_RATE],
            }
        } else {
            return null;
        }

    } else {
        const tpsInData = (metricData) ? ((IN_MSG_RATE in metricData.dataDic) ? metricData.dataDic[IN_MSG_RATE] : metricData.dataDic[IN_BYTE_RATE]) : null;
        const tpsOutData = (metricData) ? ((OUT_MSG_RATE in metricData.dataDic) ? metricData.dataDic[OUT_MSG_RATE] : metricData.dataDic[OUT_BYTE_RATE]) : null;
        const mergedState: resTpsType = {
            minLabel: reqParams.eTime - (timeRangeOptions[tpsState.timeRange.relative].value ?? timeRangeOptions[0].value),
            lastLabel: reqParams.eTime,
            dataFirstLabel: metricData?.dataFirstLabel ?? Number.MAX_VALUE,
            dataLastLabel: (metricData && metricData.dataLastLabel > 0)? metricData.dataLastLabel : tpsState.tpsData.dataLastLabel,
            queueNames: (metricData) ? metricData.queueNames : tpsState.tpsData.queueNames,
            tpsInDatas: [],
            tpsOutDatas: []
        }
        const shiftThreshold = mergedState.minLabel - chartShiftThreshold;

        if (tpsState.tpsData.tpsInDatas[0] && tpsState.tpsData.tpsInDatas[0].length > 0) {
            tpsState.tpsData.tpsInDatas.forEach((queue: number[][], qIndex: number) => {
                let index = 0;
                let shiftCount = 0;
                while (queue[index] && queue[index].length > 0 && queue[index++][0] < shiftThreshold) {
                    shiftCount++;
                }
                // [[[1,2],[2,3]],[[1,2],[3,4]]]
                if (tpsInData && tpsInData[qIndex] && tpsInData[qIndex].length > 0) {
                    if(shiftCount > 0) {
                        mergedState.tpsInDatas[qIndex] = [...queue.slice(shiftCount, queue.length), ...tpsInData[qIndex]];
                    }else{
                        mergedState.tpsInDatas[qIndex] = [...queue, ...tpsInData[qIndex]];
                    }
                } else {
                    if (shiftCount > 0) {
                        mergedState.tpsInDatas[qIndex] = [...queue.slice(shiftCount, queue.length)];
                    } else {
                        mergedState.tpsInDatas[qIndex] = queue;
                    }
                }
                mergedState.dataFirstLabel = (mergedState.tpsInDatas[qIndex].length > 0 && mergedState.tpsInDatas[qIndex][0][0] < mergedState.dataFirstLabel)? mergedState.tpsInDatas[qIndex][0][0] : mergedState.dataFirstLabel;
            })
        } else {
            if (tpsInData) {
                mergedState.tpsInDatas = tpsInData;
            } else {
                return null;  // 데이터가 없는 상태로 보자.
            }
        }


        if (tpsState.tpsData.tpsOutDatas[0] && tpsState.tpsData.tpsOutDatas[0].length > 0) {
            tpsState.tpsData.tpsOutDatas.forEach((queue: number[][], qIndex: number) => {
                let index = 0;
                let shiftCount = 0;
                while (queue[index] && queue[index].length > 0 && queue[index++][0] < shiftThreshold) {
                    shiftCount++;
                }
                if (tpsOutData && tpsOutData[qIndex] && tpsOutData[qIndex].length > 0) {
                    if(shiftCount > 0) {
                        mergedState.tpsOutDatas[qIndex] = [...queue.slice(shiftCount, queue.length), ...tpsOutData[qIndex]];
                    }else{
                        mergedState.tpsOutDatas[qIndex] = [...queue, ...tpsOutData[qIndex]];
                    }
                } else {
                    if (shiftCount > 0) {
                        mergedState.tpsOutDatas[qIndex] = [...queue.slice(shiftCount, queue.length)];
                    } else {
                        mergedState.tpsOutDatas[qIndex] = queue;
                    }
                }
                mergedState.dataFirstLabel = (mergedState.tpsOutDatas[qIndex].length > 0 && mergedState.tpsOutDatas[qIndex][0][0] < mergedState.dataFirstLabel)? mergedState.tpsOutDatas[qIndex][0][0] : mergedState.dataFirstLabel;
            })
        } else {
            if (tpsOutData) {
                mergedState.tpsOutDatas = tpsOutData;
                return mergedState;
            } else {
                return null;
            }
        }

        return mergedState;
    }


}