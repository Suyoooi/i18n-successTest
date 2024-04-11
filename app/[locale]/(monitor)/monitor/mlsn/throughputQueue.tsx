import React from "react";
import ReactEChart from "@/app/[locale]/(monitor)/monitor/common/chart/echarts/ReactEChart";
import { GetYAxisFormatter, YFormatType } from "@/data/monitor/chartUtils";
import EChartOption from "@/app/[locale]/(monitor)/monitor/common/chart/echarts/EChartOption";
import { GetChartColors } from "@/data/monitor/chartUtils";
import { createSelector } from "@reduxjs/toolkit";
import { useAppSelector } from "@/hook/hook";
import { MonitorQueueState } from "@/redux/slices/monitoring-queue/reducer";
import { IN_BYTE_RATE } from "@/data/monitor/chartConstants";
import { dataSourceType } from "@/data/monitor/chartConstants";
import { RES_CHART_THROUGHPUT_TITLE } from "@/data/monitor/resources";

interface ChartProps {
  widthVal?: string;
  heightVal?: string;
}

const ThroughputQueue = (chartProps: ChartProps) => {
  const selectTPSData = createSelector(
    (state: any) => state.monitorQueue,
    (monitoringData: MonitorQueueState) => ({
      tpsValueMode: monitoringData.tpsInValueMode,
    })
  );
  const monitoringTPSData = useAppSelector(selectTPSData);

  return (
    <React.Fragment>
      <ReactEChart
        dataSourceType={dataSourceType.THROUGHPUT}
        widthVal={chartProps.widthVal}
        heightVal={chartProps.heightVal}
        chartHeader={{ title: RES_CHART_THROUGHPUT_TITLE }}
        chartOptions={EChartOption({
          chartType: "line",
          colors: GetChartColors(dataSourceType.THROUGHPUT),
          yFormatter:
            monitoringTPSData.tpsValueMode === IN_BYTE_RATE
              ? GetYAxisFormatter(YFormatType.MB)
              : GetYAxisFormatter(YFormatType.COUNT),
        })}
      />
    </React.Fragment>
  );
};

export default ThroughputQueue;
