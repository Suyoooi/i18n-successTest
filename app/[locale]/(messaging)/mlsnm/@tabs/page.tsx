'use client';

import { useEffect, useState } from 'react';
import ConfigBox from './common/summary/configBox';
import { useAppSelector } from '@/hook/hook';
import axios from 'axios';
import RefreshData from '@/app/[locale]/components/footer/refreshData';
import { formatDateTime } from '@/utils/dateTimeFormat';
import useRefreshData from '@/hook/useRefreshData';
import Chart2 from './common/summary/chart2';
import DonutPage from './common/summary/dountPage';
import { useTranslation } from 'react-i18next';

export const dynamic = 'force-dynamic';

export default function Page() {
  const { t } = useTranslation();

  const selectedRow = useAppSelector(state => state.isVpn.selectedRow);
  const selectedId = useAppSelector(state => state.isVpn.selectedId);

  const msgVpns = selectedRow?.msgVpnName;
  const msgVpnId = selectedId?.mlsnSn;
  const [data, setData] = useState<any>({});
  const [chartData, setChartData] = useState<any>({});
  const { refreshTime, refreshData } = useRefreshData(
    formatDateTime(new Date())
  );

  const fetchData = async () => {
    const url = `/api/v2/msgVpns/${msgVpnId}/summary`;
    try {
      const params = {
        select:
          'msgVpnName,msgSpoolMsgCount,maxConnectionCount,eventConnectionCountThreshold,serviceRestOutgoingMaxConnectionCount,msgSpoolUsage,maxMsgSpoolUsage,eventMsgSpoolUsageThreshold,maxEndpointCount,eventEndpointCountThreshold,maxEgressFlowCount,state,replicationEnabled,replicationRole,rxMsgRate,rxByteRate,txMsgRate,txByteRate,msgReplayInitializingCount,msgReplayActiveCount,msgReplayPendingCompleteCount,msgReplayFailedCount,dmrEnabled'
      };

      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        },
        params
      });
      const DataVal = response.data.data;
      setData(DataVal);
      console.log('summary data:::', DataVal);
    } catch (error) {
      console.error('에러:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedId, refreshTime]);

  return (
    <div className="tab-content">
      <div className="col row">
        <div className="col-md-5">
          {/* <h4>HA Configuration Status</h4> */}
          <h4>{t('02')}</h4>
          <ConfigBox refreshTime={refreshTime} />
          {/* <h4 className="mt-2">Basic Information</h4> */}
          <h4 className="mt-2">{t('03')}</h4>
          {/* <CylinderPage data={data} /> */}
          <DonutPage data={data} />
        </div>
        {/* <Chart /> */}
        <Chart2 refreshTime={refreshTime} />
      </div>
      {/* footer */}
      <div className="sol_footer_pagenation fixed-bottom">
        <div className="col d-flex justify-content-end">
          <RefreshData onRefreshClick={refreshData} refreshTime={refreshTime} />
        </div>
      </div>
    </div>
  );
}
