import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { CHART_COLOR } from "@/data/color/chartColor";

Chart.register(...registerables, zoomPlugin);

interface StatusLineProps {
  widthVal: number;
  heightVal: number;
  dataSets: {
    label: string;
    data: number[];
    borderColor?: string;
  }[];
}

const CustomLineChart: React.FC<StatusLineProps> = ({
  widthVal,
  heightVal,
  dataSets,
}) => {
  const lineChartCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const lineChartCanvas = lineChartCanvasRef.current;
    let lineChartInstance: Chart | null = null;

    if (lineChartCanvas) {
      if (Chart.getChart(lineChartCanvas)) {
        Chart.getChart(lineChartCanvas)?.destroy();
      }

      lineChartInstance = new Chart(lineChartCanvas, {
        type: "line",
        data: {
          labels: dataSets[0]?.data.map((_, index) => `Label ${index + 1}`),
          datasets: dataSets.map((dataset, index) => ({
            ...dataset,
            borderColor: CHART_COLOR[index % CHART_COLOR.length],
            borderWidth: 2,
            fill: false,
            pointRadius: 0,
            pointHoverRadius: 0,
            tension: 0.5,
          })),
        },
        options: {
          interaction: {
            mode: "nearest",
            intersect: false,
            axis: "x",
          },
          plugins: {
            legend: {
              display: false,
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
        },
      });
    }

    return () => {
      if (lineChartInstance) {
        lineChartInstance.destroy();
      }
    };
  }, [dataSets, widthVal, heightVal]);

  return (
    <div style={{ backgroundColor: "#2f3032" }}>
      <canvas
        id="lineChart"
        ref={lineChartCanvasRef}
        width={widthVal}
        height={heightVal}
      ></canvas>
    </div>
  );
};

export default CustomLineChart;

// **이렇게 사용하면 됩니다**
// <LineChart
//   widthVal={600}
//   heightVal={400}
//   dataSets={[
//     {
//       label: "Dataset 1",
//       data: [10, 20, 30, 40, 50],
//       borderColor: "rgb(255, 99, 132)",
//     },
//     // 다른 데이터 세트 추가 가능
//   ]}
// />
