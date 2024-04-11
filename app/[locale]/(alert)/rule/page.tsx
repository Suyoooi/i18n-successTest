"use client";

import { useAddRuleContext } from "@/context/alert/addRuleContext";
import React, { useEffect, useState } from "react";
import Queue from "../addRule/common/step1/queue";
import Vpn from "../addRule/common/step1/vpn";

export default function Step1() {
  const {
    targetType,
    vpnBtn,
    setVpnBtn,
    queueBtn,
    setQueueBtn,
    setTargetType,
    setVpnName,
    setBrokerName,
    vpnName,
    brokerName,
    setQueueName,
    queueName,
    setSelectedMlsnData,
    setSelectedVpn,
  } = useAddRuleContext();

  console.log("00000", targetType, vpnName, brokerName, queueName);

  const handleVpnRadioBtnClick = () => {
    setVpnBtn(true);
    setQueueBtn(false);
    setVpnName("");
    setBrokerName("");
    setQueueName("");
    setSelectedVpn("");
  };

  const handleQueueRadioBtnClick = () => {
    setVpnBtn(false);
    setQueueBtn(true);
    setVpnName("");
    setBrokerName("");
    setQueueName("");
    setSelectedMlsnData("");
  };

  useEffect(() => {
    if (vpnBtn) {
      setTargetType("MLSN");
    } else if (queueBtn) {
      setTargetType("QUE");
    }
  }, [vpnBtn, queueBtn]);

  return (
    <div className="tab-base">
      <div className="tab-content">
        <div className="mt-5 row justify-content-center">
          <div className="sol_w800">
            <div className="sol_box_p0 sol_p_20">
              <div className="row col-md-12">
                {/* <!-- check --> */}
                <div className="d-flex col-md-3 float-start align-items-center">
                  <div className="col-sm-5 form-check form-check-inline sol_mr_20">
                    <input
                      type="radio"
                      id="radio_vpn"
                      className="form-check-input sol_mr_6"
                      checked={vpnBtn}
                      onChange={handleVpnRadioBtnClick}
                      style={styles.btn}
                    />
                    <label className="form-check-label" htmlFor="radio_vpn">
                      VPN
                    </label>
                  </div>
                  <div className="col-sm-5 form-check form-check-inline">
                    <input
                      type="radio"
                      id="radio_queuevpn"
                      className="form-check-input sol_mr_6"
                      checked={queueBtn}
                      onChange={handleQueueRadioBtnClick}
                      style={styles.btn}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="radio_queuevpn"
                    >
                      Queue
                    </label>
                  </div>
                </div>
              </div>
              {/* <!-- 검색 (VPN 체크 시) --> */}
              <Vpn vpnBtn={vpnBtn} />
              {/* <!-- 검색 (Queue 체크 시) --> */}
              <Queue queueBtn={queueBtn} />
              {/* <!--  tabulator --> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
const styles = {
  btn: {
    cursor: "pointer",
  },
};
