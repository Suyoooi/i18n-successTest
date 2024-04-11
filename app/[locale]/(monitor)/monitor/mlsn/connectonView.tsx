import React from "react";
import ReactEChart from "@/app/[locale]/(monitor)/monitor/common/chart/echarts/ReactEChart";
import { GetYAxisFormatter, YFormatType } from "@/data/monitor/chartUtils";
import EChartOption from "@/app/[locale]/(monitor)/monitor/common/chart/echarts/EChartOption";
import { GetChartColors } from "@/data/monitor/chartUtils";
import { dataSourceType } from "@/data/monitor/chartConstants";
import { RES_CHART_CONNECTION_TITLE } from "@/data/monitor/resources";

interface ChartProps {
  widthVal?: string;
  heightVal?: string;
}

const ConnectionView = (chartProps: ChartProps) => {
  return (
    <React.Fragment>
      <ReactEChart
        dataSourceType={dataSourceType.CONNECTION}
        widthVal={chartProps.widthVal}
        heightVal={chartProps.heightVal}
        chartHeader={{ title: RES_CHART_CONNECTION_TITLE }}
        chartOptions={EChartOption({
          chartType: "bar",
          colors: GetChartColors(dataSourceType.CONNECTION),
          stackMode: true,
          yFormatter: GetYAxisFormatter(YFormatType.COUNT),
        })}
      />
    </React.Fragment>
  );
};

export default ConnectionView;
