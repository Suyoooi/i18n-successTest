"use client"

import React, { useEffect, useRef, useState } from 'react';
import { Col, Row } from 'reactstrap';

import { useAppDispatch, useAppSelector } from '@/hook/hook';
import { createSelector } from '@reduxjs/toolkit';
import { DashboardState } from '@/redux/slices/dashboard/reducer';
import { useRouter } from "next/navigation";
import { RES_MENU_GOTO_MON, RES_MENU_GOTO_QUEUE, RES_MENU_GOTO_VPN, RES_NO_DATA, RES_TBL_TITLE_BROKER_STATUS, RES_TBL_TITLE_HIGH_TPS, RES_TBL_TITLE_LOW_TPS, RES_TBL_TITLE_PENDING, RES_TBL_TYPE_ALL, RES_TBL_TYPE_ANOMALY, RES_TBL_TYPE_EXCEPTION, RES_TBL_TYPE_FAIL } from "@/data/dash/resources";
import { HA_HOST_PRIMARY, HA_HOST_SECONDARY, HOST_STATUS_ALIVE  } from '@/data/dash/dashConstants';
import DashboardTitle from './common/dashTitle';
import { setSelectedId, setSelectedMsnId, setSelectedRow } from '@/redux/slices/vpn/vpnSlice';
import { setSelectedQueue } from '@/redux/slices/queue/queueSlice';
import DashReactTable from './common/dashReactTable';
import { TableHeight, TableRowHeight } from '@/data/dash/dashConstants';
import OverflowTip from './common/overflowTip';
import { ConvCountUnit } from '@/data/monitor/chartUtils';


/* 
== url 정보 ==
1. vpn summary : '/mlsnm'
2. queue summary : '/channel'


** redux에서 vpn 정보 불러오는 방법 **
import { useAppSelector } from "@/hook/hook";
    const selectedRow = useAppSelector((state) => state.isVpn.selectedRow);
    const selectedId = useAppSelector((state) => state.isVpn.selectedId);
    const selectedMsnId = useAppSelector((state) => state.isVpn.selectedMsnId);

    const msgVpns = selectedRow?.msgVpnName;
    const msgVpnSn = selectedId?.mlsnSn;
    const msnId = selectedMsnId?.msnId;

    console.log("VPN Info :::", msgVpns, msgVpnSn, msnId)


** redux에 vpn 저장하는 방법 **
import {setSelectedRow, setSelectedId, setSelectedMsnId} from "@/redux/slices/vpn/vpnSlice";
    dispatch(setSelectedRow({ msgVpnName: '저장할 msgVpn 이름' }));
    dispatch(setSelectedId({ mlsnSn: '저장할 mlsn 시리얼 번호 (숫자)' }));
    dispatch(setSelectedMsnId({ msnId: '저장할 msn 아이디 (브로커 이름)' }));


** redux에서 queue 정보 불러오는 방법 **
import { useAppSelector } from "@/hook/hook";
    const selectedQueue = useAppSelector((state) => state.queue.selectedQueue);
    const queueName = selectedQueue?.queueName;
    console.log("Queue Name ::", queueName)


** redux에 queue 저장하는 방법 **
import { setSelectedQueue } from "@/redux/slices/queue/queueSlice";
    dispatch(setSelectedQueue({ queueName: '저장할 queue' }));
*/

