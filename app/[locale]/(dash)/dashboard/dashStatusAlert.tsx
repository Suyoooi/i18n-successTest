"use client";

import React, { useEffect, useRef, useState } from "react";
import { Col, Row } from "reactstrap";

import { useAppSelector } from "@/hook/hook";
import { createSelector } from "@reduxjs/toolkit";
import { DashboardState } from "@/redux/slices/dashboard/reducer";
import { getDashboardAlertDetail } from "@/app/[locale]/(monitor)/monitor/helpers/api_helper";
import {
  RES_ALERT_DETAIL_PLACEHOLDER,
  RES_MENU_GOTO_MON,
  RES_MENU_GOTO_QUEUE,
  RES_MENU_GOTO_VPN,
  RES_NO_DATA,
  RES_TBL_TITLE_BROKER_STATUS,
  RES_TBL_TITLE_HIGH_TPS,
  RES_TBL_TITLE_LOW_TPS,
  RES_TBL_TITLE_PENDING,
  RES_TBL_TYPE_ALL,
  RES_TBL_TYPE_ANOMALY,
  RES_TBL_TYPE_EXCEPTION,
  RES_TBL_TYPE_FAIL,
} from "@/data/dash/resources";
import {
  ALERT_DATA_ANOMALY,
  ALERT_DATA_EXCEPTION,
  ALERT_DATA_FAILURE,
  ALERT_LEVEL_CRITICAL,
  ALERT_LEVEL_MAJOR,
  ALERT_LEVEL_MINOR,
  AlertChartOrangeColor,
  AlertChartRedColor,
  AlertChartYellowColor,
  HA_HOST_PRIMARY,
  HA_HOST_SECONDARY,
  HOST_STATUS_ALIVE,
  TableHeight,
  TableRowHeight,
} from "@/data/dash/dashConstants";
import { defaultChartOption } from "@/data/dash/dashConstants";
import { GetLocalTimeString } from "@/data/monitor/chartUtils";
import { useRouter } from "next/navigation";

// import the core library.
import ReactEChartsCore from "echarts-for-react/lib/core";
// import echarts from "echarts/types/dist/echarts";
import * as echarts from "echarts/core";
// Import charts, all with Chart suffix
import { BarChart } from "echarts/charts";
// import components, all suffixed with Component
import {
  GridComponent,
  TooltipComponent,
  TimelineComponent,
  LegendComponent,
} from "echarts/components";
// Import renderer, note that introducing the CanvasRenderer or SVGRenderer is a required step
import { CanvasRenderer } from "echarts/renderers";
import DashReactTable from "./common/dashReactTable";
import OverflowTip from "./common/overflowTip";
// Register the required components
echarts.use([
  BarChart,
  GridComponent,
  TimelineComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer,
]);

