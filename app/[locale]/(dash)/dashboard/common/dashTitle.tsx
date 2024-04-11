import React, { useEffect, useRef, useState } from "react";

interface ChartProps {
  title: any;
  dropMenu?: any[]; // {name:title, handler:(cellValue: string)=>void}
  data?: any[];
}

const DashboardTitle = (chartProps: ChartProps) => {
  return (
    <React.Fragment>
      <h4 className="sol_color_white">{chartProps.title}</h4>
      {chartProps.dropMenu && (
        <div className="btn-group">
          <a
            className="btn hstack btn-icon sol_btn_hamburger"
            data-bs-toggle="dropdown"
          >
            <i className="sol_i_hamburger"></i>
          </a>
          <ul className="dropdown-menu">
            {chartProps.dropMenu.map((item, index) => {
              return (
                <li key={item.name}>
                  <a
                    className={`dropdown-item ${
                      index === 0 && !chartProps.data ? "disabled" : ""
                    }`}
                    onClick={() => {
                      item.handler(chartProps.data);
                    }}
                  >
                    {item.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </React.Fragment>
  );
};

export default DashboardTitle;
