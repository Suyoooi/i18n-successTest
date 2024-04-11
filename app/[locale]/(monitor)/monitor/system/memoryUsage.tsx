"use client";

import React, { useEffect, useRef, useState } from "react";
import ReactEChart from "@/app/[locale]/(monitor)/monitor/common/chart/echarts/ReactEChart";
import { GetYAxisFormatter, YFormatType } from "@/data/monitor/chartUtils";
import EChartOption from "@/app/[locale]/(monitor)/monitor/common/chart/echarts/EChartOption";
import { GetChartColors } from "@/data/monitor/chartUtils";
import { dataSourceType } from "@/data/monitor/chartConstants";
import { RES_CHART_TITLE_MEMORY_USAGE } from "@/data/monitor/resources";

interface ChartProps {
  widthVal?: string;
  heightVal?: string;
}

const MemoryUsage = (chartProps: ChartProps) => {
  return (
    <React.Fragment>
      <ReactEChart
        dataSourceType={dataSourceType.MEMORY_USAGE}
        widthVal={chartProps.widthVal}
        heightVal={chartProps.heightVal}
        chartOptions={EChartOption({
          chartType: "line",
          chartTitle: RES_CHART_TITLE_MEMORY_USAGE,
          colors: GetChartColors(dataSourceType.MEMORY_USAGE),
          yFormatter: GetYAxisFormatter(YFormatType.GB),
        })}
      />
    </React.Fragment>
  );
};

export default MemoryUsage;
