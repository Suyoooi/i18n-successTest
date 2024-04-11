// "use client";
import { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import { chartJsProps } from "@/types/chartJs";
import {
  CHART_PIE_DEFAULT,
  CHART_PIE_GRAY,
  CHART_PIE_GREEN,
  CHART_PIE_ORANGE,
  CHART_PIE_RED,
} from "@/data/color/chartColor";

Chart.register(...registerables);

const Donut: React.FC<chartJsProps> = ({
  data,
  labels,
  widthVal,
  heightVal,
  id,
}) => {
  const percentage = data[0];
  const modifiedData = data[0] > 100 ? [100, 0] : data;
  const modifiedColor =
    data[0] >= 90
      ? CHART_PIE_RED
      : data[0] >= 70
      ? CHART_PIE_ORANGE
      : data[0] === 0
      ? CHART_PIE_DEFAULT
      : CHART_PIE_GREEN;
  // useEffect(() => {
  const canvasId = `doughnutChart-${id}`;
  const doughnutChartCanvas = document.getElementById(
    canvasId
  ) as HTMLCanvasElement;
  let doughnutChartInstance: Chart<"doughnut", number[], string> | null = null;

  if (doughnutChartCanvas) {
    if (Chart.getChart(doughnutChartCanvas)) {
      Chart.getChart(doughnutChartCanvas)?.destroy();
    }
    const plugin = {
      id: "customText",
      beforeDraw: (chart: any) => {
        const width = chart.width;
        const height = chart.height;
        const ctx = chart.ctx;
        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "16px Arial";
        // ctx.fillStyle = "#A2A4A9";
        ctx.fillStyle = modifiedColor;
        // 소수점 첫째자리에서 반올림 -> 정수로 표현
        ctx.fillText(`${Math.round(percentage)}%`, width / 2, height / 2);
        ctx.restore();
      },
    };

    doughnutChartInstance = new Chart(doughnutChartCanvas, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            data: modifiedData,
            backgroundColor: [modifiedColor, CHART_PIE_GRAY],
            borderColor: "transparent",
          },
        ],
      },
      options: {
        cutout: "85%",
        aspectRatio: 1.0,
        animation: {
          animateRotate: false,
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
            callbacks: {
              label: function (context) {
                const label = context.label || "";
                const value = context.raw || "";
                if (label !== "") {
                  return `${label}: ${value}`;
                }
                return ``;
              },
            },
          },
        },
      },
      plugins: [plugin],
    });
  }

  //   return () => {
  //     if (doughnutChartInstance) {
  //       doughnutChartInstance.destroy();
  //     }
  //   };
  // }, [data, labels, widthVal, heightVal, id, percentage]);

  return (
    <div style={{ width: 150, height: 150 }}>
      <canvas
        id={`doughnutChart-${id}`}
        width={widthVal}
        height={heightVal}
      ></canvas>
    </div>
  );
};

export default Donut;
