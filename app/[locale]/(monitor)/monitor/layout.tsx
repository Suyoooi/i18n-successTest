"use client";

import React, { useEffect, useState } from "react";
import "./styles/monitoring.css";
import MonitorFooter from "./layouts/monitorFooter";
import MonitorHeader from "./layouts/monitorHeader";
import { useSearchParams } from "next/navigation";
import ModalQueue from "./common/components/ModalQueue";
import { createSelector } from "@reduxjs/toolkit";
import { MonitorQueueState } from "@/redux/slices/monitoring-queue/reducer";
import { useAppSelector } from "@/hook/hook";

export default function MonitoringLayout(props: { children: React.ReactNode }) {
  const selectMonitorQueueData = createSelector(
    (state: any) => state.monitorQueue,
    (monitoringData: MonitorQueueState) => ({
      modalOpen: monitoringData.manualQueueModalOpen,
    })
  );
  const monitoringMonitorData = useAppSelector(selectMonitorQueueData);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setModalOpen(monitoringMonitorData.modalOpen);
  }, [monitoringMonitorData.modalOpen]);

  const searchParams = useSearchParams();
  const msn = searchParams.get("msn");
  const mlsn = searchParams.get("mlsn");
  const queues = searchParams.getAll("queues");

  return (
    <React.Fragment>
      {modalOpen && <ModalQueue />}
      <div id="monitor-wrapper">
        <div className="content__wrap">
          <div className="mon-container">
            <div className="mon-item-header">
              <MonitorHeader msn={msn} mlsn={mlsn} queues={queues} />
            </div>
            <div className="mon-item-body">{props.children}</div>
            <div className="mon-item-footer">
              <MonitorFooter />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
