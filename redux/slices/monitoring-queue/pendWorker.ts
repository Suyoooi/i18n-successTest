import { CHART_REFRESH_MODE_MANUAL, CHART_TIME_RANGE_ABSOLUTE, IN_BYTE_RATE, IN_MSG_RATE, OUT_BYTE_RATE, OUT_MSG_RATE, PENDING_CNT, PENDING_SIZE, chartShiftThreshold, timeRangeOptions } from "@/data/monitor/chartConstants";
import { reqQueueType, resPendType } from "./queueSaga";
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


export function PendWork(reqParams: reqQueueType, refreshMode: string, state: MonitorQueueState, response: any) : resPendType | null {
  if (!response) return null;
  const metricData = GetChartData(response);
  const pendState = state;

  if (refreshMode === CHART_REFRESH_MODE_MANUAL) {
    if (metricData) {
      return {
        minLabel: reqParams.sTime,
        lastLabel: reqParams.eTime,
        dataFirstLabel: metricData.dataFirstLabel,
        dataLastLabel: metricData.dataLastLabel,
        queueNames: metricData.queueNames,
        datas: (PENDING_CNT in metricData.dataDic) ? metricData.dataDic[PENDING_CNT] : metricData.dataDic[PENDING_SIZE]
      }
    } else {
      return null;
    }

  } else {
    const pendingData = (metricData) ? ((PENDING_CNT in metricData.dataDic) ? metricData.dataDic[PENDING_CNT] : metricData.dataDic[PENDING_SIZE]) : null;
    const mergedState: resPendType = {
      minLabel: reqParams.eTime - (timeRangeOptions[pendState.timeRange.relative].value ?? timeRangeOptions[0].value),
      lastLabel: reqParams.eTime,
      dataFirstLabel: metricData?.dataFirstLabel ?? Number.MAX_VALUE,
      dataLastLabel: (metricData && metricData.dataLastLabel > 0) ? metricData.dataLastLabel : pendState.pendingData.dataLastLabel,
      queueNames: (metricData) ? metricData.queueNames : pendState.pendingData.queueNames,
      datas: []
    }

    if (pendState.pendingData.datas[0] && pendState.pendingData.datas[0].length > 0) {
      const shiftThreshold = mergedState.minLabel - chartShiftThreshold;
      pendState.pendingData.datas.forEach((queue: number[][], qIndex: number) => {
        let index = 0;
        let shiftCount = 0;
        while (queue[index] && queue[index].length > 0 && queue[index++][0] < shiftThreshold) {
          shiftCount++;
        }
        // [[[1,2],[2,3]],[[1,2],[3,4]]]
        if (pendingData && pendingData[qIndex] && pendingData[qIndex].length > 0) {
          if(shiftCount > 0) {
            mergedState.datas[qIndex] = [...queue.slice(shiftCount, queue.length), ...pendingData[qIndex]];
          }else{
            mergedState.datas[qIndex] = [...queue, ...pendingData[qIndex]];
          }
        } else {
          if (shiftCount > 0) {
            mergedState.datas[qIndex] = [...queue.slice(shiftCount, queue.length)];
          } else {
            mergedState.datas[qIndex] = queue;
          }
        }
        mergedState.dataFirstLabel = (mergedState.datas[qIndex].length > 0 && mergedState.datas[qIndex][0][0] < mergedState.dataFirstLabel) ? mergedState.datas[qIndex][0][0] : mergedState.dataFirstLabel;
      })
    } else {
      if (metricData) {
        mergedState.datas = pendingData;
        return mergedState;
      } else {
        return null;
      }
    }

    return mergedState;
  }

};