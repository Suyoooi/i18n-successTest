"use client";

import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";

Chart.register(...registerables, zoomPlugin);

interface StatusLineProps {
  widthVal: number;
  heightVal: number;
  statusData: any;
}

const StatusLineChart: React.FC<StatusLineProps> = ({
  widthVal,
  heightVal,
  statusData,
}) => {
  const lineChartCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const dateLabel: any[] = [];
    let formattedLabels: any[] = [];

    const data1: any[] = [];
    const data2: any[] = [];
    const data3: any[] = [];

    if (statusData && statusData != null) {
      statusData.map((datas: any) => {
        console.log(datas.haType);
        const dataVal = datas.haType;
        dateLabel.push(datas.clctDt);

        if (dataVal === 1) {
          data1.push(10);
          data2.push(null);
          data3.push(null);
        } else if (dataVal === 2) {
          data1.push(null);
          data2.push(10);
          data3.push(null);
        } else {
          data1.push(null);
          data2.push(null);
          data3.push(null);
        }
      });

      formattedLabels = dateLabel?.map((label) => formatToTime(label));
    }
    console.log(data1);
    console.log(data2);
    console.log(data3);

    function formatToTime(timestamp: any) {
      const date = new Date(timestamp);
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    }

    const lineChartCanvas = lineChartCanvasRef.current;
    let lineChartInstance: Chart | null = null;

    if (lineChartCanvas) {
      if (Chart.getChart(lineChartCanvas)) {
        Chart.getChart(lineChartCanvas)?.destroy();
      }

      lineChartInstance = new Chart(lineChartCanvas, {
        type: "line",
        data: {
          labels: formattedLabels,
          datasets: [
            {
              label: "Primary",
              borderColor: "rgba(242, 73, 92)",
              borderWidth: 2,
              backgroundColor: "rgba(242, 73, 92, 0.1)",
              data: data1,
              fill: true,
              pointRadius: 0,
              pointHoverRadius: 0,
            },
            {
              label: "Secondary",
              borderColor: "rgba(87, 148, 242)",
              borderWidth: 2,
              backgroundColor: "rgba(87, 148, 242, 0.1)",
              fill: true,
              data: data2,
              pointRadius: 0,
              pointHoverRadius: 0,
            },
          ],
        },
        options: {
          interaction: {
            mode: "nearest",
            intersect: false,
            axis: "x",
          },
          plugins: {
            legend: {
              display: true,
              position: "bottom",
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return context.dataset.label;
                },
              },
              displayColors: true,
            },
            zoom: {
              zoom: {
                drag: {
                  enabled: true,
                },
                mode: "x",
              },
            },
          },
          scales: {
            x: {
              ticks: {
                callback: function (val: any, index) {
                  return index % 3 === 0 ? this.getLabelForValue(val) : '';
                },
                maxRotation: 0,
                minRotation: 0,
              }
            },
            y: {
              display: false,
            },
          },
        },
      });
    }

    return () => {
      if (lineChartInstance) {
        lineChartInstance.destroy();
      }
    };
  }, [statusData]);

  return (
    <div style={{ backgroundColor: "#2f3032" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          gap: 20,
          marginBottom: 20,
          alignItems: "center",
        }}
      />
      <canvas
        id="lineChart"
        ref={lineChartCanvasRef}
        width={widthVal}
        height={heightVal}
      />
    </div>
  );
};

export default StatusLineChart;
