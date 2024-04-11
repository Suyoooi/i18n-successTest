"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hook/hook";
import { MonitorQueueState, updateReloadFlag, updateValueMode } from "@/redux/slices/monitoring-queue/reducer";
import { createSelector } from "@reduxjs/toolkit";
import { MonitorState } from "@/redux/slices/monitoring/reducer";
import { RES_CHART_DATA_BYTES_DISP, RES_CHART_DATA_COUNT_DISP, RES_CHART_MENU_DETAIL, RES_CHART_MENU_RESET, RES_CHART_MENU_ZOOMIN, RES_CHART_MENU_ZOOMOUT } from "@/data/monitor/resources";
import { CHART_DATA_MODE_COUNT, CHART_DATA_MODE_BYTES, dataSourceType, IN_MSG_RATE, PENDING_CNT } from "@/data/monitor/chartConstants";

interface ChartProps {
    header: any;
    dataSourceType: string;
    menuHandler ?: (item : string)=> void;
}

const ChartHeader = (chartProps: ChartProps) => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const selectMonitorState = createSelector(
        (state: any) => state.monitorHeader,
        (monitoringData: MonitorState) => ({ nodeState: monitoringData.curNode })
    )
    const monitorNodeState = useAppSelector(selectMonitorState);

    const selectTpsMonitoringData = createSelector(
        (state: any) => state.monitorQueue,
        (monitoringData: MonitorQueueState) => ({ pendingValueMode: monitoringData.pendingValueMode, tpsInValueMode : monitoringData.tpsInValueMode, tpsOutValueMode : monitoringData.tpsOutValueMode })
    )
    const valueModeSelector = useAppSelector(selectTpsMonitoringData);

    const [yAxisMode, setYAxisMode] = useState<string|null>((chartProps.dataSourceType === dataSourceType.PENDING? 
        ((valueModeSelector.pendingValueMode === PENDING_CNT)? CHART_DATA_MODE_COUNT : CHART_DATA_MODE_BYTES)
        : (chartProps.dataSourceType === dataSourceType.THROUGHPUT)? 
            ((valueModeSelector.tpsInValueMode === IN_MSG_RATE)? CHART_DATA_MODE_COUNT : CHART_DATA_MODE_BYTES): CHART_DATA_MODE_COUNT));

    const handleYAxisMode= (mode: string) => {
        if (yAxisMode!== mode) {
            dispatch(updateValueMode({dataSourceType: chartProps.dataSourceType, valueMode: mode}));
            dispatch(updateReloadFlag({dataSourceType: chartProps.dataSourceType, reloadFlag: true}))
            setYAxisMode(mode);
        }
    };

    const handleChartMenu = (item: string) => {
        switch(item) {
            case RES_CHART_MENU_ZOOMIN:
            case RES_CHART_MENU_ZOOMOUT:
            case RES_CHART_MENU_RESET:
                {
                    if(chartProps.menuHandler){
                        chartProps.menuHandler(item);
                        if(item === RES_CHART_MENU_RESET && (chartProps.dataSourceType === dataSourceType.PENDING || chartProps.dataSourceType === dataSourceType.THROUGHPUT))
                            dispatch(updateReloadFlag({ dataSourceType: chartProps.dataSourceType, reloadFlag: true }))
                    } 
                }
                break;
            case RES_CHART_MENU_DETAIL:
                router.push(`/monitor/${chartProps.dataSourceType}`);
                break;
            default:
                console.log("under-construction");
        }
    }

    return (
        <React.Fragment>
            <div className="d-flex align-items-center position-relative">
                <h4><span className="sol_h4_gray">{`${chartProps.header.title} `}</span>
                    {
                        (monitorNodeState.nodeState && (chartProps.dataSourceType === dataSourceType.PENDING || chartProps.dataSourceType === dataSourceType.THROUGHPUT))
                            && (<span className="sol_text_a">[
                            <a className={`${(yAxisMode === CHART_DATA_MODE_COUNT) ? "active" : ""}`} onClick={() => handleYAxisMode(CHART_DATA_MODE_COUNT)}>{` ${RES_CHART_DATA_COUNT_DISP} `}</a>
                            l
                            <a className={`${(yAxisMode === CHART_DATA_MODE_BYTES) ? "active" : ""}`} onClick={() => handleYAxisMode(CHART_DATA_MODE_BYTES)}>{` ${RES_CHART_DATA_BYTES_DISP} `}</a>
                            ]
                        </span>)
                    }
                </h4>
                {
                    (chartProps.header.enableHambuger !== false) && // undefined => enable
                    <div className="btn-group position-absolute sol_rigbtn">
                        <a className="btn hstack btn-icon sol_btn_hamburger" data-bs-toggle="dropdown"><i className="sol_i_hamburger"></i></a>
                        <ul className="dropdown-menu">
                            {/* <li><a className="dropdown-item" onClick={() => handleChartMenu(RES_CHART_MENU_ZOOMIN)}>{RES_CHART_MENU_ZOOMIN}</a></li>
                        <li><a className="dropdown-item" onClick={() => handleChartMenu(RES_CHART_MENU_ZOOMOUT)}>{RES_CHART_MENU_ZOOMOUT}</a></li> */}
                            <li><a className="dropdown-item" onClick={() => handleChartMenu(RES_CHART_MENU_RESET)}>{RES_CHART_MENU_RESET}</a></li>
                            <li><a className="dropdown-item" onClick={() => handleChartMenu(RES_CHART_MENU_DETAIL)}>{RES_CHART_MENU_DETAIL}</a></li>
                        </ul>
                    </div>
                }
            </div>
        </React.Fragment>
    );
};

export default ChartHeader;
