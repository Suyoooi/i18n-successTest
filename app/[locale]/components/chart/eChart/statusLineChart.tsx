import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { FONT_DEFAULT_COLOR } from "@/data/color/chartColor";

interface StatusLineProps {
  widthVal: string | number;
  heightVal: string | number;
  statusData: any[];
}

const StatusLineEChart: React.FC<StatusLineProps> = ({
  widthVal,
  heightVal,
  statusData,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let chartInstance: echarts.ECharts | null = null;

    const data1 = statusData.map((data) => [
      data.clctDt,
      data.haType === 1 ? 10 : null,
    ]);
    const data2 = statusData.map((data) => [
      data.clctDt,
      data.haType === 2 ? 10 : null,
    ]);

    // console.log("data1", data1);
    // console.log("data2", data2);

    if (chartRef.current) {
      chartInstance = echarts.init(chartRef.current);

      chartInstance.setOption({
        tooltip: {
          trigger: "axis",
          formatter: function (params: any) {
            let result = `${params[0].axisValueLabel}<br/>`;
            params.forEach((param: any) => {
              if (param.data[1] !== null) {
                result += `<div style="font-size: 13px;">${param.marker}${param.seriesName}: ${param.data[1]}</div>`;
              }
            });
            return result;
          },
          textStyle: {
            fontSize: 13,
          },
        },
        xAxis: {
          type: "time",
          axisLabel: {
            formatter: (value: number) => {
              return echarts.time.format(value, "{HH}:{mm}", false);
            },
            textStyle: {
              color: FONT_DEFAULT_COLOR,
            },
          },
        },
        yAxis: {
          type: "value",
          show: false,
        },
        series: [
          {
            name: "Primary",
            type: "line",
            data: data1,
            itemStyle: {
              color: "rgba(242, 73, 92, 0.8)",
            },
            areaStyle: {
              color: "rgba(242, 73, 92, 0.3)",
            },
            showSymbol: false,
          },
          {
            name: "Secondary",
            type: "line",
            data: data2,
            itemStyle: {
              color: "rgba(87, 148, 242, 0.8)",
            },
            areaStyle: {
              color: "rgba(87, 148, 242, 0.3)",
            },
            showSymbol: false,
          },
        ],
        grid: {
          left: "1%",
          right: "3%",
          bottom: "13%",
          top: "10%",
          containLabel: true,
        },
        legend: {
          data: ["Primary", "Secondary"],
          left: "center",
          top: "bottom",
          textStyle: {
            color: FONT_DEFAULT_COLOR,
          },
          icon: "rect",
        },
      });

      const resizeChart = () => {
        if (chartInstance) {
          chartInstance.resize();
        }
      };

      window.addEventListener("resize", resizeChart);

      return () => {
        window.removeEventListener("resize", resizeChart);
        if (chartInstance) {
          chartInstance.dispose();
        }
      };
    }
  }, [statusData]);

  return (
    <div
      ref={chartRef}
      style={{ width: widthVal, height: heightVal, backgroundColor: "#2f3032" }}
    />
  );
};

export default StatusLineEChart;
