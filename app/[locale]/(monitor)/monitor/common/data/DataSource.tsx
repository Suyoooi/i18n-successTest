import { CHART_DATA_MODE_BYTES, CHART_DATA_MODE_COUNT, IN_MSG_RATE, PENDING_CNT, dataSourceType } from "@/data/monitor/chartConstants";
import { RES_CHART_LABEL_CPU_STATUS, RES_CHART_LABEL_CPU_USAGE, RES_CHART_LABEL_DISK_STATUS, RES_CHART_LABEL_MEMORY_USAGE, RES_CHART_LABEL_MEM_STATUS, RES_CHART_LABEL_NETWORK_RECEIVED, RES_CHART_LABEL_NETWORK_SENDED, RES_CHART_LABEL_READ, RES_CHART_LABEL_WRITE } from "@/data/monitor/resources";
import { MonitorClientState } from "@/redux/slices/monitoring-client/reducer";
import { MonitorQueueState } from "@/redux/slices/monitoring-queue/reducer";
import { MonitorSystemState } from "@/redux/slices/monitoring-system/reducer";
import { createSelector } from "@reduxjs/toolkit";

const selectPendingMonitoringData = createSelector(
    (state: any) => state.monitorQueue,
    (monitoringData: MonitorQueueState) => ({ names: monitoringData.pendingData.queueNames, minLabel: monitoringData.pendingData.minLabel, dataFirstLabel: monitoringData.pendingData.dataFirstLabel, lastLabel: monitoringData.pendingData.lastLabel, datas: monitoringData.pendingData.datas, valueMode: (monitoringData.pendingValueMode === PENDING_CNT)? CHART_DATA_MODE_COUNT: CHART_DATA_MODE_BYTES })
)
const selectTpsMonitoringData = createSelector(
    (state: any) => state.monitorQueue,
    (monitoringData: MonitorQueueState) => ({ names: [...monitoringData.tpsData.queueNames.map((item: string) => `${item}_in`), ...monitoringData.tpsData.queueNames.map((item:string)=> `${item}_out`)], 
                        minLabel: monitoringData.tpsData.minLabel, dataFirstLabel: monitoringData.tpsData.dataFirstLabel, lastLabel: monitoringData.tpsData.lastLabel, datas: [...monitoringData.tpsData.tpsInDatas, ...monitoringData.tpsData.tpsOutDatas], valueMode: (monitoringData.tpsInValueMode === IN_MSG_RATE)? CHART_DATA_MODE_COUNT: CHART_DATA_MODE_BYTES})
)
const selectConnMonitoringData = createSelector(
    (state: any) => state.monitorClient,
    (monitoringData: MonitorClientState) => ({ names: monitoringData.clientData.clientNames, lastLabel: monitoringData.clientData.lastLabel, minLabel: monitoringData.clientData.minLabel, dataFirstLabel: monitoringData.clientData.dataFirstLabel, datas: monitoringData.clientData.datas})
)
const selectCpuMonitoringData = createSelector(
    (selectorState: any) => selectorState.monitorSystem,
    (monitoringData: MonitorSystemState) => ({ names: [RES_CHART_LABEL_CPU_USAGE], minLabel: monitoringData.systemData.minLabel, dataFirstLabel: monitoringData.systemData.dataFirstLabel, lastLabel: monitoringData.systemData.lastLabel, datas: monitoringData.systemData.cpuDatas})
)
const selectDiskMonitoringData = createSelector(
    (selectorState: any) => selectorState.monitorSystem,
    (monitoringData: MonitorSystemState) => ({ names: [RES_CHART_LABEL_READ, RES_CHART_LABEL_WRITE], minLabel: monitoringData.systemData.minLabel, dataFirstLabel: monitoringData.systemData.dataFirstLabel, lastLabel: monitoringData.systemData.lastLabel, datas: monitoringData.systemData.diskIODatas})
)
const selectMemoryMonitoringData = createSelector(
    (selectorState: any) => selectorState.monitorSystem,
    (monitoringData: MonitorSystemState) => ({ names: [RES_CHART_LABEL_MEMORY_USAGE], minLabel: monitoringData.systemData.minLabel, dataFirstLabel: monitoringData.systemData.dataFirstLabel, lastLabel: monitoringData.systemData.lastLabel, datas: monitoringData.systemData.memDatas, titlePostfix: monitoringData.systemData.memorySize })
)
const selectNetworkMonitoringData = createSelector(
    (selectorState: any) => selectorState.monitorSystem,
    (monitoringData: MonitorSystemState) => ({ names: [RES_CHART_LABEL_NETWORK_RECEIVED, RES_CHART_LABEL_NETWORK_SENDED], minLabel: monitoringData.systemData.minLabel, dataFirstLabel: monitoringData.systemData.dataFirstLabel, lastLabel: monitoringData.systemData.lastLabel, datas: monitoringData.systemData.networkIODatas })
)

const selectCPUStatusData = createSelector(
    (state: any) => state.monitorSystem,
    (monitoringData: MonitorSystemState) => ({ names: [RES_CHART_LABEL_CPU_STATUS], datas: [monitoringData.systemStatus.cpuStatus] })
)
const selectMEMStatusData = createSelector(
    (state: any) => state.monitorSystem,
    (monitoringData: MonitorSystemState) => ({ names: [RES_CHART_LABEL_MEM_STATUS], datas: [monitoringData.systemStatus.memoryStatus] })
)
const selectDiskStatusData = createSelector(
    (state: any) => state.monitorSystem,
    (monitoringData: MonitorSystemState) => ({ names: [RES_CHART_LABEL_DISK_STATUS], datas: [monitoringData.systemStatus.diskStatus] })
)

const getDataSourceSelector = (sourceType: string) : any | null => {
    switch(sourceType) {
        case dataSourceType.PENDING:
            return(selectPendingMonitoringData);
        case dataSourceType.THROUGHPUT:
            return(selectTpsMonitoringData);
        case dataSourceType.CONNECTION:
            return(selectConnMonitoringData);
        case dataSourceType.CPU_USAGE:
            return(selectCpuMonitoringData);
        case dataSourceType.DISK_USAGE:
            return(selectDiskMonitoringData);
        case dataSourceType.MEMORY_USAGE:
            return(selectMemoryMonitoringData);
        case dataSourceType.NETWORK_USAGE:
            return(selectNetworkMonitoringData);
        case dataSourceType.CPU_STATUS:
            return(selectCPUStatusData);
        case dataSourceType.MEMORY_STATUS:
            return(selectMEMStatusData);
        case dataSourceType.DISK_STATUS:
            return(selectDiskStatusData);
        default:
            return(null);
    }
}

export {
    getDataSourceSelector
};