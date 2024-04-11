import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { CHART_COLOR } from "@/data/color/chartColor";

Chart.register(...registerables, zoomPlugin);

interface DataPoint {
  time: string;
  value: number;
}

interface DataSet {
  label: string;
  data: DataPoint[];
  borderColor?: string;
}

interface StatusLineProps {
  widthVal: number;
  heightVal: number;
  dataSets: DataSet[];
}

const LineTimeChart: React.FC<StatusLineProps> = ({
  widthVal,
  heightVal,
  dataSets,
}) => {
  const lineChartCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const allTimes = new Set(
      dataSets.flatMap((dataset) => dataset.data.map((point) => point.time))
    );
    const sortedTimes = Array.from(allTimes).sort();

    const lineChartCanvas = lineChartCanvasRef.current;
    let lineChartInstance: Chart | null = null;

    if (lineChartCanvas) {
      if (Chart.getChart(lineChartCanvas)) {
        Chart.getChart(lineChartCanvas)?.destroy();
      }

      lineChartInstance = new Chart(lineChartCanvas, {
        type: "line",
        data: {
          labels: sortedTimes,
          datasets: dataSets.map((dataset, index) => ({
            label: dataset.label,
            data: dataset.data.map((point) => point.value),
            borderColor: CHART_COLOR[index % CHART_COLOR.length],
            // borderColor:
            //   dataset.borderColor ||
            //   `rgb(${Math.random() * 255},${Math.random() * 255},${
            //     Math.random() * 255
            //   })`,
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
    <div className={"sol_chart_background"}>
      <canvas
        id="lineChart"
        ref={lineChartCanvasRef}
        width={widthVal}
        height={heightVal}
      ></canvas>
    </div>
  );
};

export default LineTimeChart;

// **이렇게 사용하면 됩니다**
// <LineTimeChart
// widthVal={600}
// heightVal={400}
// dataSets={[
//   {
//     label: "Dataset 1",
//     data: [
//       { time: "2022-01-01T00:00:00Z", value: 10 },
//       { time: "2022-01-01T01:00:00Z", value: 20 },
//       // 추가 데이터 포인트...
//     ],
//     borderColor: "rgb(255, 99, 132)",
//   },
//   // 다른 데이터 세트...
// ]}
// />
