'use client';

import LineEChart from '@/app/[locale]/components/chart/eChart/lineChart';
import StatusLineEChart from '@/app/[locale]/components/chart/eChart/statusLineChart';
import {
  VPN_HA_PRIMARY,
  VPN_HA_PRIMARY_AREA,
  VPN_HA_SECONDARY,
  VPN_HA_SECONDARY_AREA,
  VPN_IN_BYTE_RATE,
  VPN_IN_MSG_RATE,
  VPN_OUT_BYTE_RATE,
  VPN_OUT_MSG_RATE,
  VPN_PEND_MSG_CNT,
  VPN_PEND_MSG_SIZE
} from '@/data/color/chartColor';
import { useAppSelector } from '@/hook/hook';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ChartProps {
  refreshTime: any;
}

const Chart2: React.FC<ChartProps> = ({ refreshTime }) => {
  const { t } = useTranslation();

  const selectedRow = useAppSelector(state => state.isVpn.selectedRow);
  const selectedId = useAppSelector(state => state.isVpn.selectedId);
  const selectedMsnId = useAppSelector(state => state.isVpn.selectedMsnId);

  const msgVpns = selectedRow?.msgVpnName;
  const msgVpnId = selectedId?.mlsnSn;
  const msn = selectedMsnId?.msnId;

  const [msgs, setMsgs] = useState<boolean>(true);
  const [size, setSize] = useState<boolean>(false);
  const [chartData, setChartData] = useState<any>({});
  const [HaChartData1, setHaChartData1] = useState<any>([]);
  const [HaChartData2, setHaChartData2] = useState<any>([]);
  const [datasets, setDatasets] = useState<any>([]);
  const [msgDatasets, setMsgDatasets] = useState<any>([]);
  const [haDatasets, setHaDatasets] = useState<any>([]);

  const onMsgsClick = () => {
    setMsgs(true);
    setSize(false);
  };

  const onSizeClick = () => {
    setMsgs(false);
    setSize(true);
  };

  useEffect(() => {
    if (msgs) {
      setDatasets([
        {
          name: 'Pending Message Count',
          data: chartData.pendMsgCnt?.map((rate: any, index: number) => [
            chartData.label[index],
            rate
          ]),
          color: VPN_PEND_MSG_CNT
        }
      ]);
      setMsgDatasets([
        {
          name: 'InBound Message Rate',
          data: chartData.inMsgRate?.map((rate: any, index: number) => [
            chartData.label[index],
            rate
          ]),
          color: VPN_IN_MSG_RATE
        },
        {
          name: 'OutBound Message Rate',
          data: chartData.outMsgRate?.map((rate: any, index: number) => [
            chartData.label[index],
            rate
          ]),
          color: VPN_OUT_MSG_RATE
        }
      ]);
    } else if (size) {
      setDatasets([
        {
          name: 'Pending Message Size',
          data: chartData.pendMsgSize?.map((rate: any, index: number) => [
            chartData.label[index],
            rate
          ]),
          color: VPN_PEND_MSG_SIZE,
          unit: 'MB'
        }
      ]);
      setMsgDatasets([
        {
          name: 'InBound Byte Rate',
          data: chartData.inByteRate?.map((rate: any, index: number) => [
            chartData.label[index],
            rate
          ]),
          color: VPN_IN_BYTE_RATE
        },
        {
          name: 'OutBound Byte Rate',
          data: chartData.outByteRate?.map((rate: any, index: number) => [
            chartData.label[index],
            rate
          ]),
          color: VPN_OUT_BYTE_RATE
        }
      ]);
    }
    setHaDatasets([
      {
        name: 'Primary',
        data: HaChartData1,
        color: VPN_HA_PRIMARY,
        areaColor: VPN_HA_PRIMARY_AREA
      },
      {
        name: 'Secondary',
        data: HaChartData2,
        color: VPN_HA_SECONDARY,
        areaColor: VPN_HA_SECONDARY_AREA
      }
    ]);
  }, [chartData, msgs, size]);

  const fetchCahrtData = async () => {
    const chartUrl = `/api/v2/msgVpns/${msgVpnId}/chart/summary`;
    try {
      const response = await axios.get(chartUrl, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        }
      });
      const ChartDataVal = response.data;
      setChartData(ChartDataVal);

      console.log(ChartDataVal);
    } catch (error) {
      console.error('에러:', error);
    }
  };

  const fetchHACahrtData = async () => {
    const url = `/api/v2/msgVpns/ha-status`;

    try {
      const params = {
        msn: msn
      };
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        },
        params
      });
      const HAChartDataVal = response.data;
      const data1 = HAChartDataVal.map((data: any) => [
        data.clctDt,
        data.haType === 1 ? 10 : null
      ]);
      const data2 = HAChartDataVal.map((data: any) => [
        data.clctDt,
        data.haType === 2 ? 10 : null
      ]);
      setHaChartData1(data1);
      setHaChartData2(data2);
    } catch (error) {
      console.error('에러:', error);
    }
  };

  useEffect(() => {
    fetchCahrtData();
    fetchHACahrtData();
  }, [selectedRow, selectedId, refreshTime]);

  return (
    <div className="col-md-7">
      <div className="row">
        <h4 style={{ display: 'flex' }}>
          {t('08')}
          <div className="sol_text_a">&nbsp;[</div>
          <span
            className={`sol_text_a ${msgs ? 'sol_text_hover' : ''}`}
            onClick={onMsgsClick}
            style={{ cursor: 'pointer', color: msgs ? '#f8f8f8' : '#838383' }}>
            <a
              style={{ textDecoration: 'none' }}
              className={msgs ? 'active' : ''}>
              {/* &nbsp;msgs&nbsp; */}
              &nbsp;{t('06')}&nbsp;
            </a>
          </span>
          |
          <span
            className={`sol_text_a ${size ? 'sol_text_hover' : ''}`}
            onClick={onSizeClick}
            style={{
              cursor: 'pointer',
              color: size ? '#f8f8f8' : '#838383'
            }}>
            <a
              style={{ textDecoration: 'none' }}
              className={size ? 'active' : ''}>
              {/* &nbsp;size&nbsp; */}
              &nbsp;{t('07')}&nbsp;
            </a>
          </span>
          <div className="sol_text_a">]</div>
        </h4>
      </div>
      <LineEChart
        configs={[
          {
            // title: "Pending Message [msgs | size]",
            width: '100%',
            height: '175px',
            datasets: datasets
            // xLabels: chartData.label,
          },
          {
            // title: 'Message In/Out Rate',
            title: t('04'),
            width: '100%',
            height: '175px',
            datasets: msgDatasets
            // xLabels: chartData.label,
          },
          {
            // title: 'HA Status Change Trend',
            title: t('05'),
            width: '100%',
            height: '175px',
            datasets: haDatasets,
            // xLabels: chartData.label,
            ha: true
          }
        ]}
        refreshTime={refreshTime}
      />
      {/* <StatusLineEChart
        widthVal={"100%"}
        heightVal={170}
        statusData={HaChartData}
      /> */}
    </div>
  );
};

export default Chart2;
