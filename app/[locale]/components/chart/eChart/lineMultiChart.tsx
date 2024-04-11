import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { FONT_DEFAULT_COLOR } from "@/data/color/chartColor";

interface ChartData {
  name: string;
  data: any[];
  color: string;
  unit?: string;
}

interface ChartConfig {
  title?: any;
  width: string;
  height: string;
  datasets: ChartData[];
  xLabels: number[];
}

interface ChartProps {
  configs: ChartConfig[];
  refreshTime: any;
}

function formatToTime(timestamp: any) {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

const LineMultiChart: React.FC<ChartProps> = ({ configs, refreshTime }) => {
  const chartRefs = useRef<(HTMLDivElement | null)[]>([]);
  // useEffect(() => {
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

  const updateChart = (
    chartInstance: echarts.ECharts | null,
    config: ChartConfig
  ) => {
    if (!chartInstance) return;

    const formattedXLabels =
      config.xLabels?.map((label) => formatToTime(label)) ?? [];
    const series = config.datasets.map((dataset) => ({
      name: dataset.name,
      type: "line",
      data: dataset.data,
      smooth: true,
      symbol: "none",
      itemStyle: {
        color: dataset.color,
      },
    }));

    const formattedUnit = config.datasets.map((datas) => {
      let unitVal = "";
      if (datas.unit && datas.unit != "") {
        unitVal = datas.unit;
      }

      return unitVal;
    });

    const option = {
      tooltip: {
        trigger: "axis",
        textStyle: {
          fontSize: 13,
        },
      },
      xAxis: {
        type: "category",
        data: formattedXLabels,
        axisLabel: {
          textStyle: {
            color: FONT_DEFAULT_COLOR,
          },
        },
      },
      yAxis: {
        type: "value",
        // Y축 선
        axisLine: {
          show: true,
        },
        // Y축 눈금
        axisTick: {
          show: true,
        },
        // Y축의 분할선
        splitLine: {
          show: false,
        },
        axisLabel: {
          formatter: "{value} ".concat(formattedUnit[0]),
          textStyle: {
            color: FONT_DEFAULT_COLOR,
          },
        },
      },
      series,
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: "none",
            title: {
              zoom: "zoom in",
              back: "zoom out",
            },
          },
          restore: { title: "reset" },
          // saveAsImage: { title: "이미지로 저장" },
        },
        itemSize: 13,
        right: -5,
        top: -7,
        show: true,
      },
      dataZoom: {
        type: "inside",
        start: 0,
        end: 100,
      },
      grid: {
        left: "3%",
        right: "3%",
        bottom: "3%",
        top: "20%",
        containLabel: true,
      },
    };

    chartInstance.setOption(option);
  };

  chartInstances.forEach((instance, index) =>
    updateChart(instance, configs[index])
  );

  if (chartInstances.filter(Boolean).length > 1) {
    echarts.connect(chartInstances.filter(Boolean) as echarts.ECharts[]);
  }
  window.addEventListener("resize", resizeCharts);

  // return () => {
  //   window.removeEventListener("resize", resizeCharts);
  //   chartInstances.forEach((instance) => {
  //     if (instance) {
  //       instance.off("restore");
  //       instance.dispose();
  //     }
  //   });
  // };
  // }, [configs, refreshTime]);

  return (
    <>
      <div className="col-md-6 mt-3">
        {/* <h5 className="sol_color_skyblue">{configs[0].title}</h5> */}
        <h5>{configs[0].title}</h5>
        <div className="graph_area">
          <div className="sol_box_p0">
            <div className="p-2 sol_sum_graph_200">
              <div
                ref={(el) => (chartRefs.current[0] = el)}
                style={{ width: configs[0].width, height: configs[0].height }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-6 mt-3">
        <h5>{configs[1].title}</h5>
        <div className="graph_area">
          <div className="sol_box_p0">
            <div className="p-2 sol_sum_graph_200">
              <div
                ref={(el) => (chartRefs.current[1] = el)}
                style={{ width: configs[1].width, height: configs[1].height }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-6 mt-3">
        <h5>{configs[2].title}</h5>
        <div className="graph_area">
          <div className="sol_box_p0">
            <div className="p-2 sol_sum_graph_200">
              <div
                ref={(el) => (chartRefs.current[2] = el)}
                style={{ width: configs[2].width, height: configs[2].height }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-6 mt-3">
        <h5>{configs[3].title}</h5>
        <div className="graph_area">
          <div className="sol_box_p0">
            <div className="p-2 sol_sum_graph_200">
              <div
                ref={(el) => (chartRefs.current[3] = el)}
                style={{ width: configs[3].width, height: configs[3].height }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LineMultiChart;
