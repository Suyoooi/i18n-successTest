import React, { useEffect, useRef } from "react";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  BarController,
} from "chart.js";
import { FONT_DEFAULT_COLOR } from "@/data/color/chartColor";

// 필요한 컨트롤러와 구성 요소 등록
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  BarController
);

interface StackedBarChartProps {
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    stack: string;
  }[];
  labels: string[];
  widthVal: number;
  heightVal: number;
}

const StackedBar: React.FC<StackedBarChartProps> = ({
  datasets,
  labels,
  widthVal,
  heightVal,
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        const chart = new Chart(ctx, {
          type: "bar",
          data: {
            labels,
            datasets,
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: "x",
            scales: {
              x: {
                ticks: {
                  color: FONT_DEFAULT_COLOR,
                },
                stacked: true,
                beginAtZero: true,
              },
              y: {
                stacked: true,
                ticks: {
                  color: FONT_DEFAULT_COLOR,
                  callback: function (value: any, index, values) {
                    return Math.abs(value);
                  },
                },
              },
            },
            plugins: {
              tooltip: {
                yAlign: "bottom",
                titleAlign: "center",
                callbacks: {
                  label: function (context: any) {
                    return `${context.dataset.label} ${Math.abs(context.raw)}`;
                  },
                },
              },
              legend: {
                position: "bottom",
                labels: {
                  boxWidth: 14,
                  boxHeight: 14,
                  pointStyle: "rectRounded",
                  usePointStyle: true,
                },
              },
            },
            // 클릭한 차트 정보
            onClick: (event, activeElements, chart) => {
              if (activeElements.length > 0) {
                const activeElement = activeElements[0];
                const datasetIndex = activeElement.datasetIndex;
                const dataIndex = activeElement.index;
                const datasetLabel = chart.data.datasets[datasetIndex].label;
                const dataValue =
                  chart.data.datasets[datasetIndex].data[dataIndex];
                //   const label = chart.data.labels[dataIndex];
                console.log(
                  `Dataset Label: ${datasetLabel}, Data Value: ${dataValue}`
                  //   `Label: ${label}`
                );
              }
            },
          },
        });

        return () => chart.destroy();
      }
    }
  }, [labels, widthVal, heightVal, datasets]);

  return <canvas ref={chartRef} width={widthVal} height={heightVal}></canvas>;

  // return <canvas ref={chartRef} style={{height:'30vh', width:'50vw'}}></canvas>;
};

export default StackedBar;
