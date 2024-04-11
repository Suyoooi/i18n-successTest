import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { chartJsProps } from "@/types/chartJs";

const DonutEChart: React.FC<chartJsProps> = ({
  data,
  labels,
  widthVal,
  heightVal,
  id,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let chartInstance: echarts.ECharts | null = null;

    // if (chartRef.current) {
    //   chartInstance = echarts.init(chartRef.current, undefined, {
    //     width: widthVal,
    //     height: heightVal,
    //   });

    if (chartRef.current) {
      chartInstance = echarts.init(chartRef.current);

      chartInstance.setOption({
        title: {
          text: data[0],
          left: "center",
          top: "center",
        },
        series: [
          {
            type: "pie",
            data: data.map((value, index) => ({
              value,
              name: labels[index],
              itemStyle: {
                color: index === 0 ? "#5794f2" : "#a2a4a9",
              },
            })),
            radius: ["75%", "100%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: false,
                fontWeight: "bold",
              },
            },
          },
        ],
        tooltip: {
          trigger: "item",
        },
      });
    }

    return () => {
      if (chartInstance) {
        chartInstance.dispose();
      }
    };
  }, [data, labels, widthVal, heightVal, id]);

  return (
    <>
      <div ref={chartRef} style={{ width: widthVal, height: heightVal }} />
    </>
  );
};

export default DonutEChart;
