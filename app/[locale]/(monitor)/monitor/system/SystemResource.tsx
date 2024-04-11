"use client";

import {
  RES_NODE_RESOURCE_CORE,
  RES_NODE_RESOURCE_MEMORY,
} from "@/data/monitor/resources";
import { useAppSelector } from "@/hook/hook";
import { MonitorSystemState } from "@/redux/slices/monitoring-system/reducer";
import { createSelector } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";

const SystemResource = () => {
  const [coreCount, setCoreCount] = useState(0);
  const [memorySize, setMemorySize] = useState(0);

  const selectSystemMonitoringData = createSelector(
    (selectorState: any) => selectorState.monitorSystem,
    (monitoringData: MonitorSystemState) => ({
      coreCount: monitoringData.systemStatus.coreCount,
      memorySize: monitoringData.systemStatus.memorySize,
    })
  );
  const resourceSelector = useAppSelector(selectSystemMonitoringData);

  useEffect(() => {
    setCoreCount(resourceSelector.coreCount);
    setMemorySize(resourceSelector.memorySize);
  }, [resourceSelector.coreCount, resourceSelector.memorySize]);

  const unitCore = " COREs";
  const unitMem = " GB";
  return (
    <React.Fragment>
      <Row className="mt-2">
        <Col>
          <div className="sol_box_p0 p-2 text-center">
            <h6 className="fw-bold text-muted mb-1">
              {RES_NODE_RESOURCE_CORE}
            </h6>
            <h5 className="mt-0 ff-secondary fw-bold fs-5">
              <span className="text-success">{coreCount}</span>
              {unitCore}
            </h5>
          </div>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col>
          <div className="sol_box_p0 p-2 text-center">
            <h6 className="fw-bold text-muted mb-1">
              {RES_NODE_RESOURCE_MEMORY}
            </h6>
            <h5 className="mt-0 ff-secondary fw-bold fs-5">
              <span className="text-success">{Math.round(memorySize)}</span>
              {unitMem}
            </h5>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default SystemResource;
