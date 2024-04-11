"use client";

import React, { useEffect, useState } from "react";
import ProgressBar from "./progressBar";

interface ProgressComponentProps {
  title: string;
  isEditStatus?: boolean;
  proData: any;
  tipNo: number;
  onUpdateData: (newData: any) => void;
  depthNo?: number;
  callbackTipVal: (tipNum: number) => void;
}
const ProgressComponent: React.FC<ProgressComponentProps> = ({
  title,
  isEditStatus,
  proData,
  tipNo,
  onUpdateData,
  depthNo,
  callbackTipVal,
}) => {
  const [proDataVal, setProDataVal] = useState<any>(proData || {});
  const [clearPercentage, setClearPercentage] = useState<number>(
    proDataVal?.clearPercent || 0
  );
  const [raisePercentage, setRaisePercentage] = useState<number>(
    proDataVal?.setPercent || 0
  );
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [clearShap, setClearShap] = useState<number>(
    proDataVal?.clearValue || 0
  );
  const [raiseShap, setRaiseShap] = useState<number>(proDataVal?.setVaue || 0);

  // 버튼 상태
  const hasPercentData =
    proData && "clearPercent" in proData && "setPercent" in proData;
  const hasValueData =
    proData && "clearValue" in proData && "setValue" in proData;

  // 버튼 상태를 관리할 상태 변수들
  const [btn1Status, setBtn1Status] = useState<boolean>(hasPercentData);
  const [btn2Status, setBtn2Status] = useState<boolean>(hasValueData);

  // title
  // const componentTitle = title || " Alert Thresholds";
  const componentTitle = " Alert Thresholds";

  // button 상태
  const handleBtn1Click = () => {
    if (!isEditStatus) {
      setBtn2Status(false);
      setBtn1Status(true);
    }
  };
  const handleBtn2Click = () => {
    if (!isEditStatus) {
      setBtn1Status(false);
      setBtn2Status(true);
    }
  };

  useEffect(() => {
    console.log(proData);
    if (proData) {
      setClearPercentage(proData.clearPercent);
      setRaisePercentage(proData.setPercent);
      setClearShap(proData.clearValue);
      setRaiseShap(proData.setValue);
    }
  }, [proData]);

  // Clear 값 변경 핸들러
  const handleClearValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10) || 0;
    // onClearValue(newValue);
    if (btn1Status) {
      setClearPercentage(newValue);
    } else if (btn2Status) {
      setClearShap(newValue);
    }
    if (newValue > raisePercentage) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }

    // // 업데이트할 키 결정 (퍼센트 값 또는 절대 값)
    // const keyToUpdate = btn1Status ? "clearPercent" : "clearValue";

    // // title을 키로 사용하여 업데이트된 데이터 객체 생성
    // const updatedData = {
    //   [title]: {
    //     ...proDataVal[title], // 기존 title 키의 값을 유지하면서 업데이트
    //     [keyToUpdate]: newValue,
    //   },
    // };

    // onUpdateData(updatedData); // 부모 컴포넌트로 업데이트된 데이터 전달

    setShowWarning(newValue > raisePercentage);
  };

  // Raise 값 변경 핸들러
  const handleRaiseValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10) || 0;
    // onRaiseValue(newValue);
    if (btn1Status) {
      setRaisePercentage(newValue);
    } else if (btn2Status) {
      setRaiseShap(newValue);
    }
    if (newValue < clearPercentage) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
    // // 업데이트할 키 결정 (퍼센트 값 또는 절대 값)
    // const keyToUpdate = btn1Status ? "setPercent" : "setValue";

    // // title을 키로 사용하여 업데이트된 데이터 객체 생성
    // const updatedData = {
    //   [title]: {
    //     ...proDataVal[title], // 기존 title 키의 값을 유지하면서 업데이트
    //     [keyToUpdate]: newValue,
    //   },
    // };

    // onUpdateData(updatedData); // 부모 컴포넌트로 업데이트된 데이터 전달

    setShowWarning(newValue < clearPercentage);
  };

  // ProgressBar가 주는 값
  const handleClearPercentage = (newPercentage: number) => {
    setClearPercentage(Math.round(newPercentage));
    if (newPercentage > raisePercentage) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  };
  const handleRaisePercentage = (newPercentage: number) => {
    setRaisePercentage(Math.round(newPercentage));
    if (newPercentage < clearPercentage) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  };

  useEffect(() => {
    // btn1Status가 true일 때, '%' 버튼이 활성화되었을 때
    if (btn1Status) {
      setClearPercentage(proDataVal?.clearPercent || 0);
      setRaisePercentage(proDataVal?.setPercent || 0);
    }
    // btn2Status가 true일 때, '#' 버튼이 활성화되었을 때
    else if (btn2Status) {
      setClearShap(proDataVal?.clearValue || 0);
      setRaiseShap(proDataVal?.setValue || 0);
    }
  }, [btn1Status, btn2Status, proDataVal]);

  const fnTipReturn = () => {
    callbackTipVal(tipNo);
  };

  useEffect(() => {
    const keyToUpdate = btn1Status ? "clearPercent" : "clearValue";
    const keyToUpdateSet = btn1Status ? "setPercent" : "setValue";

    const updatedData = {
      [title]: {
        [keyToUpdate]: btn1Status ? clearPercentage : clearShap,
        [keyToUpdateSet]: btn1Status ? raisePercentage : raiseShap,
      },
    };

    onUpdateData(updatedData);
  }, [clearShap, raiseShap, clearPercentage, raisePercentage]);

  // depth
  const getLabelClassName = () => {
    switch (depthNo) {
      case 1:
        return "sol_ml_10";
      case 2:
        return "sol_ml_20";
      case 3:
        return "sol_ml_30";
      default:
        return "";
    }
  };

  return (
    <>
      <div className="row col-md-8" style={{ paddingTop: 8, paddingBottom: 8 }}>
        <div className="col-sm-5 row">
          <div className="row">
            <label className="col-sm-7 col-form-label" onClick={fnTipReturn}>
              <span className={getLabelClassName()}>{componentTitle}</span>
            </label>
            <div className="col-sm-5">
              <div className="au-target md-radio-group disabled form-toggle-radio">
                <div className="form-check" onClick={handleBtn1Click}>
                  <input
                    type="radio"
                    className="md-toggle-radio au-target"
                    disabled={isEditStatus}
                    style={{ cursor: isEditStatus ? "default" : "pointer" }}
                  />
                  <label
                    className={`au-target ${
                      btn1Status ? "active" : ""
                    } disabled`}
                    htmlFor="accessType_MsgVpnQueue_exclusive"
                  >
                    %
                  </label>
                </div>
                <div className="form-check" onClick={handleBtn2Click}>
                  <input
                    type="radio"
                    className="md-toggle-radio au-target"
                    disabled={isEditStatus}
                    style={{ cursor: isEditStatus ? "default" : "pointer" }}
                  />
                  <label
                    className={`au-target ${
                      btn2Status ? "active" : ""
                    } disabled`}
                    htmlFor="accessType_MsgVpnQueue_non-exclusive"
                  >
                    #
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-7">
          <div className="col-sm-12 row">
            <div className="col-sm-5 d-flex">
              <span className="sol_ml_10 col-form-label">Clear</span>
              <input
                id="set_alertthresholds"
                type="text"
                className="form-control sol_w100 sol_ml_6"
                value={btn1Status ? clearPercentage : clearShap}
                onChange={handleClearValueChange}
                disabled={isEditStatus}
                // disabled={true}
              />
            </div>
            <div className="col-sm-6 d-flex">
              <span className="sol_ml_10 col-form-label">Raise</span>
              <input
                id="set_alertthresholds"
                type="text"
                className="form-control sol_w100 sol_ml_6"
                value={btn1Status ? raisePercentage : raiseShap}
                //   value={raisePercentage}
                onChange={handleRaiseValueChange}
                disabled={isEditStatus}
                // disabled={true}
              />
            </div>
          </div>
          {btn1Status ? (
            <ProgressBar
              isEdit={!isEditStatus || false}
              clearPercentageInputValue={clearPercentage}
              raisePercentageInputValue={raisePercentage}
              clearPercentageValue={handleClearPercentage}
              raisePercentageValue={handleRaisePercentage}
            />
          ) : null}
        </div>
      </div>
    </>
  );
};

export default ProgressComponent;
