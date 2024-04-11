'use client';

import ClientList from '@/app/[locale]/components/commons/clientList';
import refreshData from '@/app/[locale]/components/footer/refreshData';
import RefreshData from '@/app/[locale]/components/footer/refreshData';
import ProgressBar from '@/app/[locale]/components/progress/progressBar';
import ProgressComponent from '@/app/[locale]/components/progress/progressComponent';
import TipsSideBar from '@/app/[locale]/components/sideBar/tipsSideBar';
import { TipsData } from '@/data/queue/tips';
import { selectQueueSetting } from '@/data/selectType';
import { useAppSelector } from '@/hook/hook';
import useRefreshData from '@/hook/useRefreshData';
import { formatDateTime } from '@/utils/dateTimeFormat';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import qs from 'qs';
import { useEffect, useState } from 'react';

axios.defaults.paramsSerializer = params => {
  return qs.stringify(params, { arrayFormat: 'repeat' });
};

export default function QueueSettingsPage() {
  const selectedVpn = useAppSelector(state => state.isVpn.selectedRow);
  const selectedId = useAppSelector(state => state.isVpn.selectedId);
  const selectedQueue = useAppSelector(state => state.queue.selectedQueue);
  console.log(selectedQueue);

  const vpnNm = selectedVpn?.msgVpnName;
  const vpnId = selectedId?.mlsnSn;
  console.log(vpnNm);

  const router = useRouter();

  const headerInfo = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  };

  const [tipsInfo, setTipsInfo] = useState('');
  const [dataInfo, setDataInfo] = useState<any>([]);
  const [isEnable, setIsEnable] = useState<boolean>(false);
  const [hiddenMenu, setHiddenMenu] = useState<boolean>(true);
  const [accType, setAccType] = useState<boolean>(false);
  const [selectedTipId, setSelectedTipId] = useState<number>(0);
  const { refreshTime, refreshData } = useRefreshData(
    formatDateTime(new Date())
  );

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsEnable(event.target.checked);
  };

  const fetchTableData = async () => {
    try {
      if (vpnNm && vpnNm != '') {
        const queueNm = selectedQueue?.queueName;

        if (queueNm && queueNm != '') {
          const base64QueueNm = Buffer.from(queueNm).toString('base64');
          const getSettingUrl = `/api/v2/msgVpns/${vpnId}/queues/${base64QueueNm}`;
          const getParamsVal = {
            select: selectQueueSetting
          };

          await axios
            .get(getSettingUrl, {
              params: getParamsVal,
              headers: headerInfo,
              paramsSerializer: params => {
                return qs.stringify(params, { arrayFormat: 'repeat' });
              }
            })
            .then(function (response) {
              const resCode = response.data.meta.responseCode;
              if (resCode === 200) {
                const dataVal = response.data.data;

                console.log(dataVal);

                setDataInfo(dataVal);
                dataSetInfo(dataVal);
              }
            })
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
    fnTipsChange(0);
    fetchTableData();
  }, [selectedVpn, selectedId, selectedQueue, refreshTime]);

  useEffect(() => {}, [dataInfo]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleHiddenMenu();
      clearInterval(intervalId);
    }, 500);
  }, []);

  const dataSetInfo = (data: any) => {
    const incomingVal = document.getElementById(
      'set_incoming'
    ) as HTMLInputElement;
    const outgoingVal = document.getElementById(
      'set_outgoing'
    ) as HTMLInputElement;
    const clientDeliveryVal = document.getElementById(
      'set_clientDeliCnt'
    ) as HTMLInputElement;
    const msgPriority = document.getElementById(
      'set_msgPriority'
    ) as HTMLInputElement;
    const respectTtl = document.getElementById(
      'set_respectTtl'
    ) as HTMLInputElement;
    const redelivery = document.getElementById(
      'set_redelivery'
    ) as HTMLInputElement;
    const tryForever = document.getElementById(
      'set_tryForever'
    ) as HTMLInputElement;
    const delayedRedelivery = document.getElementById(
      'set_delayedRedelivery'
    ) as HTMLInputElement;
    const lowPriorityMsg = document.getElementById(
      'set_lowPriorityMsg'
    ) as HTMLInputElement;
    const conAckProp = document.getElementById(
      'set_conAckProp'
    ) as HTMLInputElement;

    checkSetVal(data.ingressEnabled, incomingVal);
    checkSetVal(data.egressEnabled, outgoingVal);
    checkSetVal(data.deliveryCountEnabled, clientDeliveryVal);
    checkSetVal(data.respectMsgPriorityEnabled, msgPriority);
    checkSetVal(data.respectTtlEnabled, respectTtl);
    checkSetVal(data.redeliveryEnabled, redelivery);
    checkSetVal(data.redeliveryEnabled, tryForever);
    checkSetVal(data.redeliveryDelayEnabled, delayedRedelivery);
    checkSetVal(data.rejectLowPriorityMsgEnabled, lowPriorityMsg);
    checkSetVal(data.consumerAckPropagationEnabled, conAckProp);

    const exclusiveVal = document.getElementById('acc_exclusive_label');
    const nonExclusiveVal = document.getElementById('acc_nonExclusive_label');

    console.log(data.accessType);

    if (data.accessType && data.accessType === 'exclusive') {
      console.log('exclusive');
      exclusiveVal?.classList.add('active');
      nonExclusiveVal?.classList.remove('active');
      setAccType(false);
    } else {
      console.log('non-exclusive');
      exclusiveVal?.classList.remove('active');
      nonExclusiveVal?.classList.add('active');
      setAccType(true);
    }

    selectElement('set_ownerpermission', data.permission);
    selectElement(
      'set_rejectMsgSender',
      data.rejectMsgToSenderOnDiscardBehavior
    );
  };

  const checkSetVal = (datas: any, tagId: any) => {
    if (datas) {
      tagId.checked = true;
    } else {
      tagId.checked = false;
    }
  };

  function selectElement(id: any, valueToSelect: any) {
    let element = document.getElementById(id) as HTMLInputElement;
    console.log(element);
    element.value = valueToSelect;
  }

  const fnTipsChange = (idVal: any) => {
    const result = TipsData.find(({ id }) => id === idVal);
    const tipHeader = result?.tips_header;
    const tipBody = result?.tip_body;
    const tipSubInfo = result?.tip_sub;
    const moreYn = result?.moreYn;
    const moreLink = result?.moreLink;

    console.log(idVal);

    if (result && tipHeader != '') {
      setSelectedTipId(idVal);
    }

    // if (result && tipHeader != '') {
    //   const tipArea = document.getElementById("tipArea") as HTMLElement;
    //   tipArea.replaceChildren();

    //   const headerElement = document.createElement('div');
    //   headerElement.className = 'sol_tip_header';
    //   if (tipHeader && tipHeader != '') {
    //     headerElement.innerHTML = tipHeader;
    //   }

    //   const bodyElement = document.createElement('div');
    //   bodyElement.className = 'sol_tip_body';
    //   if (tipBody && tipBody != '') {
    //     bodyElement.innerHTML = tipBody;

    //     if (tipSubInfo && tipSubInfo?.length > 0) {
    //       const subElement = document.createElement('div');
    //       subElement.className = 'mt-3 sol_tip_body';

    //       tipSubInfo.map((item) => {
    //         const subHeader = document.createElement('p');
    //         const subBody = document.createElement('p');
    //         subHeader.className = 'sol_tip_subHeader';
    //         subHeader.innerHTML = item.header;
    //         subBody.className = 'sol_tip_body';
    //         subBody.innerHTML = item.body;

    //         subElement.appendChild(subHeader)
    //         subElement.appendChild(subBody)
    //       })
    //       bodyElement.appendChild(subElement)
    //     }
    //   }

    //   tipArea.appendChild(headerElement)
    //   tipArea.appendChild(bodyElement)

    //   if (moreYn && moreYn === 'Y') {
    //     const btnElement = document.createElement('button');
    //     btnElement.type = 'button';
    //     btnElement.className = 'btn btn-xs btn-outline-light';
    //     btnElement.onclick = function () {
    //       fnMoreLink(moreLink)
    //     };
    //     btnElement.innerHTML = 'more';
    //     tipArea.appendChild(btnElement)
    //   }
    // }
  };

  const fnMoreLink = (link: any) => {
    console.log(link);
    router.push(link);
  };

  const callbackTipVal = (num: number) => {
    console.log(num);
    fnTipsChange(num);
  };

  const accesTypeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {};

  const fnTipShowHide = () => {
    console.log('aaaa');
  };

  const handleHiddenMenu = () => {
    setHiddenMenu(!hiddenMenu);

    const hideDiv = document.querySelectorAll("[id='hideMenu']");
    const boldDiv = document.querySelectorAll("[id='boldTxt']");

    console.log(hideDiv);
    console.log(accType);

    if (hiddenMenu) {
      for (var i = 0; i < hideDiv.length; i++) {
        hideDiv[i].classList.add('sol_set_hide');
      }

      for (var j = 0; j < boldDiv.length; j++) {
        boldDiv[j].classList.remove('sol_highlightLabel');
      }
    } else {
      for (var i = 0; i < hideDiv.length; i++) {
        hideDiv[i].classList.remove('sol_set_hide');
      }

      for (var j = 0; j < boldDiv.length; j++) {
        boldDiv[j].classList.add('sol_highlightLabel');
      }
    }
  };

  const onUpdateData = (dataVal: any) => {
    console.log('dataVal >>>>> ', dataVal);
  };

  return (
    <>
      <div className="tab-content">
        <form className="row position-relative">
          <TipsSideBar
            data={TipsData}
            selectedTipId={selectedTipId}
            top={200}
            bottom={80}
          />
          <div className="col-md-12">
            <div className="row col-md-4">
              <h5
                onClick={handleHiddenMenu}
                style={{
                  cursor: 'pointer'
                }}>
                {hiddenMenu
                  ? 'Hide Advanced Settings'
                  : 'Show Advanced Settings'}
                <div
                  className="btn hstack btn-icon btn-outline-light sol_button_btn"
                  onClick={handleHiddenMenu}
                  style={{ marginLeft: 5 }}>
                  <i
                    className={`sol_i_down`}
                    style={{
                      transform: hiddenMenu ? 'none' : 'rotate(180deg)',
                      transition: 'transform 0.3s ease-in-out'
                    }}
                  />
                </div>
              </h5>
            </div>

            <div className="sol_box_p10">
              <div className="sol_ml_10">
                {/* Incoming */}
                <div className="row col-md-8">
                  <label
                    className="col-sm-5 col-form-label"
                    id="boldTxt"
                    onClick={() => fnTipsChange(1)}>
                    Incoming
                  </label>
                  <div className="col-sm-7 col-form-label">
                    <div className="form-check form-switch">
                      <input
                        id="set_incoming"
                        disabled
                        className="form-check-input"
                        type="checkbox"
                      />
                    </div>
                  </div>
                </div>
                {/* Outgoing */}
                <div className="row col-md-8">
                  <label
                    className="col-sm-5 col-form-label"
                    id="boldTxt"
                    onClick={() => fnTipsChange(2)}>
                    Outgoing
                  </label>
                  <div className="col-sm-7 col-form-label">
                    <div className="form-check form-switch">
                      <input
                        id="set_outgoing"
                        disabled
                        className="form-check-input"
                        type="checkbox"
                      />
                    </div>
                  </div>
                </div>
                {/* Access Type */}
                <div className="row col-md-8 align-items-center">
                  <label
                    className="col-sm-5 col-form-label"
                    id="boldTxt"
                    onClick={() => fnTipsChange(3)}>
                    Access Type
                  </label>
                  <div className="col-sm-7 col-form-label">
                    <div className="col-sm-7">
                      <div className="au-target md-radio-group disabled form-toggle-radio">
                        <div className="form-check">
                          <input
                            type="radio"
                            id="acc_exclusive"
                            name="accessTypeVal"
                            className="md-toggle-radio au-target"
                            disabled
                            onChange={accesTypeHandler}
                          />
                          <label
                            className="au-target disabled"
                            id="acc_exclusive_label"
                            htmlFor="acc_exclusive">
                            Exclusive
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            type="radio"
                            id="acc_nonExclusive"
                            name="accessTypeVal"
                            className="md-toggle-radio au-target"
                            disabled
                            onChange={accesTypeHandler}
                          />
                          <label
                            className="au-target disabled"
                            id="acc_nonExclusive_label"
                            htmlFor="acc_nonExclusive">
                            Non-Exclusive
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {accType && (
                  <>
                    <div className="row col-md-8 align-items-center">
                      <label
                        className="col-sm-5 col-form-label"
                        id="boldTxt"
                        onClick={() => fnTipsChange(34)}>
                        Partition
                      </label>
                    </div>

                    <div className="row col-md-8 align-items-center">
                      <label
                        className="col-sm-5 col-form-label"
                        id="boldTxt"
                        onClick={() => fnTipsChange(35)}>
                        <span className=" sol_ml_10">Count</span>
                      </label>
                      <div className="col-sm-7 col-form-label">
                        <input
                          id="set_partitionCount"
                          type="text"
                          className="form-control sol_w100"
                          disabled
                          value={dataInfo.partitionCount}
                        />
                      </div>
                    </div>

                    <div
                      className="row col-md-8 align-items-center"
                      id="hideMenu">
                      <label
                        className="col-sm-5 col-form-label"
                        onClick={() => fnTipsChange(36)}>
                        <span className=" sol_ml_10">Rebalance Delay</span>
                      </label>
                      <div className="col-sm-7 col-form-label">
                        <input
                          id="set_rebalanceDelay"
                          type="text"
                          className="form-control sol_w100"
                          disabled
                          value={dataInfo.partitionRebalanceDelay}
                        />
                      </div>
                    </div>

                    <div
                      className="row col-md-8 align-items-center"
                      id="hideMenu">
                      <label
                        className="col-sm-5 col-form-label"
                        onClick={() => fnTipsChange(37)}>
                        <span className=" sol_ml_10">
                          Rebalance Max Handoff Time
                        </span>
                      </label>
                      <div className="col-sm-7 col-form-label">
                        <input
                          id="set_maxHandoffTime"
                          type="text"
                          className="form-control sol_w100"
                          disabled
                          value={dataInfo.partitionRebalanceMaxHandoffTime}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Messages Queued Quota (MB) */}
                <div className="row col-md-8 align-items-center">
                  <label
                    className="col-sm-5 col-form-label"
                    id="boldTxt"
                    onClick={() => fnTipsChange(4)}>
                    Messages Queued Quota (MB)
                  </label>
                  <div className="col-sm-7 col-form-label">
                    <input
                      id="set_msgQueueQuota"
                      type="text"
                      className="form-control sol_w300"
                      disabled
                      value={dataInfo.maxMsgSpoolUsage}
                    />
                  </div>
                </div>
                <div id="hideMenu">
                  {dataInfo.eventMsgSpoolUsageThreshold && (
                    <ProgressComponent
                      title={'eventMsgSpoolUsageThreshold'}
                      proData={dataInfo.eventMsgSpoolUsageThreshold}
                      isEditStatus={true}
                      tipNo={5}
                      callbackTipVal={callbackTipVal}
                      onUpdateData={onUpdateData}
                      depthNo={1}></ProgressComponent>
                  )}
                </div>
                {/* Owner */}
                <div className="row col-md-8 align-items-center">
                  <label
                    className="col-sm-5 col-form-label"
                    id="boldTxt"
                    onClick={() => fnTipsChange(6)}>
                    Owner
                  </label>
                  <div className="col-sm-7 col-form-label">
                    <select
                      className="form-select sol_w300"
                      id="set_owner"
                      disabled
                      // onChange={handleLevelChange}
                      // value={dataInfo.owner}
                    >
                      <ClientList
                        vpnIdVal={vpnId}
                        placeholder={false}
                        selectedValue={dataInfo.owner}
                      />
                    </select>
                    {/* <select className="form-select sol_w300" id="set_owner" disabled>
                      <option selected>100</option>
                      <option>200</option>
                      <option>300</option>
                      <option>400</option>
                    </select> */}
                    {/* <input id="set_owner" type="text" className="form-control sol_w300" disabled value={dataInfo.owner} /> */}
                  </div>
                </div>
                {/* Non-Onwer Permission */}
                <div className="row col-md-8 align-items-center">
                  <label
                    className="col-sm-5 col-form-label"
                    id="boldTxt"
                    onClick={() => fnTipsChange(7)}>
                    Non-Onwer Permission
                  </label>
                  <div className="col-sm-7 col-form-label">
                    <select
                      className="form-select sol_w300"
                      id="set_ownerpermission"
                      disabled
                      value={dataInfo.permission}>
                      <option value={'no-access'}>No Access</option>
                      <option value={'read-only'}>Read Only</option>
                      <option value={'consume'}>Consume</option>
                      <option value={'modify-topic'}>Modify Topic</option>
                      <option value={'delete'}>Delete</option>
                    </select>
                  </div>
                </div>

                {/* Maximum Consumer Count */}
                <div className="row col-md-8 align-items-center">
                  <label
                    className="col-sm-5 col-form-label"
                    id="boldTxt"
                    onClick={() => fnTipsChange(8)}>
                    Maximum Consumer Count
                  </label>
                  <div className="col-sm-7 col-form-label">
                    <input
                      id="set_maxConsumerCnt"
                      type="text"
                      className="form-control sol_w300"
                      disabled
                      value={dataInfo.maxBindCount}
                    />
                  </div>
                </div>
                <div id="hideMenu">
                  {dataInfo.eventBindCountThreshold && (
                    <ProgressComponent
                      title={'eventBindCountThreshold'}
                      proData={dataInfo.eventBindCountThreshold}
                      isEditStatus={true}
                      tipNo={9}
                      callbackTipVal={callbackTipVal}
                      onUpdateData={onUpdateData}
                      depthNo={1}></ProgressComponent>
                  )}
                </div>
                {/* Maximum Message Size (B) */}
                <div className="row col-md-8 align-items-center" id="hideMenu">
                  <label
                    className="col-sm-5 col-form-label"
                    onClick={() => fnTipsChange(10)}>
                    Maximum Message Size (B)
                  </label>
                  <div className="col-sm-7 col-form-label">
                    <input
                      id="set_maxMsgSize"
                      type="text"
                      className="form-control sol_w100"
                      disabled
                      value={dataInfo.maxMsgSize}
                    />
                  </div>
                </div>
                {/* Maximum Delivered Unacknowledged Messages per Flow */}
                <div className="row col-md-8 align-items-center" id="hideMenu">
                  <label
                    className="col-sm-5 col-form-label"
                    onClick={() => fnTipsChange(11)}>
                    Maximum Delivered Unacknowledged Messages per Flow
                  </label>
                  <div className="col-sm-7 col-form-label">
                    <input
                      id="set_maxDumpf"
                      type="text"
                      className="form-control sol_w100"
                      disabled
                      value={dataInfo.maxDeliveredUnackedMsgsPerFlow}
                    />
                  </div>
                </div>
                {/* DMQ Name */}
                <div className="row col-md-8 align-items-center" id="hideMenu">
                  <label
                    className="col-sm-5 col-form-label"
                    onClick={() => fnTipsChange(12)}>
                    DMQ Name
                  </label>
                  <div className="col-sm-7 col-form-label">
                    <input
                      id="set_dmqNm"
                      type="text"
                      className="form-control sol_w300"
                      disabled
                      value={dataInfo.deadMsgQueue}
                    />
                  </div>
                </div>
                {/* Enable Client Delivery Count */}
                <div className="row col-md-8" id="hideMenu">
                  <label
                    className="col-sm-5 col-form-label"
                    onClick={() => fnTipsChange(13)}>
                    Enable Client Delivery Count
                  </label>
                  <div className="col-sm-7 col-form-label">
                    <div className="form-check form-switch">
                      <input
                        id="set_clientDeliCnt"
                        className="form-check-input"
                        type="checkbox"
                        disabled
                      />
                    </div>
                  </div>
                </div>
                {/* Delivery Delay (sec) */}
                <div className="row col-md-8 align-items-center" id="hideMenu">
                  <label
                    className="col-sm-5 col-form-label"
                    onClick={() => fnTipsChange(14)}>
                    Delivery Delay (sec)
                  </label>
                  <div className="col-sm-7 col-form-label">
                    <input
                      id="set_deliveryDelay"
                      type="text"
                      className="form-control sol_w100"
                      disabled
                      value={dataInfo.deliveryDelay}
                    />
                  </div>
                </div>

                {/* Message Priority */}
                <div className="row col-md-8 align-items-center" id="hideMenu">
                  <label
                    className="col-sm-5 col-form-label"
                    onClick={() => fnTipsChange(15)}>
                    Message Priority
                  </label>
                </div>
                <div className="row col-md-8 align-items-center" id="hideMenu">
                  <label
                    className="col-sm-5 col-form-label"
                    onClick={() => fnTipsChange(16)}>
                    <span className="sol_ml_10">Respect Message Priority</span>
                  </label>
                  <div className="col-sm-7 col-form-label">
                    <div className="form-check form-switch">
                      <input
                        id="set_msgPriority"
                        className="form-check-input"
                        type="checkbox"
                        disabled
                      />
                    </div>
                  </div>
                </div>
                {/* Message Expiry */}
                <div className="row col-md-8 align-items-center" id="hideMenu">
                  <label
                    className="col-sm-5 col-form-label"
                    onClick={() => fnTipsChange(17)}>
                    Message Expiry
                  </label>
                </div>
                {/* Respect TTL */}
                <div className="row col-md-8 align-items-center" id="hideMenu">
                  <label
                    className="col-sm-5 col-form-label"
                    onClick={() => fnTipsChange(18)}>
                    <span className="sol_ml_10">Respect TTL</span>
                  </label>
                  <div className="col-sm-7 col-form-label">
                    <div className="form-check form-switch">
                      <input
                        id="set_respectTtl"
                        className="form-check-input"
                        type="checkbox"
                        disabled
                      />
                    </div>
                  </div>
                </div>

                {/* Maximum TTL (sec) */}
                <div className="row col-md-8 align-items-center" id="hideMenu">
                  <label
                    className="col-sm-5 col-form-label"
                    onClick={() => fnTipsChange(19)}>
                    <span className="sol_ml_10">Maximum TTL (sec)</span>
                  </label>
                  <div className="col-sm-7 col-form-label">
                    <input
                      id="set_maxTtl"
                      type="text"
                      className="form-control sol_w100"
                      disabled
                      value={dataInfo.maxTtl}
                    />
                  </div>
                </div>

                {/* Redelivery */}
                <div className="row col-md-8 align-items-center" id="hideMenu">
                  <label
                    className="col-sm-5 col-form-label"
                    onClick={() => fnTipsChange(20)}>
                    <span className="sol_ml_10">Redelivery</span>
                  </label>
                  <div className="col-sm-7 col-form-label">
                    <div className="form-check form-switch">
                      <input
                        id="set_redelivery"
                        className="form-check-input"
                        type="checkbox"
                        disabled
                      />
                    </div>
                  </div>
                </div>

                {/* Try Forever */}
                <div className="row col-md-8 align-items-center" id="hideMenu">
                  <label
                    className="col-sm-5 col-form-label"
                    onClick={() => fnTipsChange(21)}>
                    <span className="sol_ml_20">Try Forever</span>
                  </label>
                  <div className="col-sm-7 col-form-label">
                    <div className="form-check form-switch">
                      <input
                        id="set_tryForever"
                        className="form-check-input"
                        type="checkbox"
                        disabled
                      />
                    </div>
                  </div>
                </div>

                {/* Maximum Redelivery Count */}
                <div className="row col-md-8 align-items-center" id="hideMenu">
                  <label
                    className="col-sm-5 col-form-label"
                    onClick={() => fnTipsChange(22)}>
                    <span className="sol_ml_30">Maximum Redelivery Count</span>
                  </label>
                  <div className="col-sm-7 col-form-label">
                    <input
                      id="set_maxRedeliveryCnt"
                      type="text"
                      className="form-control sol_w100"
                      disabled
                      value={dataInfo.maxRedeliveryCount}
                    />
                  </div>
                </div>

                {/* Delayed Redelivery */}
                <div className="row col-md-8 align-items-center" id="hideMenu">
                  <label
                    className="col-sm-5 col-form-label"
                    onClick={() => fnTipsChange(23)}>
                    <span className="sol_ml_20">Delayed Redelivery</span>
                  </label>
                  <div className="col-sm-7 col-form-label">
                    <div className="form-check form-switch">
                      <input
                        id="set_delayedRedelivery"
                        className="form-check-input"
                        type="checkbox"
                        disabled
                      />
                    </div>
                  </div>
                </div>

                {/* Multiplier */}
                <div className="row col-md-8 align-items-center" id="hideMenu">
                  <label
                    className="col-sm-5 col-form-label"
                    onClick={() => fnTipsChange(24)}>
                    <span className="sol_ml_30">Multiplier</span>
                  </label>
                  <div className="col-sm-7 col-form-label">
                    <input
                      id="set_multiplier"
                      type="text"
                      className="form-control sol_w100"
                      disabled
                      value={dataInfo.redeliveryDelayMultiplier / 100}
                    />
                  </div>
                </div>
                {/* Initial Delay */}
                <div className="row col-md-8 align-items-center" id="hideMenu">
                  <label
                    className="col-sm-5 col-form-label"
                    onClick={() => fnTipsChange(25)}>
                    <span className="sol_ml_30">Initial Delay</span>
                  </label>
                  <div className="col-sm-7 col-form-label">
                    <input
                      id="set_initialDelay"
                      type="text"
                      className="form-control sol_w100"
                      disabled
                      value={dataInfo.redeliveryDelayInitialInterval}
                    />
                  </div>
                </div>
                {/* Maximum Delay */}
                <div className="row col-md-8 align-items-center" id="hideMenu">
                  <label
                    className="col-sm-5 col-form-label"
                    onClick={() => fnTipsChange(26)}>
                    <span className="sol_ml_30">Maximum Delay</span>
                  </label>
                  <div className="col-sm-7 col-form-label">
                    <input
                      id="set_maxDelay"
                      type="text"
                      className="form-control sol_w100"
                      disabled
                      value={dataInfo.redeliveryDelayMaxInterval}
                    />
                  </div>
                </div>

                {/* Congestion Control */}
                <div className="row col-md-8 align-items-center" id="hideMenu">
                  <label
                    className="col-sm-5 col-form-label"
                    onClick={() => fnTipsChange(27)}>
                    Congestion Control
                  </label>
                </div>
                {/* <div className="sol_ml_10"> */}
                {/* Reject Messages to Sender on Discard */}
                <div className="row col-md-8 align-items-center" id="hideMenu">
                  <label
                    className="col-sm-5 col-form-label"
                    onClick={() => fnTipsChange(28)}>
                    <span className="sol_ml_10">
                      Reject Messages to Sender on Discard
                    </span>
                  </label>
                  <div className="col-sm-7 col-form-label">
                    <select
                      className="form-select sol_w300"
                      id="set_rejectMsgSender"
                      disabled>
                      <option value={'never'} selected>
                        Silent
                      </option>
                      <option value={'when-queue-enabled'}>
                        Notify-Sender
                      </option>
                      <option value={'always'}>
                        Notify-Sender-Include-Shutdown
                      </option>
                    </select>
                  </div>
                </div>
                {/* Reject Low Priority Messages */}
                <div className="row col-md-8 align-items-center" id="hideMenu">
                  <label
                    className="col-sm-5 col-form-label"
                    onClick={() => fnTipsChange(29)}>
                    <span className="sol_ml_10">
                      Reject Low Priority Messages
                    </span>
                  </label>
                  <div className="col-sm-7 col-form-label">
                    <div className="form-check form-switch">
                      <input
                        id="set_lowPriorityMsg"
                        className="form-check-input"
                        type="checkbox"
                        disabled
                      />
                    </div>
                  </div>
                </div>

                {/* Reject Low Priority Messages Limit */}
                <div className="row col-md-8 align-items-center" id="hideMenu">
                  <label
                    className="col-sm-5 col-form-label"
                    onClick={() => fnTipsChange(30)}>
                    <span className="sol_ml_10">
                      Reject Low Priority Messages Limit
                    </span>
                  </label>
                  <div className="col-sm-7 col-form-label">
                    <input
                      id="set_lowPriorityMsgLimit"
                      type="text"
                      className="form-control sol_w300"
                      disabled
                      value={dataInfo.rejectLowPriorityMsgLimit}
                    />
                  </div>
                </div>

                <div id="hideMenu">
                  {dataInfo.eventRejectLowPriorityMsgLimitThreshold && (
                    <ProgressComponent
                      title={'eventRejectLowPriorityMsgLimitThreshold'}
                      proData={dataInfo.eventRejectLowPriorityMsgLimitThreshold}
                      isEditStatus={true}
                      tipNo={31}
                      callbackTipVal={callbackTipVal}
                      onUpdateData={onUpdateData}
                      depthNo={2}></ProgressComponent>
                  )}
                </div>
                {/* </div> */}

                {/* Disaster Recovery */}
                <div className="row col-md-8 align-items-center" id="hideMenu">
                  <label
                    className="col-sm-5 col-form-label"
                    onClick={() => fnTipsChange(32)}>
                    Disaster Recovery
                  </label>
                </div>
                <div className="row col-md-8 align-items-center" id="hideMenu">
                  <label
                    className="col-sm-5 col-form-label"
                    onClick={() => fnTipsChange(33)}>
                    <span className="sol_ml_10">
                      Consumer Acknowledgment Propagation
                    </span>
                  </label>
                  <div className="col-sm-7 col-form-label">
                    <div className="form-check form-switch">
                      <input
                        id="set_conAckProp"
                        className="form-check-input"
                        type="checkbox"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="col-md-3 sol_box_bl">
            <div className="sol_p_10">
              <div className="sol_a_tip" onClick={fnTipShowHide}><i className="sol_i_tiparr sol_mr_6"></i>Tips</div>
              <div className="mt-3 sol_tip_text" id="tipArea">
              </div>
            </div>
          </div> */}
        </form>
      </div>

      <div className="sol_footer_pagenation fixed-bottom">
        <div className="col d-flex justify-content-end">
          <RefreshData onRefreshClick={refreshData} refreshTime={refreshTime} />
        </div>
      </div>
    </>
  );
}
