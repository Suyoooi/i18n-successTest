'use client';

import { useAppSelector } from '@/hook/hook';
import React, { useEffect, useState } from 'react';
import RefreshData from '@/app/[locale]/components/footer/refreshData';
import { selectQueueSummary } from '@/data/selectType';
import useRefreshData from '@/hook/useRefreshData';
import { formatDateTime } from '@/utils/dateTimeFormat';
import axios from 'axios';
import qs from 'qs';
import Donut from '@/app/[locale]/components/chart/donutChart/donut';
import LineEChart from '@/app/[locale]/components/chart/eChart/lineMultiChart';
import {
  QUEUE_IN_BYTE_RATE,
  QUEUE_IN_MSG_RATE,
  QUEUE_OUT_BYTE_RATE,
  QUEUE_OUT_MSG_RATE,
  QUEUE_PEND_MSG_CNT,
  QUEUE_PEND_MSG_SIZE
} from '@/data/color/chartColor';

axios.defaults.paramsSerializer = params => {
  return qs.stringify(params, { arrayFormat: 'repeat' });
};

export const dynamic = 'force-dynamic';

export default function QueueSummaryPage() {
  const selectedVpn = useAppSelector(state => state.isVpn.selectedRow);
  const selectedId = useAppSelector(state => state.isVpn.selectedId);
  const selectedQueue = useAppSelector(state => state.queue.selectedQueue);
  const vpnNm = selectedVpn?.msgVpnName;
  const vpnId = selectedId?.mlsnSn;

  const { refreshTime, refreshData } = useRefreshData(
    formatDateTime(new Date())
  );

  const headerInfo = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  };

  const [dataInfo, setDataInfo] = useState<any>([]);
  const [percentVal, setPercentVal] = useState(Number);
  const [msgSpoolUsabeVal, setMsgSpoolUsabeVal] = useState(String);

  const [chartLabel, setChartLabel] = useState([]);
  const [pendMsgCntData, setPendingCntData] = useState([]);
  const [pendMsgSizeData, setPendMsgSizeData] = useState([]);
  const [inMsgRateData, setInMsgRateData] = useState([]);
  const [inByteRateData, setInByteRateData] = useState([]);
  const [outMsgRateData, setOutMsgRateData] = useState([]);
  const [outByteRateData, setOutByteRateData] = useState([]);

  const queueNm = selectedQueue?.queueName;

  const fetchTableData = async () => {
    try {
      if (vpnNm && vpnNm != '') {
        if (queueNm && queueNm != '') {
          const base64QueueNm = Buffer.from(queueNm).toString('base64');
          const getSummaryUrl = `/api/v2/msgVpns/${vpnId}/queues/${base64QueueNm}/summary`;
          const getSummaryParams = {
            select: selectQueueSummary
          };

          const getChartUrl = `/api/v2/msgVpns/${vpnId}/queues/${base64QueueNm}/chart/summary`;

          await axios
            .all([
              axios.get(getSummaryUrl, {
                params: getSummaryParams,
                headers: headerInfo,
                paramsSerializer: params => {
                  return qs.stringify(params, { arrayFormat: 'repeat' });
                }
              }),
              axios.get(getChartUrl)
            ])
            .then(
              axios.spread((res1, res2) => {
                const summaryRes = res1.data;
                const chartRes = res2.data;
                const resData = [summaryRes, chartRes];
                console.log(resData);

                const summaryResCode = resData[0].meta.responseCode;

                if (resData[0] && summaryResCode === 200) {
                  const dataVal = resData[0].data;
                  console.log(dataVal);
                  setDataInfo(dataVal);

                  const msgSpoolUsage = FormatBytesToMb(dataVal.msgSpoolUsage);
                  const maxMsgSpoolUsage = dataVal.maxMsgSpoolUsage;
                  const progressVal = (msgSpoolUsage / maxMsgSpoolUsage) * 100;
                  const prog = parseInt(progressVal.toFixed(0)) | 0;

                  setPercentVal(prog);
                  if (msgSpoolUsage) {
                    setMsgSpoolUsabeVal(msgSpoolUsage.toString());
                  } else {
                    setMsgSpoolUsabeVal('');
                  }
                }

                if (resData[1] && resData[1] != null) {
                  setChartLabel(resData[1].label);
                  setPendingCntData(resData[1].pendMsgCnt);
                  setPendMsgSizeData(resData[1].pendMsgSize);
                  setInMsgRateData(resData[1].inMsgRate);
                  setInByteRateData(resData[1].inByteRate);
                  setOutMsgRateData(resData[1].outMsgRate);
                  setOutByteRateData(resData[1].outByteRate);
                }
              })
            )
            .catch(function (error) {
              console.log(error);
            });
        } else {
          alert('No Selected Queue');
        }
      } else {
        alert('No Selected VPN');
      }
    } catch (err) {
      console.error('Error fetching table data:', err);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, [queueNm, refreshTime]);

  const FormatBytesToMb = (bytes: number, decimals = 4) => {
    const k = 1024;
    const parseData = parseFloat((bytes / Math.pow(k, 2)).toFixed(4));
    return parseData;
  };

  const setCommaNum = (num: any) => {
    if (num && num >= -1) {
      const numVal = num.toLocaleString('ko-KR');
      return numVal;
    } else {
      return 0;
    }
  };

  return (
    <>
      <div className="tab-content">
        <div className="col mt-2">
          <div className="col position-relative d-flex sol_qu_circhart_cont">
            <div className="row d-flex sol_qu_circhart">
              <div className="sol_qu_leftchart">
                <Donut
                  data={[percentVal || 0, 100 - percentVal || 0]}
                  labels={['Queue Summary', '']}
                  widthVal={100}
                  heightVal={100}
                  id={11}
                />
              </div>
              <div className="sol_qu_rigchart">
                <dl className="list-unstyled dl_chart_list mt-2">
                  <dd>
                    <span className="sol_tit">Access Type :</span>
                    <span className="sol_data"> {dataInfo.accessType}</span>
                  </dd>
                  <dd>
                    <span className="sol_tit">Messages Queued :</span>
                    <span className="sol_data"> {percentVal} %</span>
                  </dd>
                  <dd>
                    <span className="sol_tit">Messages Queued :</span>
                    <span className="sol_data">
                      {' '}
                      {setCommaNum(dataInfo.msgsCount)} msgs
                    </span>
                  </dd>
                  <dd>
                    <span className="sol_tit">Messages Queued :</span>
                    <span className="sol_data"> {msgSpoolUsabeVal} MB</span>
                  </dd>
                  <dd>
                    <span className="sol_tit">Messages Quota :</span>
                    <span className="sol_data">
                      {' '}
                      {setCommaNum(dataInfo.maxMsgSpoolUsage)} MB
                    </span>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="col row">
          <LineEChart
            configs={[
              {
                title: 'Pending Message Count',
                width: '100%',
                height: '205px',
                datasets: [
                  {
                    name: 'Pending Message Count',
                    data: pendMsgCntData,
                    color: QUEUE_PEND_MSG_CNT
                  }
                ],
                xLabels: chartLabel
              },
              {
                title: 'Pending Message size',
                width: '100%',
                height: '205px',
                datasets: [
                  {
                    name: 'Pending Message size',
                    data: pendMsgSizeData,
                    color: QUEUE_PEND_MSG_SIZE,
                    unit: 'MB'
                  }
                ],
                xLabels: chartLabel
              },
              {
                title: 'Message Inbound Rate',
                width: '100%',
                height: '205px',
                datasets: [
                  {
                    name: 'Inbound Message Rate',
                    data: inMsgRateData,
                    color: QUEUE_IN_MSG_RATE
                  },
                  {
                    name: 'Inbound Bytes Rate',
                    data: inByteRateData,
                    color: QUEUE_IN_BYTE_RATE
                  }
                ],
                xLabels: chartLabel
              },
              {
                title: 'Message Outbound Rate',
                width: '100%',
                height: '205px',
                datasets: [
                  {
                    name: 'Outbound Message Rate',
                    data: outMsgRateData,
                    color: QUEUE_OUT_MSG_RATE
                  },
                  {
                    name: 'Outbound Bytes Rate',
                    data: outByteRateData,
                    color: QUEUE_OUT_BYTE_RATE
                  }
                ],
                xLabels: chartLabel
              }
            ]}
            refreshTime={refreshTime}
          />
        </div>
      </div>

      <div className="sol_footer_pagenation fixed-bottom">
        <div className="col d-flex justify-content-end">
          <RefreshData onRefreshClick={refreshData} refreshTime={refreshTime} />
        </div>
      </div>
    </>
  );
}
