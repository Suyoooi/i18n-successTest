import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { FONT_DEFAULT_COLOR } from "@/data/color/chartColor";

interface ChartData {
  name: string;
  data: any[];
  color: string;
  areaColor?: string;
  unit?: string;
}

interface ChartConfig {
  title?: any;
  width: string;
  height: string;
  datasets: ChartData[];
  // xLabels: number[];
  ha?: boolean;
}

interface ChartProps {
  configs: ChartConfig[];
  refreshTime: any;
}

const LineEChart: React.FC<ChartProps> = ({ configs, refreshTime }) => {
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
    config: ChartConfig,
    index: number
  ) => {
    if (!chartInstance) return;

    const series = config.datasets.map((dataset) => ({
      name: dataset.name,
      type: "line",
      data: dataset.data,
      smooth: true,
      symbol: "none",
      itemStyle: {
        color: dataset.color,
      },
      areaStyle: {
        color: dataset.areaColor ? dataset.areaColor : "none",
      },
    }));

    const tooltipFormatter = config.ha
      ? function (params: any) {
          let result = `${params[0].axisValueLabel}<br/>`;
          params.forEach((param: any) => {
            if (param.data[1] !== null) {
              result += `<div style="font-size: 13px;">${param.marker}${param.seriesName}</div>`;
            }
          });
          return result;
        }
      : undefined;

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
        formatter: tooltipFormatter,
        // axisPointer: {
        //   type: "cross",
        // },
        textStyle: {
          fontSize: 13,
        },
        // backgroundColor: "#202124",
      },
      xAxis: {
        type: "time",
        axisLabel: {
          formatter: (value: number) => {
            return echarts.time.format(value, "{HH}:{mm}", false);
          },
          textStyle: {
            color: FONT_DEFAULT_COLOR,
          },
        },
      },
      // xAxis: {
      //   type: "category",
      //   data: formattedXLabels,
      //   axisLabel: {
      //     textStyle: {
      //       color: "#A2A4A9",
      //     },
      //   },
      // },
      yAxis: {
        type: "value",
        show: !config.ha,
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
        show: index === 0,
      },
      dataZoom: {
        type: "inside",
        start: 0,
        end: 100,
      },
      grid: {
        left: 3,
        right: "3%",
        bottom: index === 2 ? "16%" : "5%",
        top: "22%",
        containLabel: true,
      },
      legend: {
        // data: ["Primary", "Secondary"],
        show: index === 2 ? true : false,
        left: "center",
        top: "bottom",
        textStyle: {
          color: FONT_DEFAULT_COLOR,
        },
        icon: "rect",
      },
    };
    chartInstance.setOption(option);
  };

  chartInstances.forEach((instance, index) =>
    updateChart(instance, configs[index], index)
  );

  if (chartInstances.filter(Boolean).length > 1) {
    echarts.connect(chartInstances.filter(Boolean) as echarts.ECharts[]);
  }
  window.addEventListener("resize", resizeCharts);

  //   return () => {
  //     window.removeEventListener("resize", resizeCharts);
  //     chartInstances.forEach((instance) => {
  //       if (instance) {
  //         instance.off("restore");
  //         instance.dispose();
  //       }
  //     });
  //   };
  // }, [configs, refreshTime]);

  return (
    <div className="row" style={{ marginTop: -8 }}>
      {configs.map((config, index) => (
        <div key={index}>
          <h4>{config.title}</h4>
          <div className="graph_area" style={{ marginBottom: 10 }}>
            <div className="sol_box_p0">
              <div className="p-2 sol_sum_graph_180">
                <div
                  ref={(el) => (chartRefs.current[index] = el)}
                  style={{ width: config.width, height: config.height }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LineEChart;