const DashStatusAlert = () => {
  const router = useRouter();

  const selectAlert = createSelector(
    (state: any) => state.dashboard,
    (dashboardData: DashboardState) => ({
      period: dashboardData.alertPeriod,
      tickValue: dashboardData.alertTickValue,
      alertData: dashboardData.alertData,
    })
  );
  const selectAlertData = useAppSelector(selectAlert);
  const [alertTableType, setAlertTableType] = useState(ALERT_DATA_ANOMALY); //all, anomaly, failure, exception
  const [series, setSeries] = useState<any[]>([]);

  const [alertChartClicked, setAlertChartClicked] = useState(false); // 한번 클릭한 이후에는 chart 업데이트 하지 않는다.
  const [alertTableData, setAlertTableData] = useState<any[]>([]);

  const updateAlertTable = (dataIndex: number, seriesData: any[]) => {
    const tableData: any[] = [];
    for (let index = 0; index < seriesData.length; index++) {
      if (
        seriesData[index] &&
        seriesData[index].hashedData[dataIndex].length > 0
      ) {
        tableData.push(...seriesData[index].hashedData[dataIndex][1]);
      }
    }
    let alertTableData: any[] = [];
    if (tableData.length > 0) {
      const descAlertData = tableData.sort((a: any, b: any) => {
        return b.label - a.label;
      });
      alertTableData = descAlertData.map((item: any) => {
        // return { id: item.id, alertLevel: item.alertLevel, time: GetLocalTimeString(item.label), title: item.title, type: item.type }
        // for ReactTable
        return {
          id: item.id,
          alertLevel: item.alertLevel,
          time: item.label,
          title: item.title,
          type: item.type,
        };
      });
    }
    setAlertTableData(alertTableData);
  };

  useEffect(() => {
    if (selectAlertData.alertData.lastLabel <= 0) return;
    const tickValue = selectAlertData.tickValue;
    let startLabel = Math.ceil(
      (selectAlertData.alertData.lastLabel - selectAlertData.period + 1) /
        tickValue
    );
    let lastLabel = Math.ceil(selectAlertData.alertData.lastLabel / tickValue);
    let tickCount = lastLabel - startLabel + 1;
    startLabel *= tickValue;
    lastLabel *= tickValue;

    const criticalData = {
      name: "Critical",
      type: "bar",
      color: [AlertChartRedColor],
      stack: "total",
      showSymbol: false,
      data: [],
      hashedData: Array.from({ length: tickCount }, (_, index) => {
        return [startLabel + index * tickValue, []];
      }),
    };
    const majorData = {
      name: "Major",
      type: "bar",
      color: [AlertChartOrangeColor],
      stack: "total",
      showSymbol: false,
      data: [],
      hashedData: Array.from({ length: tickCount }, (_, index) => {
        return [startLabel + index * tickValue, []];
      }),
    };
    const minorData = {
      name: "Minor",
      type: "bar",
      stack: "total",
      color: [AlertChartYellowColor],
      showSymbol: false,
      data: [],
      hashedData: Array.from({ length: tickCount }, (_, index) => {
        return [startLabel + index * tickValue, []];
      }),
    };

    if (alertTableType === ALERT_DATA_ANOMALY) {
      selectAlertData.alertData.anomaly.forEach((item) => {
        const index =
          item.label - startLabel > 0
            ? Math.ceil((item.label - startLabel) / tickValue)
            : 0;
        if (item.alertLevel === ALERT_LEVEL_CRITICAL) {
          (criticalData.hashedData[index][1] as any[]).push({
            ...item,
            type: ALERT_DATA_ANOMALY,
          });
        } else if (item.alertLevel === ALERT_LEVEL_MAJOR) {
          (majorData.hashedData[index][1] as any[]).push({
            ...item,
            type: ALERT_DATA_ANOMALY,
          });
        } else if (item.alertLevel === ALERT_LEVEL_MINOR) {
          (minorData.hashedData[index][1] as any[]).push({
            ...item,
            type: ALERT_DATA_ANOMALY,
          });
        } else {
        }
      });
    }

    if (alertTableType === ALERT_DATA_FAILURE) {
      selectAlertData.alertData.failure.forEach((item) => {
        const index =
          item.label - startLabel > 0
            ? Math.ceil((item.label - startLabel) / tickValue)
            : 0;
        if (item.alertLevel === ALERT_LEVEL_CRITICAL) {
          (criticalData.hashedData[index][1] as any[]).push({
            ...item,
            type: ALERT_DATA_FAILURE,
          });
        } else if (item.alertLevel === ALERT_LEVEL_MAJOR) {
          (majorData.hashedData[index][1] as any[]).push({
            ...item,
            type: ALERT_DATA_FAILURE,
          });
        } else if (item.alertLevel === ALERT_LEVEL_MINOR) {
          (minorData.hashedData[index][1] as any[]).push({
            ...item,
            type: ALERT_DATA_FAILURE,
          });
        } else {
        }
      });
    }
    if (alertTableType === ALERT_DATA_EXCEPTION) {
      selectAlertData.alertData.exception.forEach((item) => {
        const index =
          item.label - startLabel > 0
            ? Math.ceil((item.label - startLabel) / tickValue)
            : 0;
        if (item.alertLevel === ALERT_LEVEL_CRITICAL) {
          (criticalData.hashedData[index][1] as any[]).push({
            ...item,
            type: ALERT_DATA_EXCEPTION,
          });
        } else if (item.alertLevel === ALERT_LEVEL_MAJOR) {
          (majorData.hashedData[index][1] as any[]).push({
            ...item,
            type: ALERT_DATA_EXCEPTION,
          });
        } else if (item.alertLevel === ALERT_LEVEL_MINOR) {
          (minorData.hashedData[index][1] as any[]).push({
            ...item,
            type: ALERT_DATA_EXCEPTION,
          });
        } else {
        }
      });
    }

    const seriesData = [
      {
        ...minorData,
        data: Array.from(
          { length: minorData.hashedData.length },
          (_, index) => [
            minorData.hashedData[index][0],
            (minorData.hashedData[index][1] as any[]).length,
          ]
        ),
      },
      {
        ...majorData,
        data: Array.from(
          { length: majorData.hashedData.length },
          (_, index) => [
            majorData.hashedData[index][0],
            (majorData.hashedData[index][1] as any[]).length,
          ]
        ),
      },
      {
        ...criticalData,
        data: Array.from(
          { length: criticalData.hashedData.length },
          (_, index) => [
            criticalData.hashedData[index][0],
            (criticalData.hashedData[index][1] as any[]).length,
          ]
        ),
      },
    ];

    setSeries(seriesData);
    // 마지막 데이터 기준으로 테이블 업데이트
    if (!alertChartClicked) {
      const lastIndex = seriesData[0].data.length - 1;
      updateAlertTable(lastIndex, seriesData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectAlertData.alertData.lastLabel, alertTableType]);

  const [errorLog, setErrorLog] = useState({
    dateTime: "",
    type: "",
    title: "",
    content: "",
  });
  const callDashDetail = async (detailId: number, detailType: string) => {
    try {
      const response = await getDashboardAlertDetail({
        id: detailId,
        type: detailType,
      });
      const serverResponse = response.data ? response.data : response;
      if (
        serverResponse.responseCode < 400 &&
        serverResponse.data &&
        serverResponse.data.length > 0
      ) {
        const detailData = serverResponse.data[0]; // array type
        setErrorLog({
          dateTime: GetLocalTimeString(detailData.label),
          type: detailData.alertType,
          title: detailData.title,
          content: detailData.content,
        });
      }
    } catch (error: any) {
      console.log("error:" + error?.response?.data ?? "unknown error");
    }
  };

  const GetDashDetail = (data: any) => callDashDetail(data.id, data.type);

  const alertReactTableOption = {
    headerVisible: true,
    height: undefined,
    minHeight: TableHeight,
    rowHeight: TableRowHeight,
    rowHover: true,
    columns: [
      {
        accessorKey: "time",
        header: "Time",
        size: 200,
        minSize: 200,
        maxSize: 200,
        grow: false,
        cell: (info: any) => GetLocalTimeString(info.getValue()),
        sortDescFirst: true,
      },
      {
        accessorKey: "alertLevel",
        header: "Severity",
        size: 120,
        minSize: 120,
        maxSize: 200,
        grow: false,
        cell: (info: any) =>
          info.getValue() === ALERT_LEVEL_CRITICAL ? (
            <span style={{ color: AlertChartRedColor }}>Critical</span>
          ) : info.getValue() === ALERT_LEVEL_MAJOR ? (
            <span style={{ color: AlertChartOrangeColor }}>Major</span>
          ) : (
            <span style={{ color: AlertChartYellowColor }}>Minor</span>
          ),
        enableSorting: false,
      },
      {
        accessorKey: "title",
        header: "Title",
        grow: 1,
        cell: (info: any) => <OverflowTip info={info} textAlign={"left"} />,
        enableSorting: false,
      },
    ],
  };

  const onChartClick = (params: any) => {
    const dataIndex = params.dataIndex;
    updateAlertTable(dataIndex, series);
    setAlertChartClicked(true);
  };

  const _onEChartEvent = {
    click: onChartClick,
  };

  const handleGoToMonitoring = () => {
    router.replace(`/monitor`);
  };

  return (
    <React.Fragment>
      <Row className="h-100">
        <Col xl={7}>
          <div className="dash-col-flex-container">
            <div className="dash-col-flex-item">
              <div className="sol_box_p0_light">
                <div className="sol_dash_box">
                  <h4 className="sol_h4_gray">
                    <a
                      className={
                        alertTableType === ALERT_DATA_ANOMALY ? "active" : ""
                      }
                      onClick={() => setAlertTableType(ALERT_DATA_ANOMALY)}
                    >
                      {RES_TBL_TYPE_ANOMALY}
                    </a>
                    {" l "}
                    <a
                      className={
                        alertTableType === ALERT_DATA_FAILURE ? "active" : ""
                      }
                      onClick={() => setAlertTableType(ALERT_DATA_FAILURE)}
                    >
                      {RES_TBL_TYPE_FAIL}
                    </a>
                    {" l "}
                    <a
                      className={
                        alertTableType === ALERT_DATA_EXCEPTION ? "active" : ""
                      }
                      onClick={() => setAlertTableType(ALERT_DATA_EXCEPTION)}
                    >
                      {RES_TBL_TYPE_EXCEPTION}
                    </a>
                  </h4>
                  <div className="btn-group">
                    <a
                      className="btn hstack btn-icon sol_btn_hamburger"
                      data-bs-toggle="dropdown"
                    >
                      <i className="sol_i_hamburger"></i>
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <a
                          className="dropdown-item"
                          onClick={handleGoToMonitoring}
                        >
                          {RES_MENU_GOTO_MON}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="p-2 sol_sum_graph_200">
                  <div
                    className="block"
                    style={{
                      position: "relative",
                      minWidth: "350px",
                      width: "100%",
                      height: 0,
                      paddingBottom: `max(200px,25%)`,
                    }}
                  >
                    <ReactEChartsCore
                      echarts={echarts}
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                      }}
                      option={{ ...defaultChartOption, series: series }}
                      onEvents={_onEChartEvent}
                      lazyUpdate={true}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="dash-col-flex-remain sol_box_p0_light mt-2">
              <div className="dash-rel-area sol_sum_graph_215">
                <div className="dash-abs-area">
                  <DashReactTable
                    rowClickHandler={GetDashDetail}
                    tableData={alertTableData}
                    tableOption={alertReactTableOption}
                  />
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col xl={5}>
          <div className="sol_box_p0_light h-100 pt-2">
            <div className="sol_dash_box">
              <h4 className="sol_h4_gray" style={{ paddingLeft: "10px" }}>
                {errorLog.title ? (
                  <span>{`[${errorLog.dateTime}]  ${errorLog.title}`}</span>
                ) : (
                  <span className="sol_h4_gray">
                    {RES_ALERT_DETAIL_PLACEHOLDER}
                  </span>
                )}
              </h4>
              <div className="p-2 overflow-y-auto">
                <p
                  className="sol_color_red"
                  style={{ wordBreak: "break-all", whiteSpace: "pre-line" }}
                >
                  {errorLog.content}
                </p>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default DashStatusAlert;