const DashStatusTable = () => {
    const dispatch: any = useAppDispatch();
    const router = useRouter();
    const selectMsnStatus = createSelector(
        (state: any) => state.dashboard,
        (dashboardData: DashboardState) => ({ period: dashboardData.msnPeriod, msnStatus: dashboardData.msnStatus })
    )
    const selectMsnData = useAppSelector(selectMsnStatus);
    const selectPending = createSelector(
        (state: any) => state.dashboard,
        (dashboardData: DashboardState) => ({ period: dashboardData.pendingPeriod, pendingData: dashboardData.pendingData })
    )
    const selectPendingData = useAppSelector(selectPending);
    const selectHighTPS = createSelector(
        (state: any) => state.dashboard,
        (dashboardData: DashboardState) => ({ period: dashboardData.tpsPeriod, highTPSData: dashboardData.highTPSData })
    )
    const selectHighTPSData = useAppSelector(selectHighTPS);
    const selectLowTPS = createSelector(
        (state: any) => state.dashboard,
        (dashboardData: DashboardState) => ({ period: dashboardData.tpsPeriod, lowTPSData: dashboardData.lowTPSData })
    )
    const selectLowTPSData = useAppSelector(selectLowTPS);

    const handleGoToVPNSummary = (msn: string | null) => {
        if (msn) {
            dispatch(setSelectedMsnId({ msnId: msn }));
            /* clearing vpn */
            dispatch(setSelectedRow({ msgVpnName: '' }));
            dispatch(setSelectedId({ mlsnSn: '' }));
        }
        router.replace('/mlsnm');
    }

    const handleGoToQueueSummary = (data: any) => {
        const cellValue = data?.queue;
        const tokens = (cellValue && cellValue.length > 0) ? cellValue.split(">") : [];
        if (tokens && tokens.length >= 3) {
            // mlsnSn 값이 필수 항목이라 추가 함.
            const mlsnSnVal = tokens[0].concat(',').concat(tokens[1]);
            const mlsnSnInfo = Buffer.from(mlsnSnVal).toString("base64");

            dispatch(setSelectedMsnId({ msnId: tokens[0] }));
            dispatch(setSelectedRow({ msgVpnName: tokens[1] }));
            dispatch(setSelectedId({ mlsnSn: mlsnSnInfo }));
            dispatch(setSelectedQueue({ queueName: tokens[2] }));
        }
        router.replace('/channel');
    }

    const handleGoToMonitoring = (data: any) => {
        const cellValue = data?.queue;
        const tokens = (cellValue && cellValue.length > 0) ? cellValue.split(">") : [];
        if (tokens && tokens.length >= 3) {
            router.replace(`/monitor?msn=${tokens[0]}&mlsn=${tokens[1]}&queues=${tokens[2]}`);
        } else {
            router.replace('/monitor');
        }
    }

    const defaultQueueMenu = [
        { name: RES_MENU_GOTO_QUEUE, handler: handleGoToQueueSummary },
        { name: RES_MENU_GOTO_MON, handler: handleGoToMonitoring },
    ]

    const msnReactTableOption = {
        headerVisible: false,
        height: TableHeight,
        minHeight: TableHeight,
        rowHeight: TableRowHeight,
        alignColumns :[ "cell-content-right-nopad", "cell-content-left-nopad", 'cell-content-right'],
        columns : [
            {
                accessorKey: HA_HOST_PRIMARY,
                cell : (info: any) => <span className={(info.getValue() === HOST_STATUS_ALIVE) ? "sol_circle_green" : "sol_circle_red"}></span>,
                size: 40,
                enableSorting: false,
            },
            {
                accessorKey: HA_HOST_SECONDARY,
                cell : (info: any) => <span className={(info.getValue() === HOST_STATUS_ALIVE) ? "sol_circle_green" : "sol_circle_red"}></span>,
                size: 40,
                enableSorting: false,
            },
            {
                accessorKey: 'msn',
                grow: 1,
                cell: (info: any) => <OverflowTip info={info} textAlign={'right'}/>,
                enableSorting: false,
            },
        ]
    }

    const [msn, setMsn] = useState<any[]>([]);
    useEffect(() => {
        if (selectMsnData.msnStatus.length > 0) {
            const msnData = Array.from({ length: selectMsnData.msnStatus.length }, (_, index) => {
                return ({ primary: selectMsnData.msnStatus[index].primary, secondary: selectMsnData.msnStatus[index].secondary, msn: selectMsnData.msnStatus[index].msn });
            })
            setMsn(msnData);
        }
    }, [selectMsnData.msnStatus])

    const pendingReactTableOption = {
        headerVisible: false,
        height: TableHeight,
        minHeight: TableHeight,
        rowHeight: TableRowHeight,
        alignColumns :[ "cell-content-left", "cell-content-right"],
        columns : [
            {
                accessorKey: 'queue',
                grow: 1,
                cell: (info: any) => <OverflowTip info={info} textAlign={'left'}/>,
                enableSorting: false,
            },
            {
                accessorKey: 'count',
                size: 80,
                minSize: 80,
                maxSize: 80,
                grow: false,
                enableSorting: false,
            },
        ]
    }


    const [pending, setPending] = useState<any[]>([]);
    useEffect(() => {
        setPending(Array.from({ length: selectPendingData.pendingData.length }, (_, index) => {
            return { queue: `${selectPendingData.pendingData[index].msn}>${selectPendingData.pendingData[index].mlsn}>${selectPendingData.pendingData[index].queue}`, 
                    count: `${Math.round(selectPendingData.pendingData[index].count).toLocaleString('en-US')}` }
        }));
    }, [selectPendingData.pendingData])

    const highTPSReactTableOption = {
        headerVisible: false,
        height: TableHeight,
        minHeight: TableHeight,
        rowHeight: TableRowHeight,
        alignColumns :[ "cell-content-left", "cell-content-right", "cell-content-right"],
        columns : [
            {
                accessorKey: 'queue',
                grow:1,
                cell: (info: any) => <OverflowTip info={info} textAlign={'left'}/>,
                enableSorting: false,
            },
            {
                accessorKey: 'count',
                size: 100,
                minSize: 100,
                maxSize: 100,
                grow: false,
                enableSorting: false,
            },
            {
                accessorKey: 'rate',
                size: 70,
                minSize: 70,
                maxSize: 70,
                grow: false,
                cell: (info: any) => <span className='sol_color_red'>{info.getValue()}</span>,
                enableSorting: false,
            }
        ]
    }



    const [highTPS, setHighTPS] = useState<any[]>([]);
    useEffect(() => {
        setHighTPS(Array.from({ length: selectHighTPSData.highTPSData.length }, (_, index) => {
            return {
                queue: `${selectHighTPSData.highTPSData[index].msn}>${selectHighTPSData.highTPSData[index].mlsn}>${selectHighTPSData.highTPSData[index].queue}`,
                count: `${ConvCountUnit(Math.round(selectHighTPSData.highTPSData[index].inRate))}/${ConvCountUnit(Math.round(selectHighTPSData.highTPSData[index].avgInRate))}`,
                rate: `${Math.round((selectHighTPSData.highTPSData[index].inRate / selectHighTPSData.highTPSData[index].avgInRate) * 100)}%`
            }
        }));
    }, [selectHighTPSData.highTPSData])

    const lowTPSReactTableOption = {
        headerVisible: false,
        height: TableHeight,
        minHeight: TableHeight,
        rowHeight: TableRowHeight,
        alignColumns :[ "cell-content-left", "cell-content-right", "cell-content-right"],
        columns : [
            {
                accessorKey: 'queue',
                grow: 1,
                cell: (info: any) => <OverflowTip info={info} textAlign={'left'}/>,
                enableSorting: false,
            },
            {
                accessorKey: 'count',
                size: 100,
                minSize: 100,
                maxSize: 100,
                grow: false,
                enableSorting: false,
            },
            {
                accessorKey: 'rate',
                size: 70,
                minSize: 70,
                maxSize: 70,
                grow: false,
                cell: (info: any) => <span className='sol_color_red'>{info.getValue()}</span>,
                enableSorting: false,
            }
        ]
    }
    const [lowTPS, setLowTPS] = useState<any[]>([]);
    useEffect(() => {
        setLowTPS(Array.from({ length: selectLowTPSData.lowTPSData.length }, (_, index) => {
            return {
                queue: `${selectLowTPSData.lowTPSData[index].msn}>${selectLowTPSData.lowTPSData[index].mlsn}>${selectLowTPSData.lowTPSData[index].queue}`,
                count: `${ConvCountUnit(Math.round(selectLowTPSData.lowTPSData[index].inRate))}/${ConvCountUnit(Math.round(selectLowTPSData.lowTPSData[index].avgInRate))}`,
                rate: `${Math.round((selectLowTPSData.lowTPSData[index].inRate / selectLowTPSData.lowTPSData[index].avgInRate) * 100)}%`
            }
        }));
    }, [selectLowTPSData.lowTPSData])

    return (
        <React.Fragment>
            <Row>
                <Col xl={2}>
                    <div className="sol_box_p0_deeplight sol_box_shadow">
                        <div className='sol_dash_box'>
                            <DashboardTitle title={RES_TBL_TITLE_BROKER_STATUS} /> 
                            <DashReactTable tableData={msn} tableOption={msnReactTableOption} /> 
                        </div>
                    </div>
                </Col>
                <Col xl={10}>
                    <Row>
                        <Col xl={4}>
                            <div className="sol_box_p0_deeplight sol_box_shadow">
                                <div className='sol_dash_box'>
                                    <DashboardTitle title={RES_TBL_TITLE_PENDING} dropMenu={defaultQueueMenu} data={(pending.length > 0)? pending[0] : undefined}/>
                                    <DashReactTable contextMenuOption={defaultQueueMenu} tableData={pending} tableOption={pendingReactTableOption} />
                                </div>
                            </div>
                        </Col>
                        <Col xl={4}>
                            <div className="sol_box_p0_deeplight sol_box_shadow">
                                <div className='sol_dash_box'>
                                    <DashboardTitle title={RES_TBL_TITLE_HIGH_TPS} dropMenu={defaultQueueMenu} data={(highTPS.length > 0)? highTPS[0] : undefined} />
                                    <DashReactTable contextMenuOption={defaultQueueMenu} tableData={highTPS} tableOption={highTPSReactTableOption} />
                                </div>
                            </div>
                        </Col>
                        <Col xl={4}>
                            <div className="sol_box_p0_deeplight sol_box_shadow">
                                <div className='sol_dash_box'>
                                    <DashboardTitle title={RES_TBL_TITLE_LOW_TPS} dropMenu={defaultQueueMenu} data={(lowTPS.length > 0)? lowTPS[0] : undefined} />
                                    <DashReactTable contextMenuOption={defaultQueueMenu} tableData={lowTPS} tableOption={lowTPSReactTableOption} />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>

        </React.Fragment>
    );
};

export default DashStatusTable;
