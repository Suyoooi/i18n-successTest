import React from "react";
import ReactEChart from "@/app/[locale]/(monitor)/monitor/common/chart/echarts/ReactEChart";
import { GetYAxisFormatter, YFormatType } from "@/data/monitor/chartUtils";
import EChartOption from "@/app/[locale]/(monitor)/monitor/common/chart/echarts/EChartOption";
import { GetChartColors } from "@/data/monitor/chartUtils";
import { createSelector } from "@reduxjs/toolkit";
import { useAppSelector } from "@/hook/hook";
import { MonitorQueueState } from "@/redux/slices/monitoring-queue/reducer";
import { PENDING_SIZE } from "@/data/monitor/chartConstants";
import { dataSourceType } from "@/data/monitor/chartConstants";
import { RES_CHART_PENDING_TITLE } from "@/data/monitor/resources";

interface ChartProps {
  widthVal?: string;
  heightVal?: string;
}

const PendingQueue = (chartProps: ChartProps) => {
  const selectQueueData = createSelector(
    (state: any) => state.monitorQueue,
    (monitoringData: MonitorQueueState) => ({
      pendingValueMode: monitoringData.pendingValueMode,
    })
  );
  const monitoringQueueData = useAppSelector(selectQueueData);

  return (
    <React.Fragment>
      <ReactEChart
        dataSourceType={dataSourceType.PENDING}
        widthVal={chartProps.widthVal}
        heightVal={chartProps.heightVal}
        chartHeader={{ title: RES_CHART_PENDING_TITLE }}
        chartOptions={EChartOption({
          chartType: "line",
          colors: GetChartColors(dataSourceType.PENDING),
          yFormatter:
            monitoringQueueData.pendingValueMode === PENDING_SIZE
              ? GetYAxisFormatter(YFormatType.MB)
              : GetYAxisFormatter(YFormatType.COUNT),
        })}
      />
    </React.Fragment>
  );
};

export default PendingQueue;
