'use client';

import Donut from '@/app/[locale]/components/chart/donutChart/donut';

interface DataProps {
  data: any;
}

const DonutPage: React.FC<DataProps> = ({ data }) => {
  const FormatBytesToMb = (bytes: number, decimals = 4) => {
    const k = 1024;
    const parseData = parseFloat((bytes / Math.pow(k, 2)).toFixed(2));
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
      {/* 첫 번째 행 */}
      <div className="sol_card_container">
        {/* 도넛 차트 1 */}
        <div className="col-md-6 position-relative d-flex sol_sum_circhart_cont">
          <div
            className="row d-flex sol_sum_circhart"
            style={{ gap: 8, marginBottom: -50 }}>
            <div className="sol_sum_leftchart">
              <Donut
                data={[
                  parseFloat(
                    (
                      (FormatBytesToMb(data.msgSpoolUsage) * 100) /
                      data.maxMsgSpoolUsage
                    ).toFixed(0)
                  ) || 0,
                  100 -
                    parseFloat(
                      (
                        (FormatBytesToMb(data.msgSpoolUsage) * 100) /
                        data.maxMsgSpoolUsage
                      ).toFixed(0)
                    ) || 100
                ]}
                // data={[120, 0]}
                labels={['Queued', '']}
                widthVal={150}
                heightVal={150}
                id={1}
              />
            </div>
            <div className="sol_sum_rigchart">
              <dl className="list-unstyled dl_chart_list">
                <dt>Messages Queued</dt>
                <dd className="sol_mb_15">
                  <span className="sol_font_24">
                    {FormatBytesToMb(data.msgSpoolUsage) || 0}
                  </span>{' '}
                  MB
                </dd>
                <dt>Configured Quota</dt>
                <dd>
                  <span className="sol_font_24">
                    {setCommaNum(data.maxMsgSpoolUsage) || 0}
                  </span>{' '}
                  MB
                </dd>
              </dl>
            </div>
          </div>
        </div>
        {/* 도넛 차트 2 */}
        <div className="col-md-6 position-relative d-flex sol_sum_circhart_cont">
          <div
            className="row d-flex sol_sum_circhart"
            style={{ gap: 8, marginBottom: -50 }}>
            <div className="sol_sum_leftchart">
              <Donut
                data={[
                  (data.msgVpnConnections * 100) / data.maxConnectionCount || 0,
                  100 -
                    (data.msgVpnConnections * 100) / data.maxConnectionCount ||
                    100
                ]}
                labels={['Incoming', '']}
                widthVal={150}
                heightVal={150}
                id={2}
              />
            </div>
            <div className="sol_sum_rigchart">
              <dl className="list-unstyled dl_chart_list">
                <dt>Incoming Connections</dt>
                <dd className="sol_mb_15">
                  <span className="sol_font_24">
                    {setCommaNum(data.msgVpnConnections) || 0}
                  </span>
                </dd>
                <dt>Configured Limit</dt>
                <dd>
                  <span className="sol_font_24">
                    {setCommaNum(data.maxConnectionCount) || 0}
                  </span>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        {/* 도넛 차트 3 */}
        <div className="col-md-6 position-relative d-flex sol_sum_circhart_cont">
          <div
            className="row d-flex sol_sum_circhart"
            style={{ gap: 8, marginBottom: -50 }}>
            <div className="sol_sum_leftchart">
              <Donut
                data={[
                  (data.msgVpnConnectionsServiceRestOutgoing * 100) /
                    data.serviceRestOutgoingMaxConnectionCount || 0,
                  100 -
                    (data.msgVpnConnectionsServiceRestOutgoing * 100) /
                      data.serviceRestOutgoingMaxConnectionCount || 100
                ]}
                labels={['Outgoing', '']}
                widthVal={150}
                heightVal={150}
                id={3}
              />
            </div>
            <div className="sol_sum_rigchart">
              <dl className="list-unstyled dl_chart_list">
                <dt>Outgoing REST Connections</dt>
                <dd className="sol_mb_15">
                  <span className="sol_font_24">
                    {setCommaNum(data.msgVpnConnectionsServiceRestOutgoing) ||
                      0}
                  </span>
                </dd>
                <dt>Configured Limit</dt>
                <dd>
                  <span className="sol_font_24">
                    {setCommaNum(data.serviceRestOutgoingMaxConnectionCount) ||
                      0}
                  </span>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        {/* 도넛 차트 4 */}
        <div className="col-md-6 position-relative d-flex sol_sum_circhart_cont">
          <div
            className="row d-flex sol_sum_circhart"
            style={{ gap: 8, marginBottom: -50 }}>
            <div className="sol_sum_leftchart">
              <Donut
                data={[
                  (data.msgSpoolCurrentEgressFlows * 100) /
                    data.maxEgressFlowCount || 0,
                  100 -
                    (data.msgSpoolCurrentEgressFlows * 100) /
                      data.maxEgressFlowCount || 100
                ]}
                labels={['REST', '']}
                widthVal={150}
                heightVal={150}
                id={4}
              />
            </div>
            <div className="sol_sum_rigchart">
              <dl className="list-unstyled dl_chart_list">
                <dt>Current Consumers </dt>
                <dd className="sol_mb_15">
                  <span className="sol_font_24">
                    {setCommaNum(data.msgSpoolCurrentEgressFlows) || 0}
                  </span>
                </dd>
                <dt>Configured Limit</dt>
                <dd>
                  <span className="sol_font_24">
                    {setCommaNum(data.maxEgressFlowCount) || 0}
                  </span>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DonutPage;
