'use client';

import RefreshData from '@/app/[locale]/components/footer/refreshData';
import ProgressComponent from '@/app/[locale]/components/progress/progressComponent';
import { TipsData } from '@/data/queue/tips';
import { selectQueueSetting } from '@/data/selectType';
import { useAppSelector } from '@/hook/hook';
import useRefreshData from '@/hook/useRefreshData';
import { QueueSettingInputBody } from '@/types/edit';
import { formatDateTime } from '@/utils/dateTimeFormat';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import qs from 'qs';
import { useContext, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import TipsSideBar from '@/app/[locale]/components/sideBar/tipsSideBar';
import AlertModal from '@/app/[locale]/components/alert/alertModal';
import alertModal from '@/app/[locale]/components/alert/alertModal1';
import ClientList from '@/app/[locale]/components/commons/clientList';
// import ConfirmContext from '@/context/confirm/ConfirmContext';
// import { confirmAlert } from 'react-confirm-alert';

axios.defaults.paramsSerializer = params => {
  return qs.stringify(params, { arrayFormat: 'repeat' });
};

export default function QueueSettingsPage() {
  const selectedVpn = useAppSelector(state => state.isVpn.selectedRow);
  const selectedId = useAppSelector(state => state.isVpn.selectedId);
  const selectedQueue = useAppSelector(state => state.queue.selectedQueue);

  const vpnNm = selectedVpn?.msgVpnName;
  const vpnId = selectedId?.mlsnSn;

  const router = useRouter();

  const headerInfo = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  };

  const schema: any = yup.object().shape({
    set_incoming: yup.string().required(),
    set_outgoing: yup.string().required(),
    acc_exclusive: yup.string().required(),
    acc_nonExclusive: yup.string().required(),
    set_msgQueueQuota: yup
      .number()
      .integer('Messages Queued Quota (MB) must be an integer.')
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : value
      )
      .typeError('Messages Queued Quota (MB) must be an integer.')
      .min(
        0,
        'Messages Queued Quota (MB) must be an integer between 0 and 6000000.'
      )
      .max(
        6000000,
        'Messages Queued Quota (MB) must be an integer between 0 and 6000000.'
      )
      .required(
        'Messages Queued Quota (MB) is required and must be an integer between 0 and 6000000.'
      ),
    set_owner: yup.string().nullable(),
    set_ownerpermission: yup.string().nullable(),
    set_maxConsumerCnt: yup
      .number()
      .integer('Maximum Consumer Count must be an integer.')
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : value
      )
      .typeError('Maximum Consumer Count must be an integer.')
      .min(0, 'Maximum Consumer Count must be an integer between 0 and 10000.')
      .max(
        10000,
        'Maximum Consumer Count must be an integer between 0 and 10000.'
      )
      .required(
        'Maximum Consumer Count must be an integer between 0 and 10000.'
      ),
    set_maxMsgSize: yup.string().nullable(),
    set_maxDumpf: yup.string().nullable(),
    set_dmqNm: yup.string().nullable(),
    set_clientDeliCnt: yup.string().nullable(),
    set_deliveryDelay: yup.string().nullable(),
    set_msgPriority: yup.string().nullable(),
    set_respectTtl: yup.string().nullable(),
    set_maxTtl: yup.string().nullable(),
    set_redelivery: yup.string().nullable(),
    set_tryForever: yup.string().nullable(),
    set_maxRedeliveryCnt: yup.string().nullable(),
    set_delayedRedelivery: yup.string().nullable(),
    set_multiplier: yup.number().nullable(),
    set_initialDelay: yup.string().nullable(),
    set_maxDelay: yup.string().nullable(),
    set_rejectMsgSender: yup.string().nullable(),
    set_lowPriorityMsg: yup.string().nullable(),
    set_lowPriorityMsgLimit: yup.string().nullable(),
    set_conAckProp: yup.string().nullable(),
    set_partitionCount: yup.string().nullable(),
    set_rebalanceDelay: yup.string().nullable(),
    set_maxHandoffTime: yup.string().nullable()
  });
  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    setFocus,
    formState: { isSubmitting, isDirty, errors }
  } = useForm<QueueSettingInputBody>({
    resolver: yupResolver(schema)
  });

  const handleRegistration: SubmitHandler<QueueSettingInputBody> = data => {
    console.log(data);
    fnSettingApply(data);
  };
  const headleError = (errors: any) => {};

  const [tipsInfo, setTipsInfo] = useState('');
  const [dataInfo, setDataInfo] = useState<any>([]);
  const [isEnable, setIsEnable] = useState<boolean>(false);
  const [hiddenMenu, setHiddenMenu] = useState<boolean>(true);
  const [accType, setAccType] = useState<boolean>(false);
  const [eventMsuData, setEventMsuData] = useState<any>({});
  const [eventBindCntData, setEventBindCntData] = useState<any>({});
  const [eventRlpmlData, setEventRlpmlData] = useState<any>({});
  const [selectedTipId, setSelectedTipId] = useState<number>(0);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const { refreshTime, refreshData } = useRefreshData(
    formatDateTime(new Date())
  );

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsEnable(event.target.checked);
  };
  const queueNm = selectedQueue?.queueName;
  const arrVal: any[] = [];

  const fetchTableData = async () => {
    try {
      if (vpnNm && vpnNm != '') {
        if (queueNm && queueNm != '') {
          const base64QueueNm = Buffer.from(queueNm).toString('base64');
          console.log(queueNm);
          console.log(base64QueueNm);
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
  }, [selectedVpn, selectedId, selectedQueue]);

  useEffect(() => {}, [dataInfo]);

  useEffect(() => {
    handleHiddenMenu();
  }, []);

  const dataSetInfo = (data: any) => {
    setValue('set_incoming', data.ingressEnabled);
    setValue('set_outgoing', data.egressEnabled);
    setValue('set_msgQueueQuota', data.maxMsgSpoolUsage);
    setValue('set_owner', data.owner);
    setValue('set_ownerpermission', data.permission);
    setValue('set_maxConsumerCnt', data.maxBindCount);
    setValue('set_maxMsgSize', data.maxMsgSize);
    setValue('set_maxDumpf', data.maxDeliveredUnackedMsgsPerFlow);
    setValue('set_dmqNm', data.deadMsgQueue);
    setValue('set_clientDeliCnt', data.deliveryCountEnabled);
    setValue('set_deliveryDelay', data.deliveryDelay);
    setValue('set_msgPriority', data.respectMsgPriorityEnabled);
    setValue('set_respectTtl', data.respectTtlEnabled);
    setValue('set_maxTtl', data.maxTtl);
    setValue('set_redelivery', data.redeliveryEnabled);
    setValue('set_tryForever', data.respectMsgPriorityEnabled);
    setValue('set_maxRedeliveryCnt', data.maxRedeliveryCount);
    setValue('set_delayedRedelivery', data.redeliveryDelayEnabled);
    setValue('set_multiplier', parseInt(data.redeliveryDelayMultiplier) / 100);
    setValue('set_initialDelay', data.redeliveryDelayInitialInterval);
    setValue('set_maxDelay', data.redeliveryDelayMaxInterval);
    setValue('set_rejectMsgSender', data.rejectMsgToSenderOnDiscardBehavior);
    setValue('set_lowPriorityMsg', data.rejectLowPriorityMsgEnabled);
    setValue('set_lowPriorityMsgLimit', data.rejectLowPriorityMsgLimit);
    setValue('set_conAckProp', data.consumerAckPropagationEnabled);
    setValue('set_partitionCount', data.partitionCount);
    setValue('set_rebalanceDelay', data.partitionRebalanceDelay);
    setValue('set_maxHandoffTime', data.partitionRebalanceMaxHandoffTime);

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
    checkSetVal(data.respectMsgPriorityEnabled, tryForever);
    checkSetVal(data.redeliveryDelayEnabled, delayedRedelivery);
    checkSetVal(data.rejectLowPriorityMsgEnabled, lowPriorityMsg);
    checkSetVal(data.consumerAckPropagationEnabled, conAckProp);

    const exclusiveVal = document.getElementById('acc_exclusive_label');
    const nonExclusiveVal = document.getElementById('acc_nonExclusive_label');

    if (data.accessType && data.accessType === 'exclusive') {
      exclusiveVal?.classList.add('active');
      nonExclusiveVal?.classList.remove('active');
      setAccType(false);
      setValue('acc_exclusive', 'true');
      setValue('acc_nonExclusive', 'false');
    } else {
      exclusiveVal?.classList.remove('active');
      nonExclusiveVal?.classList.add('active');
      setAccType(true);
      setValue('acc_exclusive', 'false');
      setValue('acc_nonExclusive', 'true');
    }
  };

  const checkSetVal = (datas: any, tagId: any) => {
    if (datas) {
      tagId.checked = true;
    } else {
      tagId.checked = false;
    }
  };

  const fnTipsChange = (idVal: any) => {
    const result = TipsData.find(({ id }) => id === idVal);
    const tipHeader = result?.tips_header;
    const tipBody = result?.tip_body;
    const tipSubInfo = result?.tip_sub;
    const moreYn = result?.moreYn;
    const moreLink = result?.moreLink;

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
    router.push(link);
  };

  const callbackTipVal = (num: number) => {
    fnTipsChange(num);
  };

  const accesTypeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const eventId = event.target.id;
    const excluseLabel = document.getElementById('acc_exclusive_label');
    const nonExcluseLabel = document.getElementById('acc_nonExclusive_label');

    if (eventId === 'acc_nonExclusive') {
      excluseLabel?.classList.remove('active');
      nonExcluseLabel?.classList.add('active');
      setAccType(true);
    } else {
      excluseLabel?.classList.add('active');
      nonExcluseLabel?.classList.remove('active');
      setAccType(false);
    }

    console.log(accType);
  };

  const fnEditCancel = () => {
    router.back();
  };

  const fnTipShowHide = () => {
    console.log('aaaa');
  };

  const handleHiddenMenu = () => {
    setHiddenMenu(!hiddenMenu);

    const hideDiv = document.querySelectorAll("[id='hideMenu']");
    const boldDiv = document.querySelectorAll("[id='boldTxt']");

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

  // const { confirm: confirmComp } = useContext(ConfirmContext);
  const fnSettingApply = async (data: QueueSettingInputBody) => {
    if (data && data != null) {
      // const confirmResult = await confirmComp('Would you like to edit the setting information?');
      // console.log(confirmResult)

      // confirmAlert({
      //   title: 'Confirm to submit',
      //   message: 'Are you sure to do this.',
      //   buttons: [
      //     {
      //       label: 'Yes',
      //       onClick: () => alert('Click Yes')
      //     },
      //     {
      //       label: 'No',
      //       onClick: () => alert('Click No')
      //     }
      //   ]
      // });

      if (confirm('Would you like to edit the setting information?')) {
        try {
          if (queueNm && queueNm != '') {
            const base64QueueNm = Buffer.from(queueNm).toString('base64');
            const getSettingUrl = `/api/v2/msgVpns/${vpnId}/queues/${base64QueueNm}`;
            const accessTypeVal = document.getElementsByName(
              'accessTypeVal'
            ) as any;
            let checkVal = null;
            for (var i = 0; i < accessTypeVal.length; i++) {
              if (accessTypeVal[i].checked) {
                checkVal = accessTypeVal[i].id;
              }
            }

            let accessTypeInfo = '';

            if (checkVal === 'acc_exclusive') {
              accessTypeInfo = 'exclusive';
            } else if (checkVal === 'acc_nonExclusive') {
              accessTypeInfo = 'non-exclusive';
            }

            const getParamsVal = {
              accessType: accessTypeInfo,
              consumerAckPropagationEnabled: data.set_conAckProp,
              deadMsgQueue: data.set_dmqNm,
              deliveryCountEnabled: data.set_clientDeliCnt,
              deliveryDelay: data.set_deliveryDelay,
              egressEnabled: data.set_outgoing,
              ingressEnabled: data.set_incoming,
              maxBindCount: data.set_maxConsumerCnt,
              maxDeliveredUnackedMsgsPerFlow: data.set_maxDumpf,
              maxMsgSize: data.set_maxMsgSize,
              maxMsgSpoolUsage: data.set_msgQueueQuota,
              maxRedeliveryCount: data.set_maxRedeliveryCnt,
              maxTtl: data.set_maxTtl,
              msgVpnName: vpnNm,
              owner: data.set_owner,
              partitionCount: data.set_partitionCount,
              partitionRebalanceDelay: data.set_rebalanceDelay,
              partitionRebalanceMaxHandoffTime: data.set_maxHandoffTime,
              permission: data.set_ownerpermission,
              queueName: queueNm,
              redeliveryDelayEnabled: data.set_delayedRedelivery,
              redeliveryDelayInitialInterval: data.set_initialDelay,
              redeliveryDelayMaxInterval: data.set_maxDelay,
              redeliveryDelayMultiplier: data.set_multiplier * 100,
              redeliveryEnabled: data.set_redelivery,
              rejectLowPriorityMsgEnabled: data.set_lowPriorityMsg,
              rejectLowPriorityMsgLimit: data.set_lowPriorityMsgLimit,
              rejectMsgToSenderOnDiscardBehavior: data.set_rejectMsgSender,
              respectMsgPriorityEnabled: data.set_msgPriority,
              respectTtlEnabled: data.set_respectTtl,
              ...eventMsuData,
              ...eventBindCntData,
              ...eventRlpmlData
            };

            console.log(getParamsVal);

            await axios
              .patch(getSettingUrl, getParamsVal, {
                headers: headerInfo
              })
              .then(function (response) {
                const resCode = response.data.meta.responseCode;
                if (resCode === 200) {
                  alert('Changes Applied Successfully');
                  // setOpenModal(true);
                  // alertModal('Changes Applied Successfully', "Success", openModal, true, true, onConfirm, onCancel)
                  router.back();
                }
              })
              .catch(function (error) {
                const metaInfo = error.response.data.meta;

                if (metaInfo && metaInfo != null) {
                  const errCd = metaInfo.responseCode;
                  const errId = metaInfo.error.code;
                  const errMsg = metaInfo.error.description;

                  if (errCd && errCd === 400) {
                    if (errId && errId === 89) {
                      alert(errMsg);
                    } else {
                      console.log(error);
                    }
                  } else {
                    console.log(error);
                  }
                }
              });
          } else {
            console.log('No Selected Queue');
          }
        } catch (err: any) {
          console.error('에러:', err);
        }
      }
    }
  };

  const onConfirm = () => {
    setOpenModal(false);
    router.back();
  };

  const onCancel = () => {
    setOpenModal(false);
  };

  const eventMsgSpoolUsage = (dataVal: any) => {
    setEventMsuData(dataVal);
  };

  const eventBindCount = (dataVal: any) => {
    setEventBindCntData(dataVal);
  };

  const eventRejectLowPriorityMsgLimit = (dataVal: any) => {
    setEventRlpmlData(dataVal);
  };

  return (
    <>
      <div className="sol_breadcrumb_area">
        <div className="row d-flex no-gutters position-relative">
          <div className="col-md-6">
            <h3>Edit Queue Settings</h3>
          </div>

          <TipsSideBar
            data={TipsData}
            selectedTipId={selectedTipId}
            top={150}
            bottom={20}
          />

          <div
            className="col-md-6 d-flex justify-content-end gap-2 position-absolute"
            style={{ right: 0, top: -7 }}>
            <button className="btn btn-outline-light" onClick={fnEditCancel}>
              Cancel
            </button>
            <button
              className="btn btn-outline-info"
              onClick={handleSubmit(handleRegistration, headleError)}>
              Apply
            </button>
          </div>
        </div>
      </div>
      <form className="row mt-2">
        <div className="col-md-12">
          <div className="row col-md-4">
            <h5 onClick={handleHiddenMenu} style={{ cursor: 'pointer' }}>
              {hiddenMenu ? 'Hide Advanced Settings' : 'Show Advanced Settings'}
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
            <div className="sol_ml_12">
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
                      className="form-check-input"
                      type="checkbox"
                      {...register('set_incoming')}
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
                      className="form-check-input"
                      type="checkbox"
                      {...register('set_outgoing')}
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
                          onChange={accesTypeHandler}
                        />
                        <label
                          className="au-target"
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
                          onChange={accesTypeHandler}
                        />
                        <label
                          className="au-target"
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
                        {...register('set_partitionCount')}
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
                        {...register('set_rebalanceDelay')}
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
                        {...register('set_maxHandoffTime')}
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
                  {/* <input id="set_msgQueueQuota" type="text" className="form-control sol_w300" {...register('set_msgQueueQuota')} /> */}
                  <input
                    type="text"
                    className={`form-control sol_w300 ${
                      errors.set_msgQueueQuota ? 'is-invalid' : ''
                    }`}
                    id="set_msgQueueQuota"
                    {...register('set_msgQueueQuota')}
                  />
                  <div className="invalid-feedback">
                    {errors.set_msgQueueQuota?.message}
                  </div>
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
                    onUpdateData={eventMsgSpoolUsage}
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
                    {...register('set_owner')}>
                    <ClientList
                      vpnIdVal={vpnId}
                      placeholder={false}
                      selectedValue={dataInfo.owner}
                    />
                  </select>
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
                    {...register('set_ownerpermission')}>
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
                  {/* <input id="set_maxConsumerCnt" type="text" className="form-control sol_w300" {...register('set_maxConsumerCnt')} /> */}
                  <input
                    type="text"
                    className={`form-control sol_w300 ${
                      errors.set_maxConsumerCnt ? 'is-invalid' : ''
                    }`}
                    id="set_maxConsumerCnt"
                    {...register('set_maxConsumerCnt')}
                  />
                  <div className="invalid-feedback">
                    {errors.set_maxConsumerCnt?.message}
                  </div>
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
                    onUpdateData={eventBindCount}
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
                    {...register('set_maxMsgSize')}
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
                    {...register('set_maxDumpf')}
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
                    {...register('set_dmqNm')}
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
                      {...register('set_clientDeliCnt')}
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
                    {...register('set_deliveryDelay')}
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
                      {...register('set_msgPriority')}
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
                      {...register('set_respectTtl')}
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
                    {...register('set_maxTtl')}
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
                      {...register('set_redelivery')}
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
                      {...register('set_tryForever')}
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
                    {...register('set_maxRedeliveryCnt')}
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
                      {...register('set_delayedRedelivery')}
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
                    {...register('set_multiplier')}
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
                    {...register('set_initialDelay')}
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
                    {...register('set_maxDelay')}
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
                    disabled
                    {...register('set_rejectMsgSender')}>
                    <option value={'never'}>Silent</option>
                    <option value={'when-queue-enabled'}>Notify-Sender</option>
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
                      {...register('set_lowPriorityMsg')}
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
                    {...register('set_lowPriorityMsgLimit')}
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
                    onUpdateData={eventRejectLowPriorityMsgLimit}
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
                      {...register('set_conAckProp')}
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
      {/* <AlertModal
        description={'Changes Applied Successfully'}
        state={"Success"}
        show={openModal}
        cancelBtnShow={true}
        confirmBtnShow={true}
        onConfirm={onConfirm}
        onCancel={onCancel}
      /> */}
    </>
  );
}
