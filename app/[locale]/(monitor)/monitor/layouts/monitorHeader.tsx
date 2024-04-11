"use client"

import React, { useEffect, useRef, useState } from 'react';
import { Col, DropdownMenu, DropdownToggle, Row, UncontrolledDropdown } from 'reactstrap';

import { useAppDispatch, useAppSelector } from '@/hook/hook';
import { MonitorState, reset as resetData, updateNode, updateTimeRange as updateMonitorTimeRange, loadAllNodes, clearMarkArea, updateRefreshMode } from '@/redux/slices/monitoring/reducer';
import { reset as resetClientData, updateTimeRange as updateClientTimeRange, clearData as clearClientData, MonitorClientState, loadClientData } from '@/redux/slices/monitoring-client/reducer';
import { MonitorQueueState, reset as resetQueueData, updateTimeRange as updateQueueTimeRange, clearData as clearQueueData, updateQueueList, updateReloadFlag, loadQueueData, loadTpsData, loadQueueList, controlManualModal, clearManualQueue  } from '@/redux/slices/monitoring-queue/reducer';
import { reset as resetSystemData, updateTimeRange as updateSystemTimeRange, clearData as clearSystemData, MonitorSystemState, loadSystemStatus, loadSystemData } from '@/redux/slices/monitoring-system/reducer';

import { createSelector } from '@reduxjs/toolkit';
import { fullscreen } from '../common/FullScreen';
import DatePicker from 'react-datepicker';
import { CHART_REFRESH_MODE_MANUAL, CHART_REFRESH_MODE_REALTIME, CHART_TIME_RANGE_ABSOLUTE, CHART_TIME_RANGE_RELATIVE, chartReloadThreshold, dataSourceType, queuesOptions, refreshOptions, timeRangeOptions } from '@/data/monitor/chartConstants';
import { RES_APPLY_TIME_RANGE, RES_HEADER_ABSOLUTE_HISTORY, RES_HEADER_ABSOLUTE_TIME_RANGE, RES_HEADER_LABEL_QUEUES, RES_HEADER_LABEL_VPN, RES_HEADER_RELATIVE_TIME_RANGE, RES_MLSN_PLACEHOLDER } from '@/data/monitor/resources';

import "../styles/datepicker_dark.css";
import { MonitorPersistState, addTimeRangeHistory, cleanupHistory } from '@/redux/slices/monitoring/persistReducer';
import { setTimeout } from 'timers';

function dateFormat(date: Date|null) {
    if(!date) return '';
	let dateFormat = date.getFullYear().toString().substring(2,4) +
		'-' + ( (date.getMonth()+1) < 9 ? "0" + (date.getMonth()+1) : (date.getMonth()+1) )+
		'-' + ( (date.getDate()) < 9 ? "0" + (date.getDate()) : (date.getDate()) ) +
        ' ' + (date.getHours().toString().padStart(2, "0")) + ":" + (date.getMinutes().toString().padStart(2, "0"));
	return dateFormat;
}

const CALL_TIME_MODE_AUTO = 'AUTO'
const CALL_TIME_MODE_MANUAL = 'MANUAL'

/* 
msn=broker-1&mlsn=vpn1&queues=queue-1&queues=queue-2&queues=queue-n
*/
interface MonitorHeaderType {
    msn?: string|null;
    mlsn?: string|null;
    queues?: string[]|null;
}

