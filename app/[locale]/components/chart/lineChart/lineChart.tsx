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
  xLabels: number[];
}

function formatToTime(timestamp: any) {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

const LineChart: React.FC<StatusLineProps> = ({
  widthVal,
  heightVal,
  dataSets,
  xLabels,
}) => {
  const lineChartCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // console.log("data", dataSets);
  // console.log("label", xLabels);

  useEffect(() => {
    const formattedLabels = xLabels?.map((label) => formatToTime(label));
    const lineChartCanvas = lineChartCanvasRef.current;
    let lineChartInstance: Chart | null = null;

    if (lineChartCanvas) {
      if (Chart.getChart(lineChartCanvas)) {
        Chart.getChart(lineChartCanvas)?.destroy();
      }

      lineChartInstance = new Chart(lineChartCanvas, {
        type: "line",
        data: {
          // labels: xLabels,
          labels: formattedLabels,
          datasets: dataSets.map((dataset, index) => ({
            ...dataset,
            borderColor:
              dataset.borderColor || CHART_COLOR[index % CHART_COLOR.length],
            // borderColor:
            // CHART_COLOR[Math.floor(Math.random() * CHART_COLOR.length)],
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
          scales: {
            x: {
              ticks: {
                callback: function (val: any, index) {
                  return index % 2 === 0 ? this.getLabelForValue(val) : "";
                },
                maxRotation: 0,
                minRotation: 0,
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
  }, [dataSets, widthVal, heightVal, xLabels]);

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

export default LineChart;

// **이렇게 사용하면 됩니다**
{
  /* <LineChart
  widthVal={600}
  heightVal={400}
  xLabels={['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5']} // x축 라벨 추가
  dataSets={[
    {
      label: "Dataset 1",
      data: [10, 20, 30, 40, 50],
      borderColor: "rgb(255, 99, 132)",
    },
    // 다른 데이터 세트 추가 가능
  ]}
/> */
}
