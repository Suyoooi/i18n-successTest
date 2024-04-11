"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAddRuleContext } from "@/context/alert/addRuleContext";

export default function Step4() {
  const router = useRouter();
  const {
    alertMsg,
    alertRuleName,
    setInspectionRule,
    inspectionMethod,
    setInspectionMethod,
    aboveBtn,
    belowBtn,
    selectedValueType,
  } = useAddRuleContext();

  useEffect(() => {
    if (
      inspectionMethod.includes("THRESHOLD") &&
      selectedValueType === "percent"
    ) {
      setInspectionMethod("RATE_THRESHOLD_INSPECTION");
      if (aboveBtn) {
        setInspectionRule("CPRTIUP");
      } else if (belowBtn) {
        setInspectionRule("CPRTIDOWN");
      }
    } else if (
      inspectionMethod.includes("THRESHOLD") &&
      selectedValueType === "number"
    ) {
      setInspectionMethod("THRESHOLD_INSPECTION");
      if (aboveBtn) {
        setInspectionRule("CPTHIUP");
      } else if (belowBtn) {
        setInspectionRule("CPTHIDOWN");
      }
    } else if (inspectionMethod.includes("NELSON_RULE")) {
      setInspectionMethod("NELSON_RULE_INSPECTION");
      setInspectionRule("CPNRIRULE");
    }
  }, [inspectionMethod]);

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
          </div>
        </div>
      </div>
    </div>
  );
}
