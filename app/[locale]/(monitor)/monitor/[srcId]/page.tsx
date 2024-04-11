"use client"

import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import ReactEChart from "../common/chart/echarts/ReactEChart";
import { GetSourceType, GetYAxisFormatter, YFormatType } from "@/data/monitor/chartUtils";
import EChartOption from "../common/chart/echarts/EChartOption";
import { GetChartColors } from "@/data/monitor/chartUtils";
import { CHART_DATA_MODE_COUNT, dataSourceType, monitorOptions } from "@/data/monitor/chartConstants";
import { RES_CHART_PENDING_TITLE, RES_CHART_THROUGHPUT_TITLE, RES_DETAIL_MENU_GOTO_MON, RES_DETAIL_MENU_SAVE_FILE, RES_DETAIL_TITLE } from "@/data/monitor/resources";
import { CSVLink } from 'react-csv';
import { getDataSourceSelector } from "../common/data/DataSource";
import { useAppSelector } from "@/hook/hook";


const Detail = (props: any) => {
    const router = useRouter();
    const handleMonitoryType = (selectedValue: any) => {
        router.replace(`/monitor/${selectedValue}`);
    }
    const handleBack = () => {
        router.back();
    }

    const sourceType = GetSourceType(props.params.srcId);
    const monitoringData: any = useAppSelector(getDataSourceSelector(sourceType));
    
    const [csvData, setCsvData] = useState<any[]>([]);
    const csvLink = useRef<CSVLink & HTMLAnchorElement & { link: HTMLAnchorElement }>(null);
    const handleChartData = async () => {
        setCsvData(Array.from({ length: monitoringData.names.length }, (_, index) => { return { name: monitoringData.names[index], data: monitoringData.datas[index] } }));
    }
    useEffect(() => {
        if (csvData.length > 0) {
            csvLink.current?.link.click();
        }
    }, [csvData])

    return (
        <React.Fragment>
            <div className="mon-detail-container">
                <div className="mon-detail-header">
                    <div className="sol_navigation_area d-flex align-items-center">
                        <button type="button" className="btn btn-icon" onClick={handleBack}><i className="sol_i_prevgo"></i></button>
                        <p className="col-form-label sol_mr_10 sol_navi_tit">{RES_DETAIL_TITLE}</p>
                        <select className="form-select sol_w220 sol_mr_20"
                            onChange={(selected: any) => handleMonitoryType(selected.target.value)}
                            value={sourceType}>
                            {
                                monitorOptions.map((item: any) => <option value={item.value} key={item.label}>{item.label}</option>)
                            }
                        </select>
                    </div>
                </div>
                <div className="mon-detail-body">
                    <ReactEChart minHeightVal="sol_sum_graph_600" dataSourceType={sourceType} heightVal="40%"
                        chartOptions={EChartOption({ chartType: (sourceType === dataSourceType.CONNECTION) ? 'bar' : 'line', legendPos: "right", colors: GetChartColors(sourceType), yFormatter: (monitoringData.valueMode === CHART_DATA_MODE_COUNT)? GetYAxisFormatter(YFormatType.COUNT):  GetYAxisFormatter(YFormatType.BYTE) })} 
                        // chartHeader={
                        //     { enableHambuger: false, title : (sourceType === dataSourceType.PENDING) ? RES_CHART_PENDING_TITLE : ( (sourceType === dataSourceType.THROUGHPUT)? RES_CHART_THROUGHPUT_TITLE : undefined)}
                        // }
                    />
                </div>
                <div className="mon-detail-btn">
                    <div className="d-flex gap-2 justify-content-end">
                        <button className="btn btn-outline-light" onClick={handleBack}>{RES_DETAIL_MENU_GOTO_MON}</button>
                        <div>
                            <button className="btn btn-outline-secondary" onClick={handleChartData}>{RES_DETAIL_MENU_SAVE_FILE}</button>
                            <CSVLink style={{ textDecoration: 'none' }} ref={csvLink} data={csvData} filename={`chart-data-${props.params.srcId}.csv`} className="hidden" target='_blank' />
                        </div>
                    </div>
                </div>
            </div>

        </React.Fragment>
    );
}

export default Detail;
