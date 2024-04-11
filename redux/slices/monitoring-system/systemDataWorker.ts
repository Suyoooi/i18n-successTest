import { CHART_REFRESH_MODE_MANUAL, CHART_TIME_RANGE_ABSOLUTE, chartShiftThreshold, timeRangeOptions } from "@/data/monitor/chartConstants";
import { reqSystemType, resSystemDataType } from "./systemSaga";
import { MonitorSystemState } from "./reducer";

function GetChartData(data: any) {
  if (!data || data.length === 0) return null;

  const chartDataDic: any = {};

  let dataFirstLabel = (data.label.length) ? data.label[0] : Number.MAX_VALUE;
  let dataLastLabel = (data.label.length > 0 && data.label.at(-1) > 0) ? data.label.at(-1) : 0;
  chartDataDic["cpuUsages"] = Array.from({ length: data.label.length }, (_, tIndex) => [data.label[tIndex], data.cpuUsage[tIndex]])
  chartDataDic["memoryUsed"] = Array.from({ length: data.label.length }, (_, tIndex) => [data.label[tIndex], data.memoryUsed[tIndex]])
  chartDataDic["diskIO_in"] = Array.from({ length: data.label.length }, (_, tIndex) => [data.label[tIndex], data.diskRead[tIndex]])
  chartDataDic["diskIO_out"] = Array.from({ length: data.label.length }, (_, tIndex) => [data.label[tIndex], data.diskWrite[tIndex]])
  chartDataDic["networkIO_in"] = Array.from({ length: data.label.length }, (_, tIndex) => [data.label[tIndex], data.networkRead[tIndex]])
  chartDataDic["networkIO_out"] = Array.from({ length: data.label.length }, (_, tIndex) => [data.label[tIndex], data.networkWrite[tIndex]])

  return {
    coreCount: data.coreCount,
    memorySize: data.memorySize,
    dataFirstLabel: dataFirstLabel,
    dataLastLabel: dataLastLabel,
    dataDic: chartDataDic,
  }
}

