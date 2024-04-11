"use client";

import React from "react";
import { Col, Row } from "reactstrap";
import ResourceStatus from "./system/resourceStatus";
import CpuUsage from "./system/cpuUsage";
import MemoryUsage from "./system/memoryUsage";
import DiskUsage from "./system/diskUsage";
import NetworkUsage from "./system/networkUsage";
import PendingQueue from "./mlsn/pendingQueue";
import ThroughputQueue from "./mlsn/throughputQueue";
import ConnectionView from "./mlsn/connectonView";
import { RES_BROKER_RESOURCE_TITLE } from "@/data/monitor/resources";

export const dynamic = "force-dynamic";

export default function Monitor() {
  return (
    <React.Fragment>
      <Row className="h-100">
        <Col xxl={7}>
          <div className="mon-col-sys-container">
            <div className="mon-col-sys-item">
              <ResourceStatus />
            </div>
            <div className="mon-col-sys-remain">
              <div className="mon-col-sys-res-container">
                <div className="mon-col-sys-res-title">
                  <div className="sol_graph_hamburger position-relative">
                    <h4 className="sol_h4_gray">{RES_BROKER_RESOURCE_TITLE}</h4>
                  </div>
                </div>
                <Row className="mon-col-sys-res-item">
                  <Col xl={6}>
                    <CpuUsage />
                  </Col>
                  <Col xl={6}>
                    <MemoryUsage />
                  </Col>
                </Row>
                <Row className="mon-col-sys-res-item">
                  <Col xl={6}>
                    <DiskUsage />
                  </Col>
                  <Col xl={6}>
                    <NetworkUsage />
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </Col>
        <Col xxl={5}>
          <div className="mon-col-mlsn-container">
            <div className="mon-col-mlsn-item">
              <PendingQueue />
            </div>
            <div className="mon-col-mlsn-item">
              <ThroughputQueue />
            </div>
            <div className="mon-col-mlsn-item">
              <ConnectionView />
            </div>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
}
