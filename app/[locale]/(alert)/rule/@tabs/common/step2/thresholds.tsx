"use client";

import { useAddRuleContext } from "@/context/alert/addRuleContext";
import { THRESHOLDS_VALUE_TYPE } from "@/data/alert/alertData";
import axios from "axios";
import { useEffect, useState } from "react";

interface ThresholdsProp {
  inspectionMethod: string;
}

const Thresholds: React.FC<ThresholdsProp> = ({ inspectionMethod }) => {
  const {
    targetType,
    vpnName,
    brokerName,
    queueName,
    inspectionRuleParam,
    setInspectionRuleParam,
    setInspectionType,
    targetItem,
    targetItemName,
    setInspectionRule,
    setInspectionMethod,
  } = useAddRuleContext();
  const [selectedValueType, setSelectedValueType] = useState<string>("percent");
  const [selectedValue, setSelectedValue] = useState<number>(
    inspectionRuleParam.thresholdValue
  );
  const [vaild, setValid] = useState<boolean>(false);
  const [itemData, setItemData] = useState<number>(0);
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

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
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

  const getOptionDisabledStatus = (optionValue: any) => {
    if (optionValue === "expression") {
      return true;
    }

    switch (targetItemName) {
      // `%` 옵션만 비활성화
      case "Pending(Spooled) Msg Count":
      case "In Msg Rate Count":
      case "In Msg Rate Bytes(MB)":
      case "Out Msg Rate Count":
      case "Out Msg Rate Bytes(MB)":
        return optionValue === "percent";
      // "%", "#" 모두 활성화
      case "Pending(Spooled) Msg Size":
        return false;
      default:
        return false;
    }
  };

  useEffect(() => {
    // 현재 선택된 값이 비활성화된 상태인지 확인
    if (getOptionDisabledStatus(selectedValueType)) {
      // 비활성화된 상태인 경우, 활성화된 다른 옵션으로 변경
      const firstEnabledOption = THRESHOLDS_VALUE_TYPE.find(
        (option) => !getOptionDisabledStatus(option.value)
      );
      if (firstEnabledOption) {
        setSelectedValueType(firstEnabledOption.value);
        setInspectionType(firstEnabledOption.value);
      }
    }
  }, [targetItemName, selectedValueType]);

  useEffect(() => {
    if (inspectionMethod === "NELSON_RULE_INSPECTION") {
      setInspectionRule("CPNRIRULE");
    } else if (inspectionMethod.includes("THRESHOLD")) {
      if (selectedValueType === "percent") {
        setInspectionRule("CPRTIUP");
        setInspectionMethod("RATE_THRESHOLD_INSPECTION");
      } else if (selectedValueType === "number") {
        setInspectionRule("CPTHIUP");
        setInspectionMethod("THRESHOLD_INSPECTION");
      } else if (selectedValueType === "expression") {
        setInspectionRule("CPEPIEXP");
        setInspectionMethod("EXPRESSION_INSPECTION");
      }
    }
  }, [inspectionMethod, selectedValueType]);

  const mlsnSn = Buffer.from(`${brokerName},${vpnName}`).toString("base64");

  const fetchData = async () => {
    const baseUrl = "/api/v2/alertMgmt/monitor-item";
    try {
      const params = {
        alertTargetType: targetType,
        mlsnSn: mlsnSn,
        ...(queueName && { msc: queueName }),
      };
      const response = await axios.get(baseUrl, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
        },
        params,
      });
      const Data = response.data;
      if (targetItem.toLowerCase() === "in_byte_rate") {
        setItemData(Data.in_byte_rate);
      } else if (targetItem.toLowerCase() === "in_msg_rate") {
        setItemData(Data.in_msg_rate);
      } else if (targetItem.toLowerCase() === "out_byte_rate") {
        setItemData(Data.out_byte_rate);
      } else if (targetItem.toLowerCase() === "out_msg_rate") {
        setItemData(Data.out_msg_rate);
      } else if (targetItem.toLowerCase() === "pend_msg_cnt") {
        setItemData(Data.pend_msg_cnt);
      } else if (targetItem.toLowerCase() === "pend_msg_size") {
        setItemData(Data.pend_msg_size);
      }

      const targetItemKey = Object.keys(Data).map((key) => key.toUpperCase());
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [targetItem]);

  return (
    <>
      <div
        className={`position-relative ${
          inspectionMethod.includes("THRESHOLD") ? "" : "d-none"
        }`}
      >
        {/* <!-- Message Queue --> */}
        <div className="col d-flex align-items-center sol_border_top mt-3 sol_pt_15">
          <p>
            {targetItemName} Configured Value : {itemData} MB{" "}
          </p>
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
                  disabled={getOptionDisabledStatus(option.value)}
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
          {/* <div className="col-md-9">
            {THRESHOLDS_VALUE_TYPE.map((option) => (
              <div className="float-start sol_mr_30">
                <input
                  type="radio"
                  className="form-check-input sol_mr_6"
                  id="radio_percent"
                  value={option.value}
                  checked={selectedValueType === option.value}
                  onChange={handleRadioChange}
                />
                <label className="form-check-label">{option.label}</label>
              </div>
            ))}
          </div> */}
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
              />
              <span className="float-start col-form-label">
                {" "}
                {selectedValueType === "percent"
                  ? "% above"
                  : selectedValueType === "number"
                  ? "#"
                  : ""}
              </span>
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
