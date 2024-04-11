import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hook/hook";
import ChartHeader from "./ChartHeader";
import { getDataSourceSelector } from "../../data/DataSource";
import { GetChartLabelString, GetFillMode, GetPreProcessedChartData, makeChartTitle } from "@/data/monitor/chartUtils";
import { RES_CHART_MENU_RESET, RES_CHART_MENU_ZOOMIN, RES_CHART_MENU_ZOOMOUT } from "@/data/monitor/resources";
import { createSelector } from "@reduxjs/toolkit";
import { MonitorState, addMarkLine, deleteMarkLine } from "@/redux/slices/monitoring/reducer";
import { FEATURE_CHART_CHECKRANGE, defaultMarkArea } from "@/data/monitor/chartConstants";

// import the core library.
import ReactEChartsCore from 'echarts-for-react/lib/core';
// import echarts from "echarts/types/dist/echarts";
import * as echarts from 'echarts/core';
// Import charts, all with Chart suffix
import {
    LineChart,
    BarChart,
} from 'echarts/charts';
// import components, all suffixed with Component
import {
    GridComponent,
    ToolboxComponent,
    TooltipComponent,
    TitleComponent,
    TimelineComponent,
    LegendComponent,
    DataZoomComponent,
    DataZoomInsideComponent,
    MarkAreaComponent,
    MarkLineComponent,
} from 'echarts/components';
// Import renderer, note that introducing the CanvasRenderer or SVGRenderer is a required step
import {
    CanvasRenderer,
} from 'echarts/renderers';

// Register the required components
echarts.use(
    [LineChart, BarChart, GridComponent, ToolboxComponent, TitleComponent, TimelineComponent, LegendComponent, TooltipComponent, DataZoomComponent, DataZoomInsideComponent, CanvasRenderer, MarkAreaComponent, MarkLineComponent ]
);

interface ChartProps {
  dataSourceType: string;
  chartOptions: any;
  widthVal?: string;
  heightVal?: string;
  chartHeader?: any;
  minHeightVal?: string;  // format: a_b_c_600 
}

