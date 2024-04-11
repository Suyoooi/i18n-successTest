"use client";

import React from "react";
import { fullscreen } from "@/app/[locale]/(monitor)/monitor/common/FullScreen";
import { refreshOptions } from "@/data/monitor/chartConstants";

interface headerProps {
  refreshModeIndex: number;
  handleRefreshMode: (index: number) => void;
  handleRefreshData: () => void;
}

const DashboardHeader = (props: headerProps) => {
  return (
    <React.Fragment>
      <div className="d-flex gap-2 align-items-center justify-content-end ">
        <button
          className="btn hstack btn-icon sol_button_outline sol_btn_icon"
          onClick={() =>
            fullscreen(document.getElementById("dashboard-wrapper"))
          }
        >
          <i className="sol_i_allmonitoring"></i>
        </button>
        <button
          className="btn hstack btn-icon sol_button_outline sol_btn_icon sol_btn_mr-8"
          onClick={props.handleRefreshData}
        >
          <i className="sol_i_refresh"></i>
        </button>

        <div className="btn-group">
          <button
            className="form-select bg-transparent"
            data-bs-toggle="dropdown"
          >
            <span>{refreshOptions[props.refreshModeIndex].label}</span>
          </button>
          <div className="dropdown-menu">
            {refreshOptions.map((item: any, index) => (
              <li
                key={item.label}
                onClick={() => props.handleRefreshMode(index)}
              >
                <a className="dropdown-item">{item.label}</a>
              </li>
            ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default DashboardHeader;
