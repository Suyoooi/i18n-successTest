'use client';

import React, { useEffect, useState } from 'react';
import { useAddRuleContext } from '@/context/alert/addRuleContext';
import Nelson from '../common/step2/nelson';
import CodeList from '@/app/[locale]/components/commons/codeList';
import CodeNameList from '@/app/[locale]/components/commons/codeNameList';
import Thresholds2 from '../common/step2/thresholds2';
import MethodList from '../common/step2/methodList';
import { useRouter } from 'next/navigation';

export default function Step2() {
  const {
    targetType,
    vpnName,
    brokerName,
    queueName,
    alertLevel,
    setAlertLevel,
    setTargetItemName,
    targetItem,
    setTargetItem,
    setInspectionMethod,
    inspectionMethod,
    selectedCdInfo,
    setSelectedCdInfo,
    belowBtn,
    aboveBtn,
    selectedValueType,
    setInspectionRule
  } = useAddRuleContext();
  const router = useRouter();

  // level 선택
  const handleLevelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAlertLevel(event.target.value);
  };

  const handleInspectionMethodChange = (cdId: string, cdNm: string) => {
    setInspectionMethod(cdId);
  };

  const handleTargetItemChange = (cdId: any, cdNm: string, cdInfo: string) => {
    setTargetItem(cdId);
    setTargetItemName(cdNm);
    // console.log("cdInfo :::", cdInfo);
    setSelectedCdInfo(cdInfo);
  };

  const handleNextClick = () => {
    if (!targetItem || !selectedCdInfo) {
      alert('Please make sure all selections are made before proceeding.');
    } else {
      router.push('/rule/step3');
    }
  };

  const handlePrevClick = () => {
    router.push('/rule/step1');
  };

  useEffect(() => {
    if (vpnName === '' && brokerName === '') {
      router.push('/rule/step1');
    }
  }, [vpnName, brokerName]);

  return (
    <div className="tab-base">
      <div className="tab-content">
        <div className="mt-5 row justify-content-center">
          <div className="sol_w800">
            <div className="sol_box_p0 sol_p_20">
              <div className="col d-flex align-items-center">
                <div className="col-md-3">
                  <label className="col-form-label" htmlFor="input_targetitem">
                    Target item Name
                  </label>
                </div>
                <div className="col-md-9">
                  <input
                    type="text"
                    className="form-control"
                    id="input_targetitem"
                    value={
                      targetType === 'MLSN'
                        ? `${brokerName} > ${vpnName}`
                        : `${brokerName} > ${vpnName} > ${queueName}`
                    }
                    disabled
                  />
                </div>
              </div>
              {/* === Alert Monitoring items === */}
              <div className="col d-flex align-items-center mt-3">
                <div className="col-md-3">
                  <label
                    className="col-form-label"
                    htmlFor="input_alertmonitoring">
                    Alert Monitoring items
                  </label>
                </div>
                <div className="col-md-9">
                  <CodeNameList
                    codeGroupId={`ALERT_TRGT_${targetType}_TP`}
                    selectedValue={targetItem}
                    onItemSelect={(cdId: any, cdNm: string, cdInfo: string) =>
                      handleTargetItemChange(cdId, cdNm, cdInfo)
                    }
                    addStyle="sol_w300"
                  />
                </div>
              </div>
              {/* === Inspection Method / Level === */}
              <div className="col d-flex align-items-center mt-3">
                <div className="col-md-3">
                  <label className="col-form-label">Inspection Method</label>
                </div>
                <div className="col-md-3">
                  <MethodList
                    codeGroupId={'ALERT_INSP_RULE_TP'}
                    selectedValue={inspectionMethod}
                    onItemSelect={(cdId: any, cdNm: string) =>
                      handleInspectionMethodChange(cdId, cdNm)
                    }
                    placeholder={true}
                  />
                </div>
                {/* == Level == */}
                <div className="col-md-3">
                  <label className="col-form-label" htmlFor="input_level">
                    <span className="sol_ml_20">Level</span>
                  </label>
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    id="input_level"
                    onChange={handleLevelChange}
                    value={alertLevel}>
                    <CodeList
                      codeGroupId={'ALERT_LEVEL_TP'}
                      placeholder={false}
                      selectedValue={alertLevel}
                    />
                  </select>
                </div>
              </div>
              <Thresholds2 codeInfo={selectedCdInfo} />
              <Nelson />
            </div>
            <div className="d-flex sol_mtb_15">
              <div className="col-md-6">
                <button
                  className="btn btn-md btn-outline-light"
                  onClick={handlePrevClick}>
                  <i className="sol_i_prev sol_mr_6" />
                  Prev
                </button>
              </div>
              <div className="col-md-6 text-end">
                <button
                  className="btn btn-md btn-outline-light justify-content-end"
                  onClick={handleNextClick}>
                  Next
                  <i className="sol_i_next sol_ml_6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
