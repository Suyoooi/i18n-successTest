"use client";

import React, { useEffect, useState } from "react";
import ProgressBar from "./progressBar";

interface ProgressComponentProps {
  title: string;
  isEditStatus?: boolean;
  proData: any;
  tipNo: number;
  onTitleClick: (tipNum: number) => void;
}
const AlertThresholdsInput: React.FC<ProgressComponentProps> = ({
  title,
  isEditStatus,
  proData,
  tipNo,
  onTitleClick,
}) => {
  const [proDataVal, setProDataVal] = useState<any>(proData || {});
  const [clear, setClear] = useState<number>(0);
  const [raise, setRaise] = useState<number>(0);
  const [isEdit, setIsEdit] = useState<boolean>(true);

  // title
  const componentTitle = title || " Alert Thresholds";

  useEffect(() => {
    if (proData) {
      setClear(proData.clearValue || proData.clearPercent);
      setRaise(proData.setValue || proData.setPercent);
    }
  }, [proData]);

  const handleTitleClick = () => {
    onTitleClick(tipNo);
  };

  //  ProgressComponent 입력 값
  const handleClearValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
  };
  const handleRaiseValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
  };

  // ProgressBar가 주는 값
  const handleClearPercentage = (newPercentage: number) => {
    setClear(Math.round(newPercentage));
  };
  const handleRaisePercentage = (newPercentage: number) => {
    setRaise(Math.round(newPercentage));
  };

  useEffect(() => {
    setIsEdit(!isEditStatus);
  }, [isEditStatus]);

  return (
    <div className="row col-md-8" style={{ paddingTop: 8, paddingBottom: 8 }}>
      <div className="col-sm-5 row">
        <div className="row">
          <label
            className="col-sm-12 col-form-label"
            onClick={handleTitleClick}
          >
            {componentTitle}
          </label>
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
              value={clear}
              onChange={handleClearValueChange}
              // disabled={!isEdit}
              disabled={true}
            />
          </div>
          <div className="col-sm-4 d-flex">
            <span className="sol_ml_10 col-form-label">Raise</span>
            <input
              id="set_alertthresholds"
              type="text"
              className="form-control sol_w100 sol_ml_6"
              value={raise}
              //   value={raisePercentage}
              onChange={handleRaiseValueChange}
              // disabled={!isEdit}
              disabled={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertThresholdsInput;