const MonitorHeader = (props: MonitorHeaderType) => {
    const [queueParams, setQueueParams] = useState({
        mlsnIndex: -1,
        joinQueues: (props.queues && (props.queues?.length ?? 0 > 0))? props.queues.join(',') : null
    });
    const dispatch: any = useAppDispatch();
    
    /** selectors */
    const selectMonitorPersistData = createSelector(
        (state: any) => state.monitorPersist,
        (monitoringData: MonitorPersistState) => ({ timeRangeHistory: monitoringData.timeRangeHistory })
    )
    const monitoringMonitorPersistData = useAppSelector(selectMonitorPersistData);

    const selectMonitorData = createSelector(
        (state: any) => state.monitorHeader,
        (monitoringData: MonitorState) => ({ nodeInfo: monitoringData.nodeInfo, timeRange: monitoringData.timeRange, currNode: monitoringData.curNode })
    )
    const monitoringMonitorData = useAppSelector(selectMonitorData);

    const selectQueueData = createSelector(
        (state: any) => state.monitorQueue,
        (monitoringData: MonitorQueueState) => ({ 
            queueList: monitoringData.queueList, 
            pendingValueMode: monitoringData.pendingValueMode, 
            tpsInValueMode: monitoringData.tpsInValueMode, 
            tpsOutValueMode: monitoringData.tpsOutValueMode, 
            reloadPending: monitoringData.reloadPending, 
            reloadTps: monitoringData.reloadTps,
            manualQueueList: monitoringData.manualQueueList,
        })
    )
    const monitoringQueueData = useAppSelector(selectQueueData);

    const selectMarkArea = createSelector(
        (state: any) => state.monitorHeader,
        (monitorData: MonitorState) => monitorData.markArea
    )
    const monitorMarkArea = useAppSelector(selectMarkArea);

    const combinedLabelDataSelector = createSelector(
        (state: any) => state.monitorQueue,
        (state: any) => state.monitorClient,
        (state: any) => state.monitorSystem,
        (queueData: MonitorQueueState, clientData: MonitorClientState, systemData: MonitorSystemState) => ({
            queueLastLabel: queueData.pendingData.dataLastLabel, 
            tpsLastLabel: queueData.tpsData.dataLastLabel, 
            clientLastLabel: clientData.clientData.dataLastLabel, 
            systemLastLabel: systemData.systemData.dataLastLabel
        })
    );
    const combinedLabelData = useAppSelector(combinedLabelDataSelector);


    const mlsnPlaceHolder = { value: {}, label: RES_MLSN_PLACEHOLDER, serverType: '' };
    const [mlsnOptions, setMlsnOptions] = useState<any[]>([mlsnPlaceHolder]);
    const [mlsnIndex, setMlsnIndex] = useState<number>(0);
    const [queueTypeIndex, setQueueTypeIndex] = useState(2); //0 => placeholder
    const [refreshModeIndex, setRefreshModeIndex] = useState(1); //0 => placeholder
    const [timeRange, setTimeRange] = useState<any>(monitoringMonitorData.timeRange);
    const [chartTime, setChartTime] = useState(0);


    /* local function */
    const loadNodeInfo = () => {
        dispatch(loadAllNodes({ serverType: 'SOL' }));
    }

    const addDay = (date: Date, value: number): Date  => {
        date.setDate(date.getDate() + value);
        return date;
    }

    const cleanupPersist = () => {
        dispatch(cleanupHistory(addDay(new Date(), -7).getTime()))
    }

    /* clear all chart data */
    const clearChartData = () => {
        dispatch(clearQueueData());
        dispatch(clearClientData());
        dispatch(clearSystemData());
    }

    const GetChartAutoStartTime = (sourceType: string, eTime: number) => {
        const timeRangeRelativeValue = timeRangeOptions[timeRange.relative].value ?? 0;
        let prevLastLabel = 0;
        switch(sourceType) {
            case "pending":
                prevLastLabel = combinedLabelData.queueLastLabel;
                break;
            case "tps":
                prevLastLabel = combinedLabelData.tpsLastLabel;
                break;
            case "client":
                prevLastLabel = combinedLabelData.clientLastLabel;
                break;
            default:
                prevLastLabel = combinedLabelData.systemLastLabel;
                break;
        }
        let sTime = (prevLastLabel > 0) ?
            ((eTime - prevLastLabel) > timeRangeRelativeValue ? (eTime - timeRangeRelativeValue) : prevLastLabel)
            : (eTime - timeRangeRelativeValue);
        return sTime+1; // add 1-milli;
    }

    const callServerApi = (mode: string, sTime: number, eTime: number) => {
        let pendingStartTime;
        let tpsStartTime;
        let clientStartTime;
        let systemStartTime;
        if(mode === CALL_TIME_MODE_AUTO) {
            pendingStartTime = GetChartAutoStartTime("pending", eTime);
            tpsStartTime = GetChartAutoStartTime("tps", eTime);
            clientStartTime = GetChartAutoStartTime("client", eTime);
            systemStartTime = GetChartAutoStartTime("system", eTime);
        }else{
            pendingStartTime = sTime;
            tpsStartTime = sTime;
            clientStartTime = sTime;
            systemStartTime = sTime;
        }

        if(monitoringQueueData.queueList && monitoringQueueData.queueList.length > 0) {
            dispatch(loadQueueData({
                msn: mlsnOptions[mlsnIndex].value.msn,
                mlsn: mlsnOptions[mlsnIndex].value.mlsn,
                sTime: pendingStartTime,
                eTime: eTime,
                queues: monitoringQueueData.queueList,
                chartList: [monitoringQueueData.pendingValueMode],
            }));
            dispatch(loadTpsData({
                msn: mlsnOptions[mlsnIndex].value.msn,
                mlsn: mlsnOptions[mlsnIndex].value.mlsn,
                sTime: tpsStartTime,
                eTime: eTime,
                queues: monitoringQueueData.queueList,
                chartList: [monitoringQueueData.tpsInValueMode, monitoringQueueData.tpsOutValueMode],
            }));
        }

        dispatch(loadClientData({
            sTime: clientStartTime,
            eTime: eTime,
            msn: mlsnOptions[mlsnIndex].value.msn,
            mlsn: mlsnOptions[mlsnIndex].value.mlsn,
            categoryType: ["all"], //"all"
        }));
        dispatch(loadSystemStatus({
            msn: mlsnOptions[mlsnIndex].value.msn,
            time: eTime
        }));
        dispatch(loadSystemData({
            sTime: systemStartTime,
            eTime: eTime,
            msn: mlsnOptions[mlsnIndex].value.msn,
        }));
    }

    const reloadPendingData = () => {
        if(mlsnIndex > 0 && monitoringQueueData.queueList && monitoringQueueData.queueList.length > 0) {
            let sTime = 0;
            let eTime = 0;
            if(refreshModeIndex === 0) {
                if (timeRange.mode === CHART_TIME_RANGE_RELATIVE) {
                    eTime = (combinedLabelData.queueLastLabel > 0)? combinedLabelData.queueLastLabel : new Date().getTime();
                    sTime = eTime - timeRangeOptions[timeRange.relative].value;
                } else if (timeRange.mode === CHART_TIME_RANGE_ABSOLUTE && timeRange.absolute) {
                    sTime = timeRange.absolute.startDateTime ?? 0;
                    eTime = timeRange.absolute.endDateTime ?? 0;
                }
            }else{
                const nowDateTime = new Date().getTime();
                if ( timeRange.mode === CHART_TIME_RANGE_RELATIVE
                    && (((chartTime + refreshOptions[refreshModeIndex].value) - nowDateTime) >= chartReloadThreshold)) { //2sec 이상 남은 경우에만 reload 한다.
                    sTime = GetChartAutoStartTime("pending", nowDateTime);
                    eTime = nowDateTime;
                }
            }

            if(sTime > 0 && eTime > 0) {
                dispatch(loadQueueData({
                    msn: mlsnOptions[mlsnIndex].value.msn,
                    mlsn: mlsnOptions[mlsnIndex].value.mlsn,
                    sTime: sTime,
                    eTime: eTime,
                    queues: monitoringQueueData.queueList,
                    chartList: [monitoringQueueData.pendingValueMode],
                }));
            }
        }
    }

    const reloadTpsData = () => {
        if (mlsnIndex > 0 && monitoringQueueData.queueList && monitoringQueueData.queueList.length > 0) {
            let sTime = 0;
            let eTime = 0;
            if(refreshModeIndex === 0) {
                if (timeRange.mode === CHART_TIME_RANGE_RELATIVE) {
                    eTime = (combinedLabelData.tpsLastLabel > 0)? combinedLabelData.tpsLastLabel: new Date().getTime();
                    sTime = eTime - timeRangeOptions[timeRange.relative].value;
                } else if (timeRange.mode === CHART_TIME_RANGE_ABSOLUTE && timeRange.absolute) {
                    sTime = timeRange.absolute.startDateTime ?? 0;
                    eTime = timeRange.absolute.endDateTime ?? 0;
                }
            }else{ // realtime
                // only relative mode.
                const nowDateTime = new Date().getTime();
                if ( timeRange.mode === CHART_TIME_RANGE_RELATIVE
                     && (((chartTime + refreshOptions[refreshModeIndex].value) - nowDateTime) >= chartReloadThreshold)) { //2sec 이상 남은 경우에만 reload 한다.
                    sTime = GetChartAutoStartTime("tps", nowDateTime);
                    eTime = nowDateTime;
                }
            }
            if(sTime > 0 && eTime > 0) {
                dispatch(loadTpsData({
                    msn: mlsnOptions[mlsnIndex].value.msn,
                    mlsn: mlsnOptions[mlsnIndex].value.mlsn,
                    sTime: sTime,
                    eTime: eTime,
                    queues: monitoringQueueData.queueList,
                    chartList: [monitoringQueueData.tpsInValueMode, monitoringQueueData.tpsOutValueMode],
                }));
            }
        }
    }

    const reloadClientData = () => {
        if (mlsnIndex > 0) {
            let sTime = 0;
            let eTime = 0;
            if(refreshModeIndex === 0) {
                if (timeRange.mode === CHART_TIME_RANGE_RELATIVE) {
                    eTime = (combinedLabelData.clientLastLabel > 0)? combinedLabelData.clientLastLabel : new Date().getTime();
                    sTime = eTime - timeRangeOptions[timeRange.relative].value;
                } else if (timeRange.mode === CHART_TIME_RANGE_ABSOLUTE && timeRange.absolute) {
                    sTime = timeRange.absolute.startDateTime ?? 0;
                    eTime = timeRange.absolute.endDateTime ?? 0;
                }
            }else{ // realtime
                const nowDateTime = new Date().getTime();
                if ( timeRange.mode === CHART_TIME_RANGE_RELATIVE
                     && (((chartTime + refreshOptions[refreshModeIndex].value) - nowDateTime) >= chartReloadThreshold)) { //2sec 이상 남은 경우에만 reload 한다.
                    sTime = GetChartAutoStartTime("client", nowDateTime);
                    eTime = nowDateTime;
                }
            }
            if(sTime > 0 && eTime > 0) {
                dispatch(loadClientData({
                    sTime: sTime,
                    eTime: eTime,
                    msn: mlsnOptions[mlsnIndex].value.msn,
                    mlsn: mlsnOptions[mlsnIndex].value.mlsn,
                    categoryType: ["all"], //"all"
                }));
            }
        }
    }

    const controlMonitorOnNode = (nodeIndex: number) => {
        /* manual-queue 에서 mlsn 을 변경할 수 있음으로 공통적으로 여기서 처리한다. */
        if(nodeIndex > 0 && (!monitoringMonitorData.currNode || 
            (monitoringMonitorData.currNode.msn !== mlsnOptions[nodeIndex].value.msn 
                || monitoringMonitorData.currNode.mlsn !== mlsnOptions[nodeIndex].value.mlsn))) {
            // update current node.
            dispatch(updateNode(mlsnOptions[nodeIndex].value))

            if(refreshModeIndex === 0) {
                // relative 시간인 경우에는 항상 현재 시간 기준임으로 system 차트도 clear 하고 모든 데이터를 가져와야 한다.
                clearChartData();
                triggerChartUpdate();
            }else{ //realtime mode.
                if(monitoringMonitorData.currNode && 
                    (monitoringMonitorData.currNode.msn === mlsnOptions[nodeIndex].value.msn 
                        && monitoringMonitorData.currNode.mlsn !== mlsnOptions[nodeIndex].value.mlsn)) {
                    // broker 는 그대로 놔둔다.
                    dispatch(clearQueueData());
                    dispatch(clearClientData());
                }else{
                    clearChartData();
                }
            }
        }

    }

    const controlMonitorOnQueueType = (nodeIndex:number, queueTypeIndex: number, queues: string[]) => {
        if(nodeIndex > 0) {
            /* typeIndex 는 기본값이 2이고, 외부에서 queue 정보를 가지고 들어온 경우에는 0 이다. */
            dispatch(clearQueueData());
            dispatch(updateQueueList(queues));
            if (queueTypeIndex > 1) { // queue 데이터를 가져와야 한다. 
                dispatch(loadQueueList({
                    msn: mlsnOptions[nodeIndex].value.msn,
                    mlsn: mlsnOptions[nodeIndex].value.mlsn,
                    queueType: queuesOptions[queueTypeIndex].value,
                    direction: queuesOptions[queueTypeIndex].sort, //desc or asc
                    count: 5,
                }));
            }
        }
    }

    /* useEffects */
    /* initial loading */
    useEffect(() => {
        if(queueParams.joinQueues){
            queuesOptions[0].value = queueParams.joinQueues;
            queuesOptions[0].label = queueParams.joinQueues;
        }
        cleanupPersist();
        loadNodeInfo();
        return () => {
            dispatch(resetQueueData());
            dispatch(resetClientData());
            dispatch(resetSystemData());
            dispatch(resetData());
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    /* make msn & mlsn node information after initial loading */
    useEffect(() => {
        if (monitoringMonitorData.nodeInfo.nodeList && monitoringMonitorData.nodeInfo.nodeList.length > 0) {
            const mlsnList: any[] = [mlsnPlaceHolder];
            for (let node of monitoringMonitorData.nodeInfo.nodeList) {
                for (let lsn of node.mlsns) {
                    mlsnList.push({ value: { msn: node.msn, mlsn: lsn }, label: `${node.msn} > ${lsn}`, serverType: node.serverType });
                }
            }
            if (mlsnList.length > 0) {
                let matchedIndex = 0; // 0 => placeholder
                if(props.msn && props.mlsn) {
                    matchedIndex = mlsnList.findIndex((item:any) => (item.value.msn === props.msn && item.value.mlsn === props.mlsn));
                }
                setMlsnOptions(mlsnList);
                if(matchedIndex > 0) {  // mlsn 이 선택 되었다.
                    if (queueParams.joinQueues) {
                        // 외부로 부터 queue 가 들어온 경우에는 queueList 를 않가져오도록 해야한다.
                        setQueueParams({...queueParams, mlsnIndex: matchedIndex});           
                        const queues = queuesOptions[0].value.split(',') ?? [];
                        controlMonitorOnQueueType(matchedIndex, 0, queues);
                        setQueueTypeIndex(0); 
                    } 
                    setMlsnIndex(matchedIndex);
                }
            }
        }else{
            if(monitoringMonitorData.nodeInfo.error && monitoringMonitorData.nodeInfo.retryMode){
                setTimeout(loadNodeInfo, 2000);
                return;
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [monitoringMonitorData.nodeInfo]);

    /* 헤더에서 chart update 용 timer 를 구동한다. */
    /* auto refresh main effect based on timer */
    /* 변수 capturing issue 로 인해 하기 형태로 동작 */
    const triggerChartUpdate = () => {
        setChartTime(new Date().getTime());
    };

    useEffect(() => {
        if(mlsnIndex > 0) {
            /* timeRange 옵션 확인 : 일단은 현재 시간 기준 */
            if (timeRange.mode === CHART_TIME_RANGE_RELATIVE) {
                const eTime = chartTime;
                const sTime = eTime - timeRangeOptions[timeRange.relative].value ?? 0;
                callServerApi((refreshModeIndex === 0)? CALL_TIME_MODE_MANUAL: CALL_TIME_MODE_AUTO, sTime, eTime);
            } else if (timeRange.mode === CHART_TIME_RANGE_ABSOLUTE && timeRange.absolute) {
                const sTime = timeRange.absolute.startDateTime;
                const eTime = timeRange.absolute.endDateTime;
                if(eTime > sTime) callServerApi(CALL_TIME_MODE_MANUAL, sTime, eTime);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chartTime, dispatch])


    /* 타이머는 여기서 구동하는게 맞을 듯 하다. */
    useEffect(() => {

        /* chart timer 구동 */
        if(mlsnIndex <= 0 || refreshModeIndex === 0) {
            return; 
        }
        /* auto update mode */
        triggerChartUpdate();
        const id = setInterval(() => triggerChartUpdate(), refreshOptions[refreshModeIndex].value)
        return () => {
            clearInterval(id)
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mlsnIndex, refreshModeIndex]);

    useEffect(() => {
        if(refreshModeIndex === 0) dispatch(updateRefreshMode(CHART_REFRESH_MODE_MANUAL));
        else dispatch(updateRefreshMode(CHART_REFRESH_MODE_REALTIME));

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[refreshModeIndex])

    /* queueList 가 갱신된 경우에는 manual 모드에서도 기존 label 기반으로 pending 과 tps 만 reload 하도록 한다. **/
    useEffect(() => {
        if(mlsnIndex <= 0 || monitoringQueueData.queueList.length === 0) return;

        reloadPendingData();
        reloadTpsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [monitoringQueueData.queueList])

    /* manual-queue-list from modal-box */
    useEffect(() => {
        if(monitoringQueueData.manualQueueList.length > 0) {
            const enabledQueue = monitoringQueueData.manualQueueList.find(item => item.enabled);
            const fIndex = mlsnOptions.findIndex(item => item.value.msn === enabledQueue.msn && item.value.mlsn === enabledQueue.mlsn);
            if(fIndex >= 0) {
                if (fIndex !== mlsnIndex) {
                    controlMonitorOnNode(fIndex);
                    controlMonitorOnQueueType(fIndex, 1, enabledQueue.queues); // 1-> manual-queue
                    setMlsnIndex(fIndex);
                } else {
                    const enabledItem = monitoringQueueData.manualQueueList.find(item => item.enabled && item.msn === mlsnOptions[mlsnIndex].value.msn && item.mlsn === mlsnOptions[mlsnIndex].value.mlsn);
                    if (enabledItem) {
                        dispatch(updateQueueList(enabledItem.queues));
                    }
                }
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[monitoringQueueData.manualQueueList]);

    /* after time-range is applied, shuould be refreshed */
    useEffect(() => {
        if(mlsnIndex > 0) {
            dispatch(updateMonitorTimeRange(timeRange));
            dispatch(updateQueueTimeRange(timeRange));
            dispatch(updateSystemTimeRange(timeRange));
            dispatch(updateClientTimeRange(timeRange));
            triggerChartUpdate();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeRange, dispatch]);

    /* timeRange 가 변경시에는 무조건 refresh 하자. */
    // useEffect(() => {
    //     if(mlsnIndex > 0) {
    //         triggerChartUpdate();
    //     }
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // },[monitoringMonitorData.timeRange]);


    /* queue chart msgs/count 변경시 reload 해야 한다. */
    useEffect(() => {
        if(monitoringQueueData.reloadPending && monitoringQueueData.queueList && monitoringQueueData.queueList.length > 0) {
            reloadPendingData();
            dispatch(updateReloadFlag({
                dataSourceType: dataSourceType.PENDING,
                reloadFlag : false
            }));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[monitoringQueueData.reloadPending])

    useEffect(() => {
        if(monitoringQueueData.reloadTps && monitoringQueueData.queueList && monitoringQueueData.queueList.length > 0) {
            reloadTpsData();
            dispatch(updateReloadFlag({
                dataSourceType: dataSourceType.THROUGHPUT,
                reloadFlag : false
            }));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[monitoringQueueData.reloadTps])


    /* for time range menu */
    const [timeRangeMode, setTimeRangeMode] = useState(CHART_TIME_RANGE_RELATIVE);
    const [startAbsoluteDate, setStartAbsoluteDate] = useState<Date|null>(null);
    const [endAbsoluteDate, setEndAbsoluteDate] = useState<Date|null>(null);
    const [relativeTimeRange, setRelativeTimeRange] = useState(0);
    const [timeRangeLabel, setTimeRangeLabel] = useState(timeRangeOptions[0].label);

    const [isTimeRangeOpen, setIsTimeRangeOpen] = useState(false);
    const toggleTimeRangeDropdown = () => {
        setStartAbsoluteDate(null);
        setEndAbsoluteDate(null);
        if(timeRange.mode === CHART_TIME_RANGE_RELATIVE) {
            setTimeRangeLabel(timeRangeOptions[timeRange.relative].label);
        }else{
            setTimeRangeLabel(`${dateFormat(new Date(timeRange.absolute.startDateTime))} - ${dateFormat(new Date(timeRange.absolute.endDateTime))}`)
        }
        setIsTimeRangeOpen(!isTimeRangeOpen);
    }


    const handleStartAbsoluteDate = (date: Date|null) => {
        setStartAbsoluteDate(date);
        setTimeRangeMode(CHART_TIME_RANGE_ABSOLUTE);
    }
    const handleEndAbsoluteDate = (date: Date|null) => {
        setEndAbsoluteDate(date);
        setTimeRangeMode(CHART_TIME_RANGE_ABSOLUTE);
    }
    const handleRelativeTimeRange = (index: number) => {
        setRelativeTimeRange(index);
        setStartAbsoluteDate(null);
        setEndAbsoluteDate(null);
        setTimeRangeMode(CHART_TIME_RANGE_RELATIVE);
    }

    const handleClickHistory = (index: number) => {
        setStartAbsoluteDate(new Date(monitoringMonitorPersistData.timeRangeHistory[index].startDateTime));
        setEndAbsoluteDate(new Date(monitoringMonitorPersistData.timeRangeHistory[index].endDateTime))
        setTimeRangeMode(CHART_TIME_RANGE_ABSOLUTE);
    }

    const handleApplyTimeRange = () => {
        if(timeRangeMode === CHART_TIME_RANGE_ABSOLUTE && startAbsoluteDate && endAbsoluteDate && (endAbsoluteDate > startAbsoluteDate)) {
            setTimeRange({
                mode: CHART_TIME_RANGE_ABSOLUTE,
                absolute: {
                    startDateTime: startAbsoluteDate.getTime(),
                    endDateTime: endAbsoluteDate.getTime()
                }
            });
            setTimeRangeLabel(`${dateFormat(startAbsoluteDate)} - ${dateFormat(endAbsoluteDate)}`)
            dispatch(addTimeRangeHistory({startDateTime: startAbsoluteDate.getTime(), endDateTime: endAbsoluteDate.getTime()}))
            setRefreshModeIndex(0);
        }else if(timeRangeMode === CHART_TIME_RANGE_RELATIVE) {
            setTimeRange({
                mode: CHART_TIME_RANGE_RELATIVE,
                relative: relativeTimeRange
            })
            setTimeRangeLabel(timeRangeOptions[relativeTimeRange].label);
        }else{
            setTimeRange({
                mode: CHART_TIME_RANGE_RELATIVE,
                relative: 0
            })
            setTimeRangeLabel(timeRangeOptions[0].label);
        }
        setIsTimeRangeOpen(false)

        clearChartData();

    }

    /**  header onclick event handlers **/
    const handleMlsnIndex = (index: number) => {
        if(index === mlsnIndex || index === 0) return;
        controlMonitorOnNode(index);
        setMlsnIndex(index);

        /* mlsn 이 변경될 시에 항상 pending index 로 초기화 한다. */
        controlMonitorOnQueueType(index, 2, []);
        setQueueTypeIndex(2);
    }

    const handleQueueTypeIndex = (index: number) => {
        if( (index === 0 && (mlsnIndex !== queueParams.mlsnIndex || !queueParams.joinQueues)) // param 으로 queue 를 가지고 들어온 경우. vpn 일치하지 않은 경우.
            || (index !== 1 && index === queueTypeIndex))  // modal type(1) 을 제외하고 동일한 값
            return;

        if(index === 0) {
           const queues = queuesOptions[0].value.split(',') ?? [];
           controlMonitorOnQueueType(mlsnIndex, index, queues);
        }else if(index === 1) {
            const enabledItem = monitoringQueueData.manualQueueList.find(item => item.enabled && item.msn === mlsnOptions[mlsnIndex].value.msn && item.mlsn === mlsnOptions[mlsnIndex].value.mlsn);
            if (enabledItem) {
                controlMonitorOnQueueType(mlsnIndex, index, enabledItem.queues);
            } else {
                controlMonitorOnQueueType(mlsnIndex, index, []);
            }
            dispatch(clearManualQueue());
            dispatch(controlManualModal(true));
        }else{
            controlMonitorOnQueueType(mlsnIndex, index, []);
        }
        setQueueTypeIndex(index);
    }

    /* data reload 시에는 기존 timeRange 정보를 기준으로 다시 가져온다. */
    /* 만약 mark-area 가 설정되어 있는 경우에는 그걸 우선적으로 처리해야 한다. */
    const handleReload = () => {
        if (mlsnIndex>0) {
            if (refreshModeIndex !== 0) {
                setRefreshModeIndex(0);
            }
            clearChartData();

            if(monitorMarkArea?.startMarkLine && monitorMarkArea?.endMarkLine) {
                setTimeRange({
                    mode: CHART_TIME_RANGE_ABSOLUTE,
                    absolute: {
                        startDateTime: monitorMarkArea.startMarkLine,
                        endDateTime: monitorMarkArea.endMarkLine
                    }
                });
                setTimeRangeLabel(`${dateFormat(new Date(monitorMarkArea.startMarkLine))} - ${dateFormat(new Date(monitorMarkArea.endMarkLine))}`)
                dispatch(clearMarkArea());
            }else{
                triggerChartUpdate();
            }
        }
    }

    /* refresh mode 는 실시간 차트 동작을 컨트롤 한다. 그래서 Absolute 영역일 가능성이 없음으로 이를 기반으로 동작한다. */
    const handleRefreshMode = (selected: number) => {
        if(selected === refreshModeIndex) return;
        if (timeRange.mode !== CHART_TIME_RANGE_RELATIVE) { // absolute -> relative 로 변경.
            clearChartData();
            setTimeRange({
                mode: CHART_TIME_RANGE_RELATIVE,
                relative: 0,  // relative 값(x축 범위)은 초기값으로 무조건 설정한다.
            })
            setTimeRangeLabel(timeRangeOptions[0].label);
        }else {
            /* 주기만 변경이 됨으로 기존 값이 off 인 경우에만 초기화를 해야 한다. */
            if (refreshModeIndex === 0) {
                clearChartData();
            }
        }

        /* timer 를 제어할것이다. */
        setRefreshModeIndex(selected);
    }

    return (
        <React.Fragment>
            <Row>
                <Col xxl={8} className="d-flex align-items-center mon-dropdown-menu">
                    <label className="col-form-label sol_mr_10" htmlFor="mo_messagevpn" style={{width: "100px"}}>{RES_HEADER_LABEL_VPN}</label>
                    <div className='btn-group d-inline-block sol_w300 sol_mr_20'>
                        <button className="form-select bg-transparent w-100 " id="mo_messagevpn" data-bs-toggle="dropdown" style={{ textAlign: 'left' }}>
                            <span>{mlsnOptions[mlsnIndex].label}</span>
                        </button>
                        <div className="dropdown-menu w-100">
                            {
                                mlsnOptions.map((item: any, index) =>
                                    <li key={item.label} onClick={() => handleMlsnIndex(index)}>
                                        <a className={`dropdown-item ${(index > 0) ? "" : "disabled"}`}>{item.label}</a>
                                    </li>)
                            }
                        </div>
                    </div>
                    <label className="col-form-label sol_mr_10" htmlFor="mo_queues">{RES_HEADER_LABEL_QUEUES}</label>
                    <div className='btn-group sol_w300'>
                        <button className="form-select bg-transparent w-100" id="mo_queues" data-bs-toggle="dropdown" style={{ textAlign: 'left' }}>
                            <span>{queuesOptions[queueTypeIndex].label}</span>
                        </button>
                        <div className="dropdown-menu w-100">
                            {
                                queuesOptions.map((item: any, index) =>
                                    <li key={item.label} onClick={() => handleQueueTypeIndex(index)}>
                                        <a className={`dropdown-item ${(index > 0 || (index === 0 && mlsnIndex === queueParams.mlsnIndex && queueParams.joinQueues)) ? "" : "disabled"}`}>{item.label}</a>
                                    </li>)
                            }
                        </div>
                    </div>
                </Col>
                <Col xxl={4} className="d-flex align-items-center justify-content-end">
                    <div className="d-flex gap-2">
                        <button className="btn hstack btn-icon sol_button_outline sol_btn_icon"
                            onClick={() => fullscreen(document.getElementById("monitor-wrapper"))}>
                            <i className="sol_i_allmonitoring"></i>
                        </button>
                        <div className="btn-group">
                            <UncontrolledDropdown isOpen={isTimeRangeOpen} toggle={toggleTimeRangeDropdown}>
                                <DropdownToggle className="btn hstack btn-outline-light sol_btn_min" style={{ height: '100%', width: `${(timeRange.mode === CHART_TIME_RANGE_ABSOLUTE) ? "300px" : "200px"}` }} tag="a" type="a">
                                    <i className="sol_i_clock sol_mr_6" style={{ verticalAlign: "middle" }}></i>
                                    <span className="sol_mr_6">{timeRangeLabel}</span>
                                </DropdownToggle>
                                <DropdownMenu className='sol_w600'>
                                    <div className="row sol_dropdown_ly_range">
                                        <div className="col-md-7 sol_rang_rig">
                                            <div className="row sol_p_10">
                                                <h5>{RES_HEADER_ABSOLUTE_TIME_RANGE}</h5>
                                                <div className="row d-flex">
                                                    <div className="col-sm-6">
                                                        <label htmlFor="rang_from">From</label>
                                                        <DatePicker
                                                            popperPlacement="top"
                                                            className='form-control'
                                                            selected={startAbsoluteDate}
                                                            onChange={(date) => handleStartAbsoluteDate(date)}
                                                            maxDate={endAbsoluteDate ? endAbsoluteDate : new Date()}
                                                            minDate={addDay(new Date(), -7)} // for 7 days.
                                                            showTimeSelect
                                                            timeFormat="HH:mm"
                                                            timeIntervals={15}
                                                            timeCaption="time"
                                                            dateFormat="MM dd, yy h:mm aa"
                                                            id="rang_form"
                                                        />
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <label htmlFor="rang_to">To</label>
                                                        <DatePicker
                                                            popperPlacement="top"
                                                            className='form-control'
                                                            selected={endAbsoluteDate}
                                                            onChange={(date) => handleEndAbsoluteDate(date)}
                                                            maxDate={new Date()}
                                                            minDate={startAbsoluteDate ? startAbsoluteDate : addDay(new Date(), -7)} // for 7 days.
                                                            showTimeSelect
                                                            timeFormat="HH:mm"
                                                            timeIntervals={15}
                                                            timeCaption="time"
                                                            dateFormat="MM dd, yy h:mm aa"
                                                            id="rang_to"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row mt-3 sol_p_10">
                                                <h5>{RES_HEADER_ABSOLUTE_HISTORY}</h5>
                                                <ul>
                                                    {
                                                        monitoringMonitorPersistData.timeRangeHistory.map((item: any, index) =>
                                                            <li key={index} onClick={() => handleClickHistory(index)}>{`${dateFormat(new Date(item.startDateTime))} to ${dateFormat(new Date(item.endDateTime))}`}</li>
                                                        )
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="col-md-5">
                                            <div className="sol_p_tb10">
                                                <h5>{RES_HEADER_RELATIVE_TIME_RANGE}</h5>
                                                <div className="gap-2">
                                                    {
                                                        timeRangeOptions.map((item: any, index) =>
                                                            <button type="button" className="btn btn-outline-light sol_btn_range" onClick={() => handleRelativeTimeRange(index)} key={item.label}>{item.label}</button>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="sol_p_10 sol_rang_top text-center">
                                            <button className="btn btn-outline-info" onClick={handleApplyTimeRange}>{RES_APPLY_TIME_RANGE}</button>
                                        </div>
                                    </div>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </div>

                        <button className="btn hstack btn-icon sol_button_outline sol_btn_icon sol_btn_mr-8"
                            onClick={handleReload}>
                            <i className="sol_i_refresh"></i>
                        </button>

                        <div className="btn-group">
                            <button className="form-select bg-transparent" data-bs-toggle="dropdown" style={{ height: '100%' }}>
                                <span>{refreshOptions[refreshModeIndex].label}</span>
                            </button>
                            <div className="dropdown-menu">
                                {
                                    refreshOptions.map((item: any, index) =>
                                        <li key={item.label} onClick={() => handleRefreshMode(index)}><a className="dropdown-item" >{item.label}</a></li>)
                                }
                            </div>
                        </div>
                    </div>

                </Col>
            </Row>
        </React.Fragment>
    );
};

export default MonitorHeader;