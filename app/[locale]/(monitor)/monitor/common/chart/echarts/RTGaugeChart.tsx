import React, { useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/hook/hook";
import {getDataSourceSelector} from "../../data/DataSource";
import { GaugeSafetyColor, GaugeCautionColor, GaugeDangerColor, GaugePadColor, GaugeRemainColor } from "@/data/monitor/chartConstants";

// import the core library.
import ReactEChartsCore from 'echarts-for-react/lib/core';
// import echarts from "echarts/types/dist/echarts";
import * as echarts from 'echarts/core';
// Import charts, all with Chart suffix
import {
    PieChart,
} from 'echarts/charts';
import {
    CanvasRenderer,
} from 'echarts/renderers';

// Register the required components
echarts.use(
    [ PieChart, CanvasRenderer]
);

interface ChartProps {
  widthVal?: string;
  heightVal?: string;
  dataSourceType: string,
}

const RTGaugeChart = (chartProps: ChartProps) => {
  const [option, setOption] = useState({})
  const monitoringData : any = useAppSelector(getDataSourceSelector(chartProps.dataSourceType));

  const defaultOption = {
    series: [
      {
        name: 'Outer',
        type: 'pie',
        left: 'center',
        width: '75%',
        radius: ['95%', '100%'],
        center: ['50%', '70%'],
        startAngle: 190,
        data: [
          { value: 70, name: 'low', itemStyle: { color: GaugeSafetyColor } },
          { value: 20, name: 'medium', itemStyle: {color: GaugeCautionColor } },
          { value: 10, name: 'high', itemStyle: { color: GaugeDangerColor } },
          {
            value: 80,
            itemStyle: {
              color: 'none',
              decal: {
                symbol: 'none'
              }
            },
            label : {
              color: 'none'
            }
          }
        ],
        label: {
          show: false
        },
      },
      {
        name: 'pad',
        type: 'pie',
        left: 'center',
        width: '75%',
        radius: ['93%', '95%'],
        center: ['50%', '70%'],
        startAngle: 190,
        data: [
          { value: 100, itemStyle: { color: GaugePadColor } },
          {
            value: 80,
            itemStyle: {
              color: 'none',
              decal: {
                symbol: 'none'
              }
            },
            label : {
              color: 'none'
            }
          }
        ],
        label: {
          show: false
        },
      },
      {
        name: 'inner',
        type: 'pie',
        left: 'center',
        width: '75%',
        radius: ['65%', '93%'],
        center: ['50%', '70%'],
        startAngle: 190,
        data: [
          { 
            value: 0, name: 'gauge',
            itemStyle: { color: GaugeSafetyColor },
            label: { 
              show: true,
              color: GaugeSafetyColor,
              fontSize: '15',
              formatter: '{c}%',
              position: 'center'
            } 
          },
          { value: 100, name: 'remain', itemStyle: { color: GaugeRemainColor }, label: { show: false } },
          {
            value: 80,
            itemStyle: {
              color: 'none',
              decal: {
                symbol: 'none'
              }
            },
            label: {
              show: false
            }
          }
        ],
      },


    ]
  };

  const updateChart = async (monitoringData: any) => {
    if(!monitoringData || !monitoringData.datas)
      return;
    let gaugeValue = monitoringData.datas[0] ?? 0;
    gaugeValue = Math.round(gaugeValue);
    let colorValue = GaugeSafetyColor;
    if (gaugeValue) {
      if (gaugeValue <= 70) {
        colorValue = GaugeSafetyColor;
      } else if (gaugeValue > 70 && gaugeValue <= 90) {
        colorValue = GaugeCautionColor;
      } else if (gaugeValue > 90 && gaugeValue <= 100) {
        colorValue = GaugeDangerColor;
      } else {
        // handle other cases if needed
      }
    }

    const newOption = {...defaultOption};
    newOption.series[2].data[0].value = gaugeValue;
    newOption.series[2].data[0].itemStyle!.color = colorValue;
    newOption.series[2].data[0].label!.color = colorValue;
    newOption.series[2].data[1].value = (100-gaugeValue);

    setOption(newOption);
  };

  useEffect(()=>{
    updateChart(monitoringData);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monitoringData.datas]);

  return (
    <React.Fragment>
      <div className="block" style={{paddingBottom: `${(chartProps.heightVal)? chartProps.heightVal: "70%"}`, width:`${(chartProps.widthVal)? chartProps.widthVal: "100%"}`, position: 'relative'}}>
        <div className="position-absolute w-100 h-100">
          <ReactEChartsCore echarts={echarts} style={{width: '100%', height: '100%'}} option ={option} lazyUpdate={true} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default RTGaugeChart;
