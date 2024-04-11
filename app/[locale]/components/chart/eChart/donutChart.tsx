import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { FONT_DEFAULT_COLOR } from "@/data/color/chartColor";

interface DonutChartData {
  name: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutChartData[];
  width?: string;
  height?: string;
}

const DonutChart: React.FC<DonutChartProps> = ({ data, width, height }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let myChart: echarts.ECharts | null = null;

    const resizeChart = () => {
      if (myChart) {
        myChart.resize();
      }
    };

    if (chartRef.current) {
      myChart = echarts.init(chartRef.current);
      myChart.setOption({
        title: {
          text: data[0].value,
          left: "center",
          top: "center",
          textStyle: {
            color: FONT_DEFAULT_COLOR,
          },
        },

        tooltip: {
          show: false,
          // trigger: "item",
          // // 데이터 항목의 name이 null이 아닐 때만 툴팁 내용을 반환
          // formatter: function (params: any) {
          //   if (params.data.name !== "") {
          //     return `<div style="color: ${params.color}">${params.marker}${params.data.name}: ${params.data.value}`;
          //   }
          // },
        },
        legend: {
          show: false,
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: ["70%", "100%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 0,
              borderColor: "none",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
              formatter: function (params: any) {
                return 100 - params.value + "%";
              },
            },
            emphasis: {
              label: {
                show: false,
              },
              itemStyle: {
                shadowBlur: 0,
                shadowOffsetX: 0,
                shadowColor: "none",
              },
            },
            labelLine: {
              show: false,
            },
            data: data.map((item) => ({
              ...item,
              itemStyle: {
                color: item.color,
              },
            })),
          },
        ],
      });

      window.addEventListener("resize", resizeChart);
    }

    return () => {
      window.removeEventListener("resize", resizeChart);

      if (myChart !== null) {
        myChart.dispose();
      }
    };
  }, [data]);

  return <div ref={chartRef} style={{ width, height }} />;
};

export default DonutChart;

// ** 사용 방법 **

// const App: React.FC = () => {
//     const data = [
//       { value: 335, name: 'Direct' },
//       { value: 310, name: 'Email' },
//       { value: 234, name: 'Ad Networks' },
//       { value: 135, name: 'Video Ads' },
//       { value: 1548, name: 'Search Engines' }
//     ];

//     return <DonutChart data={data} width="600px" height="400px" />;
//   };

//   export default App;
