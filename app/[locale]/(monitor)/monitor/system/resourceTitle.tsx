"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/hook/hook";
import { createSelector } from "@reduxjs/toolkit";
import { MonitorSystemState } from "@/redux/slices/monitoring-system/reducer";
import { RES_GAUGE_TITLE_STATUS } from "@/data/monitor/resources";
import { GetLocalTimeString } from "@/data/monitor/chartUtils";

const ResourceTitle = () => {
  const [title, setTitle] = useState(RES_GAUGE_TITLE_STATUS);

  const selectCPUStatusData = createSelector(
    (state: any) => state.monitorSystem,
    (monitoringData: MonitorSystemState) => monitoringData.systemStatus.time
  );
  const cpuTimeData = useAppSelector(selectCPUStatusData);

  useEffect(() => {
    if (cpuTimeData > 0)
      setTitle(
        `${RES_GAUGE_TITLE_STATUS} : TIME [ ${GetLocalTimeString(
          cpuTimeData
        )} ]`
      );
  }, [cpuTimeData]);

  return (
    <React.Fragment>
      <h6 className="sol_moni_top">{title}</h6>
    </React.Fragment>
  );
};

export default ResourceTitle;
