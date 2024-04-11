"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAddRuleContext } from "@/context/alert/addRuleContext";
import axios from "axios";

export default function Step4() {
  const router = useRouter();
  const {
    brokerName,
    targetItem,
    vpnName,
    queueName,
    targetType,
    alertMsg,
    alertRuleName,
    setInspectionRule,
    inspectionRule,
    inspectionMethod,
    setInspectionMethod,
    aboveBtn,
    belowBtn,
    selectedValueType,
    notiPeriod,
    notiCount,
    alertLevel,
    inspectionRuleParam,
  } = useAddRuleContext();

  const postData = async () => {
    const url = "/api/v2/alertMgmt/alert";
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
          nsRuleStd: inspectionRuleParam.nsRuleStd,
        },
        alertLevel: alertLevel,
        notiCount: notiCount,
        notiPeriod: notiPeriod * 60,
        alertRuleName: alertRuleName,
        alertMsg: alertMsg,
      };
      console.log(bodyData);
      const response = await axios.post(url, bodyData, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
        },
      });
      if (response.status === 200) {
        console.log(response);
        alert("Successfully added rule");
        router.push("/msg");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("failed added rule");
    }
  };

  const handleConfirmClick = () => {
    postData();
  };

  const handlePrevClick = () => {
    router.push("/rule/step3");
  };

  useEffect(() => {
    if (vpnName === "" && brokerName === "") {
      router.push("/rule/step1");
    }
  }, [vpnName, brokerName]);

  return (
    <div className="tab-base">
      <div className="tab-content">
        <div className="mt-5 row justify-content-center">
          <div className="sol_w800">
            <div className="sol_box_p0 sol_p_20">
              {/* <!-- Alert Rule Name --> */}
              <div className="col d-flex align-items-center">
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
                    disabled
                  />
                </div>
              </div>

              {/* <!-- Alert Message --> */}
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
                    className="form-control"
                    // placeholder="[긴급]${Queue 명) 할당 값 대비 $(msginCnt) 을 넘었습니다. 원인 파악 및 조치가 필요합니다."
                    style={{ height: 100 }}
                    disabled
                    value={alertMsg}
                  />
                </div>
              </div>

              {/* <!-- Send Channel --> */}
              <div className="col d-flex align-items-center mt-3">
                <div className="col-md-3">
                  <label
                    className="col-form-label"
                    htmlFor="input_Send Channel"
                  >
                    Send Channel
                  </label>
                </div>
                <div className="col-md-9">
                  <select
                    className="form-select sol_w200 float-start sol_mr_6"
                    id="input_Send Channel"
                    disabled
                  >
                    <option>Put into DB</option>
                  </select>
                </div>
              </div>
              {/* <!-- Recipients --> */}
              <div className="col d-flex align-items-center mt-3">
                <div className="col-md-3">
                  <label
                    className="col-form-label"
                    htmlFor="input_alertmessage"
                  >
                    Recipients
                  </label>
                </div>
                <div className="col-md-9">
                  <textarea
                    className="form-control"
                    placeholder=""
                    style={{ height: 100 }}
                    disabled
                  ></textarea>
                </div>
              </div>
              <div className="mt-3 text-center sol_border_top sol_pt_15">
                <button className="btn btn-md btn-outline-info disabled">
                  Test Recipients
                </button>
              </div>
            </div>
            <div className="d-flex sol_mtb_15">
              <div className="col-md-6">
                <button
                  className="btn btn-md btn-outline-light"
                  onClick={handlePrevClick}
                >
                  <i className="sol_i_prev sol_mr_6" />
                  Prev
                </button>
              </div>
              <div className="col-md-6 text-end">
                <button
                  className="btn btn-md btn-outline-secondary justify-content-end"
                  onClick={handleConfirmClick}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
