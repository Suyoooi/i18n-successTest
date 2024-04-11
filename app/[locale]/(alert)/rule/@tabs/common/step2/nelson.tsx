"use client";

import { useAddRuleContext } from "@/context/alert/addRuleContext";
import { NELSON_LEVEL_OPTIONS, NELSON_RULE } from "@/data/alert/alertData";
import { useEffect, useState } from "react";

interface NelsonProp {}

const Nelson: React.FC<NelsonProp> = () => {
  const {
    inspectionRuleParam,
    setInspectionRuleParam,
    inspectionMethod,
    targetItemName,
    setStdVaild,
  } = useAddRuleContext();
  const [max, setMax] = useState<number>(0);
  const [averageVaild, setAverageValid] = useState<boolean>(false);
  const [standardVaild, setStandardValid] = useState<boolean>(false);

  const selectedRuleLabel =
    NELSON_RULE.find((item) => item.value === inspectionRuleParam.nsRules)
      ?.label || 0;

  useEffect(() => {
    const vals = document.getElementById(
      "input_standarddeviation"
    ) as HTMLInputElement;
    vals.value = inspectionRuleParam.nsRuleStd.toString();
  }, []);

  // nelson Rule 선택
  const handleRuleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newNsRulesValue = parseInt(event.target.value, 10);
    console.log(newNsRulesValue);
    setInspectionRuleParam((prevParams) => ({
      ...prevParams,
      nsRules: newNsRulesValue,
    }));
  };

  const handleAverageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10) || 0;
    if (validateInput(newValue, targetItemName)) {
      setInspectionRuleParam((prevParams) => ({
        ...prevParams,
        nsRuleMean: newValue,
      }));
      setAverageValid(false);
    } else {
      setAverageValid(true);
    }
  };

  const handleStdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 숫자 + 온점(.) 허용, 마지막에 온점이 있는 경우 제외
    const regex = /^[0-9]*\.?[0-9]*$/;

    if (regex.test(value)) {
      // 마지막 문자가 온점(.)인지 확인
      if (value[value.length - 1] !== ".") {
        // 문자열을 숫자로 변환
        const numericValue = parseFloat(value);

        if (validateInput2(numericValue, targetItemName)) {
          setStdVaild(false);
          setStandardValid(false);
          setInspectionRuleParam((prevParams) => ({
            ...prevParams,
            nsRuleStd: numericValue,
          }));
        } else {
          setStdVaild(true);
          setStandardValid(true);
        }
      } else {
        // 마지막 문자가 온점(.)인 경우, 숫자 변환을 하지 않음
        setStdVaild(true);
        setStandardValid(true);
      }
    } else {
      alert("Only numbers and a decimal point are allowed.");
    }
  };

  useEffect(() => {
    setAverageValid(false);
    setStandardValid(false);
  }, [targetItemName]);

  // 유효성 검사
  const determineMaxValue = (targetItemName: string) => {
    switch (targetItemName) {
      case "Pending(Spooled) Msg Count":
        setMax(3000000000);
        return 3000000000;
      case "Pending(Spooled) Msg Size(MB)":
        setMax(6000000);
        return 6000000;
      case "In Msg Rate Count":
      case "Out Msg Rate Count":
        setMax(10000000);
        return 10000000;
      case "In Msg Rate Bytes(MB)":
      case "Out Msg Rate Bytes(MB)":
        setMax(10000000000);
        return 10000000000;
      default:
        return Number.MAX_SAFE_INTEGER;
    }
  };

  const validateInput = (value: any, type: any) => {
    let minValue = 0;
    let maxValue = determineMaxValue(type);

    return value >= minValue && value <= maxValue;
  };

  const validateInput2 = (value: any, type: any) => {
    let minValue = 0;
    let maxValue = determineMaxValue(type);

    return value > minValue && value <= maxValue;
  };

  return (
    <>
      <div
        className={`position-relative ${
          inspectionMethod.includes("NELSON_RULE") ? "" : "d-none"
        }`}
      >
        <div className="col d-flex align-items-center sol_border_top mt-3 sol_pt_15">
          <div className="col-md-3">
            <label className="col-form-label" htmlFor="input_selectnelson">
              Select Nelson Rule
            </label>
          </div>
          <div className="col-md-9">
            <select
              className="form-select sol_w300"
              id="input_selectnelson"
              onChange={handleRuleChange}
              value={inspectionRuleParam.nsRules}
            >
              <option hidden>select Nelson Rule</option>
              {NELSON_LEVEL_OPTIONS.map((item) => (
                <option value={item.value} key={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col d-flex align-items-center mt-3">
          <div className="col-md-3" style={{}}>
            <label htmlFor="input_average">Average</label>
          </div>
          <div>
            <div className="col-md-9">
              <input
                type="text"
                className="form-control sol_w300"
                id="input_average"
                onChange={handleAverageChange}
                value={inspectionRuleParam.nsRuleMean}
              />
            </div>
            {averageVaild && (
              <div style={{ fontSize: 10, marginTop: 2, color: "#fe7366" }}>
                Value is out of allowed {max} range for {targetItemName}
              </div>
            )}
          </div>
        </div>
        {/* <!-- Stardard Deviation --> */}
        <div className="col d-flex align-items-center mt-3">
          <div className="col-md-3">
            <label className="col-form-label">Standard Deviation</label>
          </div>
          <div className="col-md-9">
            <input
              type="text"
              className="form-control sol_w300"
              id="input_standarddeviation"
              onChange={handleStdChange}
              // value={inspectionRuleParam.nsRuleStd}
              // value={stdVale}
            />
            {standardVaild && (
              <div style={{ fontSize: 10, marginTop: 2, color: "#fe7366" }}>
                Value is out of allowed {max} range for {targetItemName}
              </div>
            )}
          </div>
        </div>
        {/* <!-- Rule Descrition --> */}
        <div className="col d-flex align-items-center mt-3">
          <div className="col-md-3">
            <label className="col-form-label">Rule Description</label>
          </div>
          <div className="col-md-9">
            <span className="sol_color_point">{selectedRuleLabel}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Nelson;
