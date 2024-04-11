"use client";

import { useAddRuleContext } from "@/context/alert/addRuleContext";
import { THRESHOLDS_VALUE_TYPE } from "@/data/alert/alertData";
import axios from "axios";
import { useEffect, useState } from "react";

interface ThresholdsProp {
  codeInfo: string;
}

const Thresholds: React.FC<ThresholdsProp> = ({ codeInfo }) => {
  const {
    targetType,
    queueName,
    vpnName,
    brokerName,
    inspectionRuleParam,
    setInspectionRuleParam,
    setInspectionType,
    targetItemName,
    targetItem,
    setInspectionRule,
    inspectionMethod,
    selectedCdInfo,
    setAboveBtn,
    setBelowBtn,
    selectedValueType,
    setSelectedValueType,
  } = useAddRuleContext();
  const [selectedValue, setSelectedValue] = useState<number>(
    inspectionRuleParam.thresholdValue
  );
  const [vaild, setValid] = useState<boolean>(false);
  const [itemData, setItemData] = useState<number>(0);
  const [itemUnit, setItemUnit] = useState<string>("");

  // 데이터
  const fetchData = async () => {
    const baseUrl = "/api/v2/alertMgmt/searchConfigValue";
    const param = {
      alertTargetType: targetType,
      msn: brokerName,
      mlsn: vpnName,
      ...(queueName && { msc: queueName }),
      configField: "maxMsgSpoolUsage",
    };
    try {
      const response = await axios.get(baseUrl, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
        },
        params: param,
      });
      const Data = response.data.data;
      console.log(Data);
      if (response.data.responseCode === 200) {
        setItemData(Data.configValue);
        setItemUnit(Data.dataUnit);
      } else {
        alert("error");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // above, below Select
  const above = selectedCdInfo.includes("UP");
  const below = selectedCdInfo.includes("DOWN");

  const [selectedDirection, setSelectedDirection] = useState<string>("above");

  const handleDirectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDirection = e.target.value;
    setSelectedDirection(newDirection);
  };

  useEffect(() => {
    if (below) {
      setBelowBtn(true);
      setAboveBtn(false);
    } else if (above) {
      setAboveBtn(true);
      setBelowBtn(false);
    }
  }, [selectedCdInfo, targetItem, above, below]);

  // method === thresholds일 때 radioBtn
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    const selectedOption = THRESHOLDS_VALUE_TYPE.find(
      (option) => option.value === newValue
    );
    const selectedRule = selectedOption ? selectedOption.rule : "";
    setInspectionRule(selectedRule);
    setSelectedValueType(newValue);
    setInspectionType(newValue);
    setInspectionRuleParam((prevParams) => ({
      ...prevParams,
      thresholdValue: 0,
    }));
    setSelectedValue(0);
  };

  useEffect(() => {
    if (selectedCdInfo.includes("CPR")) {
      fetchData();
    }
  }, [selectedCdInfo, selectedValueType]);

  const getOptionDisabledStatus = (optionValue: any) => {
    const percent = selectedCdInfo.includes("CPR");
    const number = selectedCdInfo.includes("CPT");
    if (optionValue === "expression") {
      return true;
    } else if (!percent && number) {
      return optionValue === "percent";
    } else if (!number && percent) {
      return optionValue === "number";
    } else if (percent && number) {
      return false;
    }
  };

  useEffect(() => {
    // 활성화된 옵션 중 첫 번째 옵션 찾기
    const firstEnabledOption = THRESHOLDS_VALUE_TYPE.find(
      (option) => !getOptionDisabledStatus(option.value)
    );
    // 현재 선택된 값의 활성화 상태 확인
    const isCurrentOptionActive = !getOptionDisabledStatus(selectedValueType);
    if (
      firstEnabledOption &&
      (!isCurrentOptionActive || isCurrentOptionActive)
    ) {
      setSelectedValueType(firstEnabledOption.value);
      setInspectionType(firstEnabledOption.value);
    }
  }, [targetItemName]);

  // value
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    const newValue = inputVal === "" ? 0 : parseInt(inputVal, 10);
    let isValueValid = true;

    const maxValue = selectedValueType === "percent" ? 100 : 4294967295;

    if (isNaN(newValue) || newValue < 0 || newValue > maxValue) {
      isValueValid = false;
    }

    if (isValueValid) {
      setSelectedValue(newValue);
      setInspectionRuleParam((prevParams) => ({
        ...prevParams,
        thresholdValue: newValue,
      }));
      setValid(false);
    } else {
      setValid(true);
    }
  };

  return (
    <>
      <div
        className={`position-relative ${
          inspectionMethod.includes("THRESHOLD") ? "" : "d-none"
        }`}
      >
        {/* <!-- Message Queue --> */}
        <div className="col d-flex align-items-center sol_border_top mt-3 sol_pt_15">
          {selectedValueType === "percent" && targetItem && (
            <p>
              {targetItemName} Configured Value : {itemData} {itemUnit}
            </p>
          )}
        </div>
        <div className="col d-flex align-items-center mt-3">
          <div className="col-md-3">
            <label className="col-form-label">Value Type</label>
          </div>
          <div className="col-md-9">
            {THRESHOLDS_VALUE_TYPE.map((option) => (
              <div className="form-check form-check-inline" key={option.id}>
                <input
                  type="radio"
                  id={option.rule}
                  className="form-check-input"
                  name="valueType"
                  value={option.value}
                  checked={selectedValueType === option.value}
                  onChange={handleRadioChange}
                  disabled={
                    getOptionDisabledStatus(option.value) || !targetItem
                  }
                />
                <label
                  htmlFor={`valueType-${option.value}`}
                  className="form-check-label"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="col d-flex align-items-center mt-3">
          <div className="col-md-3">
            <label className="col-form-label">Value</label>
          </div>
          <div className="col-md-9">
            <div style={{ display: "flex" }}>
              <input
                type="text"
                className="form-control sol_w300 float-start sol_mr_10"
                onChange={handleValueChange}
                value={selectedValue}
                disabled={!targetItem}
              />
              <span className="float-start col-form-label">
                {selectedValueType === "percent"
                  ? "%"
                  : selectedValueType === "number"
                  ? "#"
                  : ""}
              </span>
              <div className="col-md-4" style={{ marginLeft: 10 }}>
                <select
                  className="form-select"
                  onChange={handleDirectionChange}
                  value={selectedDirection}
                  disabled={!above && !below}
                >
                  {/* <option value="above">Above</option>
                  <option value="below">Below</option> */}
                  <option hidden>Select option</option>
                  {above && <option value="above">Above</option>}
                  {below && <option value="below">Below</option>}
                </select>
              </div>
            </div>
            {vaild && (
              <div style={{ fontSize: 10, color: "#fe7366" }}>
                Value is out of allowed range
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Thresholds;
