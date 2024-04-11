'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AddRuleContext } from '@/context/alert/addRuleContext';
import Step1 from './content/step1';
import Step2 from './content/step2';
import Step3 from './content/step3';
import Step4 from './content/step4';
import { InspectionRuleParamType } from './type/type';
import axios from 'axios';
import initTranslations from '@/i18n';
import useCustomTranslations from '@/hook/useCustomTranslations';

const i18nNamespaces = ['home'];

// export default function Layout() {
export default function Layout({
  params: { locale }
}: {
  params: { locale: string };
}) {
  const t = useCustomTranslations(locale, ['home']);

  const router = useRouter();
  const [index, setIndex] = useState(0);
  // step1
  const [targetType, setTargetType] = useState<string>('MLSN');
  const [vpnName, setVpnName] = useState<string>('');
  const [brokerName, setBrokerName] = useState<string>('');
  const [queueName, setQueueName] = useState<string>('');
  const [vpnBtn, setVpnBtn] = useState<boolean>(true);
  const [queueBtn, setQueueBtn] = useState<boolean>(false);
  const [selectedVpn, setSelectedVpn] = useState<string>('');
  const [selectedMlsnData, setSelectedMlsnData] = useState<string>('');
  // step2
  const [targetItemName, setTargetItemName] = useState<string>('');
  const [targetItem, setTargetItem] = useState<string>('');
  const [inspectionMethod, setInspectionMethod] = useState<string>('THRESHOLD');
  const [inspectionRule, setInspectionRule] = useState<string>('CPRTIUP');
  const [inspectionType, setInspectionType] = useState<string>('percent');
  const [inspectionRuleParam, setInspectionRuleParam] =
    useState<InspectionRuleParamType>({
      thresholdValue: 0,
      nsRules: 3,
      nsRuleMean: 10,
      nsRuleStd: 0.1
    });
  const [alertLevel, setAlertLevel] = useState<string>('CRI');
  const [aboveBtn, setAboveBtn] = useState<boolean>(false);
  const [belowBtn, setBelowBtn] = useState<boolean>(false);
  const [selectedValueType, setSelectedValueType] = useState<string>('percent');
  const [stdVaild, setStdVaild] = useState<boolean>(false);
  const [selectedCdInfo, setSelectedCdInfo] = useState<string>('');
  // step3
  const [msgTemp, setMsgTemp] = useState<string>('');
  const [alertRuleName, setAlertRuleName] = useState<string>('');
  const [alertMsg, setAlertMsg] = useState<string>('');
  const [checkValue, setCheckValue] = useState<number>(0);
  const [notiCount, setNotiCount] = useState<number>(2);
  const [notiPeriod, setNotiPeriod] = useState<number>(60);

  const data = [
    {
      id: 0,
      // title: 'Select Target For Alert',
      title: t.t('MUL_WD_0045'),
      contentComponent: <Step1 />
    },
    {
      id: 1,
      // title: 'Inspection Method & Value Configuration',
      title: t.t('MUL_WD_0046'),
      contentComponent: <Step2 />
    },
    {
      id: 2,
      // title: 'Compose Alert Message',
      title: t.t('MUL_WD_0047'),
      contentComponent: <Step3 />
    },
    {
      id: 3,
      // title: 'Configure Transmission Channel & Recipients',
      title: t.t('MUL_WD_0048'),
      contentComponent: <Step4 />
    }
  ];

  const postData = async () => {
    const url = '/api/v2/alertMgmt/alert';
    try {
      const bodyData = {
        targetType: targetType,
        msn: brokerName,
        mlsn: vpnName,
        msc: queueName,
        targetItem: targetItem,
        inspectionMethod: inspectionMethod,
        inspectionRule: inspectionRule,
        inspectionRuleParam: {
          thresholdValue: inspectionRuleParam.thresholdValue,
          nsRules: inspectionRuleParam.nsRules,
          nsRuleMean: inspectionRuleParam.nsRuleMean,
          nsRuleStd: inspectionRuleParam.nsRuleStd
        },
        alertLevel: alertLevel,
        notiCount: notiCount,
        notiPeriod: notiPeriod * 60,
        alertRuleName: alertRuleName,
        alertMsg: alertMsg
      };
      console.log(bodyData);
      const response = await axios.post(url, bodyData, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        }
      });
      if (response.status === 200) {
        console.log(response);
        alert('Successfully added rule');
        router.push('/msg');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('failed added rule');
    }
  };

  function validateStep1(): boolean {
    if (targetType === 'MLSN') {
      return vpnName !== '' && brokerName !== '';
    } else if (targetType === 'QUE') {
      return vpnName !== '' && brokerName !== '' && queueName !== '';
    }
    return false;
  }

  function validateStep2(): boolean {
    return !!targetItem;
  }

  function validateStep3(): boolean {
    return !!msgTemp;
  }

  const handlePrevClick = () => {
    if (index > 0) {
      setIndex(prevIndex => prevIndex - 1);
      console.log('현재 step:::', index);

      if (index === 2) {
        // Step 3 초기화
        setMsgTemp('');
        setAlertRuleName('');
        setAlertMsg('');
        setCheckValue(0);
        setNotiCount(2);
        setNotiPeriod(60);
      } else if (index === 1) {
        // Step 2 초기화
        setTargetItemName('');
        setTargetItem('');
        setInspectionMethod('THRESHOLD');
        setInspectionRule('');
        setInspectionType('percent');
        setInspectionRuleParam({
          thresholdValue: 0,
          nsRules: 3,
          nsRuleMean: 10,
          nsRuleStd: 0.1
        });
        setAlertLevel('CRI');
        setAboveBtn(false);
        setBelowBtn(false);
        setSelectedValueType('percent');
        setSelectedCdInfo('');
      }
    }
  };

  const handleNextClick = () => {
    let isStepValid = false;

    switch (index) {
      case 0:
        isStepValid = validateStep1();
        break;
      case 1:
        isStepValid = validateStep2();
        break;
      case 2:
        isStepValid = validateStep3();
        break;
      default:
        isStepValid = true;
    }
    if (index === 0) {
      if (targetType === 'MLSN') {
        if (!vpnName && !brokerName) {
          alert(
            'Please complete the current step before moving to the next step.'
          );
          return;
        }
      } else if (targetType === 'QUE') {
        if (!vpnName && !brokerName && !queueName) {
          alert(
            'Please complete the current step before moving to the next step.'
          );
          return;
        }
      }
    }

    if (index === 1) {
      if (stdVaild) {
        alert('Please check the standard deviation');
        return;
      }
    }

    if (!isStepValid) {
      alert('Please complete the current step before moving to the next step.');
      return;
    }

    if (index < data.length - 1) {
      setIndex(prevIndex => prevIndex + 1);
    }
  };

  const handleTabClick = (id: number) => {
    if (id > index) {
      let isStepValid = false;

      switch (index) {
        case 0:
          isStepValid = validateStep1();
          break;
        case 1:
          isStepValid = validateStep2();
          break;
        case 2:
          isStepValid = validateStep3();
          break;
        default:
          isStepValid = true;
      }

      if (!isStepValid) {
        alert(
          'Please complete the current step before moving to the next step.'
        );
        return;
      }

      if (id === 0) {
        // Step 2 초기화
        setTargetItemName('');
        setTargetItem('');
        setInspectionMethod('THRESHOLD');
        setInspectionRule('CPRTIUP');
        setInspectionType('percent');
        setInspectionRuleParam({
          thresholdValue: 0,
          nsRules: 3,
          nsRuleMean: 10,
          nsRuleStd: 0.1
        });
        setAlertLevel('CRI');
        setAboveBtn(false);
        setBelowBtn(false);
        setSelectedValueType('percent');
        setSelectedCdInfo('');
        // Step 3 초기화
        setMsgTemp('');
        setAlertRuleName('');
        setAlertMsg('');
        setCheckValue(0);
        setNotiCount(2);
        setNotiPeriod(60);
      } else if (id === 1) {
        // Step 3 초기화
        setMsgTemp('');
        setAlertRuleName('');
        setAlertMsg('');
        setCheckValue(0);
        setNotiCount(2);
        setNotiPeriod(60);
      }
    }

    setIndex(id);
  };

  const handleCancelClick = () => {
    router.push('/msg');
  };

  const handleConfirmClick = () => {
    postData();
  };

  return (
    <>
      <AddRuleContext.Provider
        value={{
          targetType,
          setTargetType,
          vpnName,
          setVpnName,
          brokerName,
          setBrokerName,
          queueName,
          setQueueName,
          selectedVpn,
          setSelectedVpn,
          vpnBtn,
          setVpnBtn,
          queueBtn,
          setQueueBtn,
          selectedMlsnData,
          setSelectedMlsnData,
          targetItemName,
          setTargetItemName,
          targetItem,
          setTargetItem,
          inspectionType,
          setInspectionType,
          selectedCdInfo,
          setSelectedCdInfo,
          inspectionMethod,
          setInspectionMethod,
          inspectionRule,
          setInspectionRule,
          inspectionRuleParam,
          setInspectionRuleParam,
          alertLevel,
          setAlertLevel,
          alertRuleName,
          setAlertRuleName,
          stdVaild,
          setStdVaild,
          aboveBtn,
          setAboveBtn,
          belowBtn,
          setBelowBtn,
          selectedValueType,
          setSelectedValueType,
          msgTemp,
          setMsgTemp,
          alertMsg,
          setAlertMsg,
          checkValue,
          setCheckValue,
          notiCount,
          setNotiCount,
          notiPeriod,
          setNotiPeriod
        }}>
        <div>
          <div className="content__wrap">
            <div className="sol_breadcrumb_area">
              <div className="row">
                <div className="row d-flex col-md-8">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0">
                      {/* <li className="breadcrumb-item">EMMA</li> */}
                      <li className="breadcrumb-item">
                        <a href="/msg">Alert Management</a> | Anomalies
                      </li>
                      <li className="breadcrumb-item">{t.t('MUL_WD_0052')}</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
            <div className="tab-base">
              <div className="position-relative">
                <ul className="nav nav-callout" role="tablist">
                  {data.map(item => (
                    <li className="nav-item" role="presentation" key={item.id}>
                      <button
                        className={`nav-link ${
                          index === item.id ? 'active' : ''
                        }`}
                        type="button"
                        onClick={() => handleTabClick(item.id)}>
                        {item.title}
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="d-flex position-absolute justify-content-end gap-2 sol_tab_rigbtn">
                  <a
                    className="btn hstack btn-outline-light"
                    onClick={handleCancelClick}>
                    {/* Cancel */}
                    {t.t('21')}
                  </a>
                </div>
              </div>
            </div>
            {data
              .filter(item => index === item.id)
              .map(item => (
                <div key={item.id}>
                  {item.contentComponent}
                  {/* <!-- button : Prev, Next --> */}
                  <div className="tab-base">
                    <div className="row justify-content-center">
                      <div className="sol_w800">
                        <div className="d-flex">
                          <div className="col-md-6">
                            <button
                              className={`btn btn-md btn-outline-light ${
                                item.id === 0 ? 'disabled' : ''
                              }`}
                              onClick={handlePrevClick}>
                              <i className="sol_i_prev sol_mr_6" />
                              {/* Prev */}
                              {t.t('15')}
                            </button>
                          </div>
                          <div className="col-md-6 text-end">
                            {item.id === 3 ? (
                              <button
                                className="btn btn-md btn-outline-secondary justify-content-end"
                                onClick={handleConfirmClick}>
                                {/* Confirm */}
                                {t.t('20')}
                              </button>
                            ) : (
                              <button
                                className="btn btn-md btn-outline-light justify-content-end"
                                onClick={handleNextClick}>
                                {/* Next */}
                                {t.t('16')}
                                <i className="sol_i_next sol_ml_6" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </AddRuleContext.Provider>
    </>
  );
}
