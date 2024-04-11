"use client";

import React, { useEffect, useRef, useState } from "react";
import { Row, Col } from "reactstrap";
import RTGaugeChart from "@/app/[locale]/(monitor)/monitor/common/chart/echarts/RTGaugeChart";
import SystemResource from "./SystemResource";
import ResourceTitle from "./resourceTitle";
import { dataSourceType } from "@/data/monitor/chartConstants";
import {
  RES_GAUGE_TITLE_CPU,
  RES_GAUGE_TITLE_DISK,
  RES_GAUGE_TITLE_MEM,
  RES_GAUGE_TITLE_MAIN,
} from "@/data/monitor/resources";

const ResourceStatus = () => {
  return (
    <React.Fragment>
      <div className="d-flex align-items-center">
        <h4 className="sol_h4_gray">{RES_GAUGE_TITLE_MAIN}</h4>
      </div>
      <div className="graph_area">
        <div className="sol_box_p0">
          <div className="p-2 sol_sum_graph_200">
            <Row>
              <Col lg={10} md={12}>
                {/* <h6 className="sol_moni_top">NODE 정보</h6> */}
                <ResourceTitle />
                <Row>
                  <Col md={3} sm={6} className="align-items-center">
                    <h6 className="fw-bold text-muted mt-3 text-center">
                      {RES_GAUGE_TITLE_CPU}
                    </h6>
                    <RTGaugeChart dataSourceType={dataSourceType.CPU_STATUS} />
                  </Col>
                  <Col md={3} sm={6} className="align-items-center">
                    <h6 className="fw-bold text-muted mt-3 text-center">
                      {RES_GAUGE_TITLE_MEM}
                    </h6>
                    <RTGaugeChart
                      dataSourceType={dataSourceType.MEMORY_STATUS}
                    />
                  </Col>
                  <Col md={3} sm={6} className="align-items-center">
                    <h6 className="fw-bold text-muted mt-3 text-center">
                      {RES_GAUGE_TITLE_DISK}
                    </h6>
                    <RTGaugeChart dataSourceType={dataSourceType.DISK_STATUS} />
                  </Col>
                  <Col md={3} sm={6} className="m-0">
                    <SystemResource />
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ResourceStatus;
