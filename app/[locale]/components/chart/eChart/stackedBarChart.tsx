import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { FONT_DEFAULT_COLOR } from "@/data/color/chartColor";

interface ChartProps {
  seriesInfo: any;
  widthVal: string;
  heightVal: string;
  onChartClick: any;
}

function formatToTime(timestamp: any) {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

const StackedBarEChart: React.FC<ChartProps> = ({
  seriesInfo,
  widthVal,
  heightVal,
  onChartClick,
}) => {
  const chartRefs = useRef<(HTMLDivElement | null)[]>([]);

  console.log("seriesInfo ::::: ", seriesInfo);

  useEffect(() => {
    const chartInstances = chartRefs.current.map((ref, index) =>
      ref ? echarts.init(ref) : null
    );

    // 차트 크기 조정
    const resizeCharts = () => {
      chartInstances.forEach((instance) => {
        if (instance) {
          instance.resize();
        }
      });
    };

    const updateChart = (chartInstance: echarts.ECharts | null) => {
      if (!chartInstance) return;

      const option = {
        animation: false,
        legend: {
          show: true,
          selectedMode: true,
          textStyle: {
            color: FONT_DEFAULT_COLOR,
          },
          left: "center",
          top: "bottom",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          order: "seriesDesc",
        },
        grid: {
          top: "10%",
          left: "3%",
          right: "2%",
          bottom: "12%",
          containLabel: true,
        },
        xAxis: {
          type: "time",
          axisLabel: {
            show: true,
            interval: 0,
            formatter: (value: number) => {
              return `${formatToTime(value)}`;
            },
            textStyle: {
              color: FONT_DEFAULT_COLOR,
            },
          },
          boundaryGap: [0.01, 0.01],
        },
        yAxis: {
          type: "value",
          splitLine: {
            show: false,
          },
          axisTick: {
            show: true,
          },
          axisLabel: {
            textStyle: {
              color: FONT_DEFAULT_COLOR,
            },
          },
          axisLine: {
            show: true,
          },
        },
        series: seriesInfo,
      };
      chartInstance.setOption(option);
      chartInstance.on("click", function (params: any) {
        console.log(params);
        onChartClick(params);
      });
    };

    chartInstances.forEach((instance, index) => updateChart(instance));

    if (chartInstances.filter(Boolean).length > 1) {
      echarts.connect(chartInstances.filter(Boolean) as echarts.ECharts[]);
    }
    window.addEventListener("resize", resizeCharts);

    return () => {
      window.removeEventListener("resize", resizeCharts);
      chartInstances.forEach((instance) => {
        if (instance) {
          instance.off("restore");
          instance.dispose();
        }
      });
    };
  }, [seriesInfo, widthVal, heightVal]);

  return (
    <>
      <div
        ref={(el) => (chartRefs.current[0] = el)}
        style={{ width: widthVal, height: heightVal }}
      />
    </>
  );
};

export default StackedBarEChart;
