"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAddRuleContext } from "@/context/alert/addRuleContext";
import axios from "axios";
import {
  queueNel,
  queueThPer,
  queueThSh,
  vpnNel,
  vpnThPer,
  vpnThSh,
} from "../data/data";

export default function Step3() {
  const {
    vpnName,
    brokerName,
    queueName,
    targetType,
    notiCount,
    setNotiCount,
    targetItemName,
    notiPeriod,
    setNotiPeriod,
    inspectionRuleParam,
    inspectionType,
    inspectionMethod,
    alertRuleName,
    setAlertRuleName,
    alertMsg,
    setAlertMsg,
    msgTemp,
    setMsgTemp,
    selectedValueType,
  } = useAddRuleContext();

  // replacementData
  const [replacementData, setReplacementData] = useState<any[]>([]);
  useEffect(() => {
    if (targetType === "MLSN") {
      if (inspectionMethod.includes("THRESHOLD")) {
        if (selectedValueType === "percent") {
          setReplacementData(vpnThPer);
        } else if (selectedValueType === "number") {
          setReplacementData(vpnThSh);
        }
      } else if (inspectionMethod.includes("NELSON")) {
        setReplacementData(vpnNel);
      }
    } else if (targetType === "QUE") {
      if (inspectionMethod.includes("THRESHOLD")) {
        if (selectedValueType === "percent") {
          setReplacementData(queueThPer);
        } else if (selectedValueType === "number") {
          setReplacementData(queueThSh);
        }
      } else if (inspectionMethod.includes("NELSON")) {
        setReplacementData(queueNel);
      }
    }
  }, [targetType, inspectionMethod, selectedValueType]);

  const handleTimeChange = (e: any) => {
    const newValue = parseInt(e.target.value, 10) || 0;
    if (!isNaN(newValue) && newValue >= 0) {
      setNotiPeriod(newValue);
    }
  };

  const handleCountChange = (e: any) => {
    const newValue = parseInt(e.target.value, 10) || 0;
    if (!isNaN(newValue) && newValue >= 0) {
      setNotiCount(newValue);
    }
  };

  const handleMsgChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMsgTemp(event.target.value);
    console.log(event.target.value);
    setAlertMsg(event.target.value);
  };

  useEffect(() => {
    if (inspectionMethod.includes("THRESHOLD")) {
      if (inspectionType === "percent") {
        setAlertRuleName(
          `${targetItemName} 대비 ${inspectionRuleParam.thresholdValue}(%) 이상`
        );
      } else if (inspectionType === "number") {
        setAlertRuleName(
          `${targetItemName} 대비 ${inspectionRuleParam.thresholdValue}(건)`
        );
      } else {
        setAlertRuleName(
          `${targetItemName} 대비 ${inspectionRuleParam.thresholdValue} Expression`
        );
      }
    } else if (inspectionMethod.includes("NELSON_RULE")) {
      setAlertRuleName(
        `${targetItemName} Nelson (Rule-${inspectionRuleParam.nsRules})`
      );
    }
  }, [inspectionMethod, inspectionType, inspectionRuleParam, targetItemName]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAlertRuleName(event.target.value);
  };

  // const handleAlertMsgChange = (
  //   event: React.ChangeEvent<HTMLTextAreaElement>
  // ) => {
  //   setAlertMsg(event.target.value);
  // };

  const handleAlertMsgChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const start = event.target.selectionStart;
    const end = event.target.selectionEnd;

    setAlertMsg(event.target.value);

    // 상태 업데이트 후 커서 위치를 복원
    const restoreCursorPos = () => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = start;
        textareaRef.current.selectionEnd = end;
        // 포커스를 다시 textarea에 두어야 함
        textareaRef.current.focus();
      }
    };

    // 커서 위치 복원을 위해 잠시 후에 함수 실행
    setTimeout(restoreCursorPos, 0);
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [cursorPosition, setCursorPosition] = useState<number>(0);

  const insertAtCursor = (text: string) => {
    const startPos = textareaRef.current?.selectionStart || 0;
    const endPos = textareaRef.current?.selectionEnd || 0;
    const beforeText = alertMsg.substring(0, startPos);
    const afterText = alertMsg.substring(endPos);

    const wrappedText = `{{${text}}}`;

    // 새로운 상태 값과 커서 위치 설정
    setAlertMsg(beforeText + wrappedText + afterText);
    const newCursorPosition = startPos + wrappedText.length;
    setCursorPosition(newCursorPosition);
  };

  useEffect(() => {
    if (textareaRef.current && cursorPosition !== null) {
      textareaRef.current.selectionStart = cursorPosition;
      textareaRef.current.selectionEnd = cursorPosition;
      textareaRef.current.focus();
    }
  }, [alertMsg, cursorPosition]);

  const [templateData, setTemplateData] = useState<any[]>([]);

  // Template 데이터
  const fetchTemplateData = async () => {
    const baseUrl = "/api/v2/alertMgmt/alertTemplates";
    try {
      const response = await axios.get(baseUrl, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
        },
      });
      const Data = response.data.data;
      console.log(Data);
      if (response.data.responseCode === 200) {
        setTemplateData(Data);
      } else {
        alert("error");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchTemplateData();
  }, []);

  const [selectedVariable, setSelectedVariable] = useState("");

  const handleAddVariable = () => {
    setAlertMsg((prevMsg) => `${prevMsg}${selectedVariable}`);
    insertAtCursor(selectedVariable);
  };

  const handleVariableChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedVariable(event.target.value);
  };

  return (
    <div className="tab-base">
      <div className="tab-content">
        <div className="mt-5 row justify-content-center">
          <div className="sol_w800">
            <div className="sol_box_p0 sol_p_20">
              {/* <!-- Target item Name --> */}
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
                      targetType === "MLSN"
                        ? `${brokerName} > ${vpnName}`
                        : `${brokerName} > ${vpnName} > ${queueName}`
                    }
                    disabled
                  />
                </div>
              </div>

              {/* <!-- Alert Rule Name --> */}
              <div className="col d-flex align-items-center mt-3">
                <div className="col-md-3">
                  <label
                    className="col-form-label"
                    htmlFor="input_alertrulename"
                  >
                    Alert Rule Name
                  </label>
                </div>
                <div className="col-md-9">
                  <input
                    type="text"
                    className="form-control"
                    id="input_alertrulename"
                    value={alertRuleName}
                    onChange={handleNameChange}
                  />
                </div>
              </div>

              <div className="col d-flex align-items-center mt-3">
                <div className="col-md-3">
                  <label
                    className="col-form-label"
                    htmlFor="input_messagetemplate"
                  >
                    Message Template
                  </label>
                </div>
                <div className="col-md-9">
                  <select
                    className="form-select sol_w300"
                    id="input_messagetemplate"
                    onChange={handleMsgChange}
                    value={msgTemp}
                  >
                    <option value="" hidden>
                      Select the alert message template
                    </option>
                    {templateData.map((item) => (
                      <option value={item.content} key={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col d-flex align-items-center mt-3">
                <div className="col-md-3">
                  <label className="col-form-label" htmlFor="input_replacement">
                    Replacement Variable
                  </label>
                </div>
                <div className="col-md-9">
                  <select
                    className="form-select sol_w300 float-start sol_mr_6"
                    id="input_replacement"
                    onChange={handleVariableChange}
                  >
                    <option hidden>Add the replacement variable</option>
                    {replacementData.map((item) => (
                      <option value={item.id} key={item.id}>
                        {item.id} [{item.value}]
                      </option>
                    ))}
                  </select>
                  <button
                    className="btn btn-md btn-outline-info float-start"
                    onClick={handleAddVariable}
                    disabled={selectedVariable === ""}
                  >
                    Add
                  </button>
                </div>
              </div>
              <div className="col d-flex align-items-center mt-3">
                <div className="col-md-3">
                  <label
                    className="col-form-label"
                    htmlFor="input_alertmessage"
                  >
                    Alert Message
                  </label>
                </div>
                <div className="col-md-9">
                  <textarea
                    ref={textareaRef}
                    className="form-control"
                    style={{ height: 100 }}
                    value={alertMsg}
                    onChange={handleAlertMsgChange}
                  />

                  <div className="mt-2">
                    <label
                      className="col-form-label float-start sol_mr_10"
                      htmlFor="input_timeinterval"
                    >
                      Time Interval
                    </label>
                    <input
                      type="text"
                      className="form-control sol_w60 float-start sol_mr_10"
                      id="input_timeinterval"
                      value={notiPeriod}
                      onChange={handleTimeChange}
                    />
                    <span className="col-form-label float-start sol_mr_20">
                      Mins /
                    </span>
                    <label
                      className="col-form-label float-start sol_mr_10"
                      htmlFor="input_alertmessagecount"
                    >
                      Alert Message Count
                    </label>
                    <input
                      type="text"
                      className="form-control sol_w60 float-start sol_mr_10"
                      id="input_alertmessagecount"
                      value={notiCount}
                      onChange={handleCountChange}
                    />
                    <span className="col-form-label float-start">Each</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 text-center sol_border_top sol_pt_15">
                <button className="btn btn-md btn-outline-info disabled">
                  Test Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