export function SystemDataWork(reqParams: reqSystemType, refreshMode: string, state: MonitorSystemState, response: any) : resSystemDataType|null {
  if (!response) return null;
  const metricData = GetChartData(response);
  const systemState = state;

  const cpuUsages = (metricData) ? metricData.dataDic['cpuUsages'] : [];
  const memoryUsed = (metricData) ? metricData.dataDic['memoryUsed'] : [];
  const diskIO_in = (metricData) ? metricData.dataDic['diskIO_in'] : [];
  const diskIO_out = (metricData) ? metricData.dataDic['diskIO_out'] : [];
  const networkIO_in = (metricData) ? metricData.dataDic['networkIO_in'] : [];
  const networkIO_out = (metricData) ? metricData.dataDic['networkIO_out'] : [];

  if (refreshMode === CHART_REFRESH_MODE_MANUAL) {
    if (metricData) {
      return {
        minLabel: reqParams.sTime,
        lastLabel: reqParams.eTime,
        dataFirstLabel: metricData.dataFirstLabel,
        dataLastLabel: metricData.dataLastLabel,
        coreCount: metricData.coreCount,
        memorySize: metricData.memorySize,
        cpuDatas: [cpuUsages],
        memDatas: [memoryUsed],
        diskIODatas: [diskIO_in, diskIO_out],
        networkIODatas: [networkIO_in, networkIO_out],
      }
    } else {
      return null;
    }

  } else {
    const mergedState: resSystemDataType = {
      minLabel: reqParams.eTime - (timeRangeOptions[systemState.timeRange.relative].value ?? timeRangeOptions[0].value),
      lastLabel: reqParams.eTime,
      dataFirstLabel: metricData?.dataFirstLabel ?? Number.MAX_VALUE,
      dataLastLabel: (metricData && metricData.dataLastLabel > 0) ? metricData.dataLastLabel : systemState.systemData.dataLastLabel,
      coreCount: (metricData) ? metricData.coreCount : systemState.systemData.coreCount,
      memorySize: (metricData) ? metricData.memorySize : systemState.systemData.memorySize,
      cpuDatas: [],
      memDatas: [],
      diskIODatas: [],
      networkIODatas: [],
    }
    const shiftThreshold = mergedState.minLabel - chartShiftThreshold;

    /* 모두 한꺼번에 가져오니 한번만 실행한다. */
    let shiftCount = 0;
    let index = 0;
    while (systemState.systemData.cpuDatas[0] && systemState.systemData.cpuDatas[0].length > 0 && systemState.systemData.cpuDatas[0][index++][0] < shiftThreshold) {
      shiftCount++;
    }

    if (systemState.systemData.cpuDatas[0]) {
      if (cpuUsages && cpuUsages.length > 0) {
        if(shiftCount > 0) {
          mergedState.cpuDatas = [[...systemState.systemData.cpuDatas[0].slice(shiftCount, systemState.systemData.cpuDatas[0].length), ...cpuUsages]];
        }else{
          mergedState.cpuDatas = [[...systemState.systemData.cpuDatas[0], ...cpuUsages]];
        }
      } else {
        if (shiftCount > 0) {
          mergedState.cpuDatas = [[...systemState.systemData.cpuDatas[0].slice(shiftCount, systemState.systemData.cpuDatas[0].length)]];
        } else {
          mergedState.cpuDatas = systemState.systemData.cpuDatas;
        }
      }
      mergedState.dataFirstLabel = (mergedState.cpuDatas[0].length > 0 && mergedState.cpuDatas[0][0][0] < mergedState.dataFirstLabel) ? mergedState.cpuDatas[0][0][0] : mergedState.dataFirstLabel;

      if (memoryUsed && memoryUsed.length > 0) {
        if(shiftCount > 0) {
          mergedState.memDatas = [[...systemState.systemData.memDatas[0].slice(shiftCount, systemState.systemData.memDatas[0].length), ...memoryUsed]];
        }else{
          mergedState.memDatas = [[...systemState.systemData.memDatas[0], ...memoryUsed]];
        }
      } else {
        if (shiftCount > 0) {
          mergedState.memDatas = [[...systemState.systemData.memDatas[0].slice(shiftCount, systemState.systemData.memDatas[0].length)]];
        } else {
          mergedState.memDatas = systemState.systemData.memDatas;
        }
      }
      mergedState.dataFirstLabel = (mergedState.memDatas[0].length > 0 && mergedState.memDatas[0][0][0] < mergedState.dataFirstLabel) ? mergedState.memDatas[0][0][0] : mergedState.dataFirstLabel;

      if (diskIO_in && diskIO_in.length > 0) {
        if(shiftCount > 0) {
          mergedState.diskIODatas[0] = [...systemState.systemData.diskIODatas[0].slice(shiftCount, systemState.systemData.diskIODatas[0].length), ...diskIO_in];
        }else{
          mergedState.diskIODatas[0] = [...systemState.systemData.diskIODatas[0], ...diskIO_in];
        }
      } else {
        if (shiftCount > 0) {
          mergedState.diskIODatas[0] = [...systemState.systemData.diskIODatas[0].slice(shiftCount, systemState.systemData.diskIODatas[0].length)];
        } else {
          mergedState.diskIODatas[0] = systemState.systemData.diskIODatas[0];
        }
      }
      mergedState.dataFirstLabel = (mergedState.diskIODatas[0].length > 0 && mergedState.diskIODatas[0][0][0] < mergedState.dataFirstLabel) ? mergedState.diskIODatas[0][0][0] : mergedState.dataFirstLabel;

      if (diskIO_out && diskIO_out.length > 0) {
        if(shiftCount > 0) {
          mergedState.diskIODatas[1] = [...systemState.systemData.diskIODatas[1].slice(shiftCount, systemState.systemData.diskIODatas[1].length), ...diskIO_out];
        }else{
          mergedState.diskIODatas[1] = [...systemState.systemData.diskIODatas[1], ...diskIO_out];
        }
      } else {
        if (shiftCount > 0) {
          mergedState.diskIODatas[1] = [...systemState.systemData.diskIODatas[1].slice(shiftCount, systemState.systemData.diskIODatas[1].length)];
        } else {
          mergedState.diskIODatas[1] = systemState.systemData.diskIODatas[1];
        }
      }
      mergedState.dataFirstLabel = (mergedState.diskIODatas[1].length > 0 && mergedState.diskIODatas[1][0][0] < mergedState.dataFirstLabel) ? mergedState.diskIODatas[1][0][0] : mergedState.dataFirstLabel;

      if (networkIO_in && networkIO_in.length > 0) {
        if(shiftCount > 0) {
          mergedState.networkIODatas[0] = [...systemState.systemData.networkIODatas[0].slice(shiftCount, systemState.systemData.networkIODatas[0].length), ...networkIO_in];
        }else{
          mergedState.networkIODatas[0] = [...systemState.systemData.networkIODatas[0], ...networkIO_in];
        }
      } else {
        if (shiftCount > 0) {
          mergedState.networkIODatas[0] = [...systemState.systemData.networkIODatas[0].slice(shiftCount, systemState.systemData.networkIODatas[0].length)];
        } else {
          mergedState.networkIODatas[0] = systemState.systemData.networkIODatas[0];
        }
      }
      mergedState.dataFirstLabel = (mergedState.networkIODatas[0].length > 0 && mergedState.networkIODatas[0][0][0] < mergedState.dataFirstLabel) ? mergedState.networkIODatas[0][0][0] : mergedState.dataFirstLabel;

      if (networkIO_out && networkIO_out.length > 0) {
        if(shiftCount > 0) {
          mergedState.networkIODatas[1] = [...systemState.systemData.networkIODatas[1].slice(shiftCount, systemState.systemData.networkIODatas[1].length), ...networkIO_out];
        }else{
          mergedState.networkIODatas[1] = [...systemState.systemData.networkIODatas[1], ...networkIO_out];
        }
      } else {
        if (shiftCount > 0) {
          mergedState.networkIODatas[1] = [...systemState.systemData.networkIODatas[1].slice(shiftCount, systemState.systemData.networkIODatas[1].length)];
        } else {
          mergedState.networkIODatas[1] = systemState.systemData.networkIODatas[1];
        }
      }
      mergedState.dataFirstLabel = (mergedState.networkIODatas[1].length > 0 && mergedState.networkIODatas[1][0][0] < mergedState.dataFirstLabel) ? mergedState.networkIODatas[1][0][0] : mergedState.dataFirstLabel;

    } else {
      if (metricData) {
        mergedState.cpuDatas = [cpuUsages];
        mergedState.memDatas = [memoryUsed];
        mergedState.diskIODatas = [diskIO_in, diskIO_out];
        mergedState.networkIODatas = [networkIO_in, networkIO_out];
      } else {
        return null;
      }
    }

    return mergedState;
  }

}