const ReactEChart = (chartProps: ChartProps) => {
  const dispatch: any = useAppDispatch();
  const [option, setOption] = useState({})
  const monitoringData : any = useAppSelector(getDataSourceSelector(chartProps.dataSourceType));

  const selectMarkArea= createSelector(
    (state: any) => state.monitorHeader,
    (monitorData: MonitorState) => monitorData.markArea 
  )
  const monitorMarkArea = useAppSelector(selectMarkArea);


  const getMarkLines = (mark1: number|null, mark2: number|null) => {
    let resList = [];
    if(mark1) resList.push(mark1);
    if(mark2) resList.push(mark2);
    return resList.sort((a:number, b:number)=> (a-b));
  };

  const chartRef = useRef<any | null>(null);
  const pointInXLabelsRef = useRef<boolean>(false);

  const updateChart = async (monitoringData: any, markArea: any, sourceType: string, chartOptions: any) => {
    if (monitoringData.datas && monitoringData.datas.length > 0) {
      let previousDataCount = 0;
      if (chartRef) {
        let echartInstance = chartRef.current.getEchartsInstance();
        previousDataCount = echartInstance?.getOption()?.series?.length ?? 0;
      }
      const dataLength = (monitoringData.datas.length > previousDataCount)? monitoringData.datas.length : previousDataCount;
      const series = Array.from({length: dataLength}, (_,index) => {
        if(index < monitoringData.datas.length) {
          return ({
            // data: GetPreProcessedChartData(monitoringData.minLabel, monitoringData.lastLabel, monitoringData.datas[index], 'minmax'),
            data: monitoringData.datas[index],
            name: monitoringData.names[index],
            type: chartOptions.chartType,
            stack: (chartOptions.stackMode)? 'x' : undefined,
            sampling: 'lttb',
            showSymbol: false,
            areaStyle: (GetFillMode(chartProps.dataSourceType))?  { opacity: 0.3 } : undefined,
            // markArea: (index === 0 && markArea) ? markArea : undefined,
            markLine: (index === 0 && markArea && (markArea.startMarkLine || markArea.endMarkLine))? 
              { data: getMarkLines(markArea.startMarkLine, markArea.endMarkLine).map((item: any) => { return { xAxis: item}}), 
                label: {
                  formatter: (params: any) => { return `${GetChartLabelString(params.value)}`},
                  fontSize: 10,
                },
                triggerEvent: true,
              } : undefined,
            markArea: (index === 0 && markArea && (markArea.startMarkLine && markArea.endMarkLine))? 
              {...defaultMarkArea, data: [ getMarkLines(markArea.startMarkLine, markArea.endMarkLine).map((item:any) => { return { xAxis: item } }) ]
              } : undefined,
          })
        }else{
          /* 기존 차트 데이터를 clear 해야 한다. */
          return {
            data: undefined,
          };
        }
      });

      const newOption: any = (!FEATURE_CHART_CHECKRANGE)? {...chartOptions.option, series: series} 
        : {
          ...chartOptions.option,
          series: series,
          tooltip: {
            trigger: 'axis',
            formatter: function (params: any[]) {
              if (!pointInXLabelsRef.current) return '';

              // 툴팁에 표시될 내용을 정의합니다.
              var tooltipContent: string | null = null; // 툴팁 내용을 저장할 변수를 선언합니다.
              params.forEach(function (item) {
                // 필요한 경우 각 데이터 항목을 반복하여 내용을 포맷합니다.
                if (!tooltipContent) {
                  tooltipContent = item.axisValueLabel + '<br>';
                }
                tooltipContent += item.marker + item.seriesName + ' ' + item.value[1] + '<br>';
              });
              return tooltipContent; // 포맷된 툴팁 내용을 반환합니다.
            },
            axisPointer: {
              snap: false,
              // type: 'line' // 'shadow' as default; can also be 'line' or 'shadow'
            }
          }
        };
      const lastValues = [];
      for (let step = 0; step < monitoringData.datas.length; step++) {
        if(monitoringData.datas[step] && monitoringData.datas[step].length > 0) {
          const lastData = monitoringData.datas[step].at(-1);
          if(lastData.length > 0) lastValues.push(lastData[1]);
          else lastValues.push(0);
        }else{
          lastValues.push(0);
        }
        newOption.legend.data[step] = { 
          name: monitoringData.names[step], 
        }
      }

      newOption.legend.show = true;
      if(newOption.title.show) {
        newOption.title.text = makeChartTitle(sourceType, chartOptions.chartTitle, monitoringData.titlePostfix, lastValues);
      }
      newOption.xAxis.min = monitoringData.minLabel;
      setOption(newOption);

    }else{
      // empty array 도 유효하다.
      let previousDataCount = 0;
      if (chartRef) {
        let echartInstance = chartRef.current.getEchartsInstance();
        previousDataCount = echartInstance?.getOption()?.series?.length ?? 0;
      }
      if(previousDataCount > 0) {
        const series = Array.from({length: previousDataCount}, (_,index) => {
          return {
            data: undefined,
          };
        });
        const newOption: any = {...chartOptions.option, series: series}
        setOption(newOption);
      }
    }
  };

  useEffect(() => {
    updateChart(monitoringData, monitorMarkArea, chartProps.dataSourceType, chartProps.chartOptions);
    if(monitorMarkArea) {
      if(monitorMarkArea.startMarkLine && monitorMarkArea.startMarkLine < monitoringData.minLabel) dispatch(deleteMarkLine(monitorMarkArea.startMarkLine));
      if(monitorMarkArea.endMarkLine && monitorMarkArea.endMarkLine < monitoringData.minLabel) dispatch(deleteMarkLine(monitorMarkArea.endMarkLine));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monitoringData.datas, monitorMarkArea]);


  /* delete markline */
  const onChartClick = (params: any) => {
    let echartInstance: any | null = null;
    echartInstance = chartRef.current.getEchartsInstance();
    
    if(params.componentType === 'markLine') {
      echartInstance.off('click');
      const value = params.value;
      if (value) {
        dispatch(deleteMarkLine(value));
      }
      echartInstance.on('click', onChartClick);
    }
  }


  const dataFirstLabelRef = useRef<number>(Number.MAX_VALUE);
  useEffect(() => {
    dataFirstLabelRef.current = monitoringData.dataFirstLabel;
  },[monitoringData.dataFirstLabel]);

  useEffect(() => {
    let echartInstance: any | null = null;
    if (chartRef) {
      echartInstance = chartRef.current.getEchartsInstance();
      if (chartProps.chartOptions.zoomDrag) {
        echartInstance.dispatchAction({
          type: 'takeGlobalCursor',
          key: 'dataZoomSelect',
          dataZoomSelectActive: true,
        });
      }

      echartInstance.on('click', onChartClick)
      echartInstance.getZr().on('click', function (params: any) {
        const pointInPixel = [params.offsetX, params.offsetY];
        if (echartInstance.containPixel('grid', pointInPixel)) {
          const pointInGrid = echartInstance.convertFromPixel('grid', pointInPixel);
          const xaxisValue = Math.round(pointInGrid[0]);
          if(FEATURE_CHART_CHECKRANGE) {
            if (xaxisValue > dataFirstLabelRef.current) {
              dispatch(addMarkLine(xaxisValue));
            }else{}
          }else{
              dispatch(addMarkLine(xaxisValue));
          }
        }
      })

      if(FEATURE_CHART_CHECKRANGE) {
        echartInstance.getZr().on('mousemove', function (params: any) {
          const pointInPixel = [params.offsetX, params.offsetY];
          if (echartInstance.containPixel('grid', pointInPixel)) {
            const pointInGrid = echartInstance.convertFromPixel('grid', pointInPixel);
            const xaxisValue = Math.round(pointInGrid[0]);
            if (xaxisValue > dataFirstLabelRef.current) {
              pointInXLabelsRef.current = true;
              return;
            }
          }
          pointInXLabelsRef.current = false;
        })
      }
    }

    return (() => {
      if (echartInstance && !echartInstance.isDisposed) {
        echartInstance.dispose();
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  /* 50% 기준으로 10%씩 zoom 을 동작시킨다. */
  const [zoom, setZoom] = useState(0);
  const handleZoom = (mode: string) => {
    let newZoom = (mode === RES_CHART_MENU_ZOOMIN) ? (zoom + 10) : (zoom - 10);
    if (newZoom >= 0 && newZoom <= 40) {
      if (chartRef) {
        let echartInstance: any | null = null;
        echartInstance = chartRef.current.getEchartsInstance();
        echartInstance.dispatchAction({
          type: 'dataZoom',
          xAxisIndex: [0],
          start: 0 + newZoom,
          end: 100 - newZoom,
        });
      }
      setZoom(newZoom)
    }
  }

  /* menu 를 통해서 사용할텐데, 다시 그려짐으로 인해 깜빡임이 발생하여서 zoom 동작만으로 처리할지 고민됨. */
  const handleRestore = () => {
    if(chartRef) {
      let echartInstance : any|null = null;
      echartInstance = chartRef.current.getEchartsInstance();
      echartInstance.dispatchAction({
        type: 'restore'
      });
    }
  }

  const handleChartMenu = (item: string)=> {
    switch(item) {
      case RES_CHART_MENU_ZOOMIN: 
      case RES_CHART_MENU_ZOOMOUT:
        handleZoom(item)
        break;
      case RES_CHART_MENU_RESET:
        handleRestore();
        break;
      default: break;
    }
  }

  return (
    <React.Fragment>
      <div className="mon-chart-container">
        <div className="mon-chart-title">
          {
            (chartProps.chartHeader &&
              <ChartHeader header={chartProps.chartHeader} dataSourceType={chartProps.dataSourceType} menuHandler={handleChartMenu} />
            )
          }
        </div>
        <div className="mon-chart-body">
          <div className="sol_box_p0 h-100">
            <div className={`mon-rel-area p-2 ${chartProps.minHeightVal ?? 'sol_sum_graph_200'}`}>
              <div className="mon-abs-area">
                <ReactEChartsCore echarts={echarts} style={{width: "100%", height: "100%" }} ref={chartRef} option={option} lazyUpdate={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ReactEChart;
