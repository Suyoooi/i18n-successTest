'use client';

import React, { useEffect, useState } from 'react';
import DashboardHeader from './dashHeader';
import DashboardFooter from './dashFooter';
import { useAppDispatch, useAppSelector } from '@/hook/hook';
import './styles/dashboard.css';
import { refreshOptions } from '@/data/monitor/chartConstants';
import { createSelector } from '@reduxjs/toolkit';
import {
  DashboardState,
  loadAlertData,
  loadHighTPSData,
  loadLowTPSData,
  loadMsnStatus,
  loadPendingData,
  reset as resetData
} from '@/redux/slices/dashboard/reducer';
import DashStatusTable from './dashStatusTable';
import DashStatusAlert from './dashStatusAlert';

export const dynamic = 'force-dynamic';

export default function Dashboard() {
  const dispatch: any = useAppDispatch();
  const [refreshTime, setRefreshTime] = useState<number>(0);
  const [refreshModeIndex, setRefreshModeIndex] = useState(1);

  const dashboardAlertSelector = createSelector(
    (state: any) => state.dashboard,
    (dashData: DashboardState) => ({
      alertPeriod: dashData.alertPeriod,
      dataLastLabel: dashData.alertData.dataLastLabel
    })
  );
  const dashboardAlertData = useAppSelector(dashboardAlertSelector);

  const callServerApi = (time: number) => {
    if (time > 0) {
      let sTime =
        dashboardAlertData.dataLastLabel > 0
          ? time - dashboardAlertData.dataLastLabel >
            dashboardAlertData.alertPeriod
            ? time - dashboardAlertData.alertPeriod
            : dashboardAlertData.dataLastLabel
          : time - dashboardAlertData.alertPeriod;
      dispatch(loadMsnStatus());
      dispatch(loadPendingData());
      dispatch(loadHighTPSData());
      dispatch(loadLowTPSData());
      dispatch(
        loadAlertData({
          sTime: sTime + 1,
          eTime: time
        })
      );
    }
  };

  /* 헤더에서 chart update 용 timer 를 구동한다. */
  useEffect(() => {
    callServerApi(refreshTime);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTime]);

  const triggerUpdateData = () => {
    setRefreshTime(new Date().getTime());
  };

  useEffect(() => {
    if (refreshModeIndex === 0) {
      return;
    }

    triggerUpdateData();
    const id = setInterval(
      () => triggerUpdateData(),
      refreshOptions[refreshModeIndex].value
    );
    return () => {
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshModeIndex]);

  const handleRefreshMode = (selected: number) => {
    setRefreshModeIndex(selected);
  };

  const handleRefreshData = () => {
    if (refreshModeIndex !== 0) {
      setRefreshModeIndex(0);
    }
    dispatch(resetData());
    triggerUpdateData(); // manual update
  };

  return (
    <React.Fragment>
      <div id="dashboard-wrapper">
        <div className="content__wrap">
          <div className="dash-container">
            <div className="dash-item-header">
              <DashboardHeader
                refreshModeIndex={refreshModeIndex}
                handleRefreshMode={handleRefreshMode}
                handleRefreshData={handleRefreshData}
              />
            </div>
            <div className="dash-item-table">
              <DashStatusTable />
            </div>
            <div className="dash-item-alert">
              <DashStatusAlert />
            </div>
            <div className="dash-item-footer">
              <DashboardFooter
                refreshModeIndex={refreshModeIndex}
                handleRefreshMode={handleRefreshMode}
                handleRefreshData={handleRefreshData}
                refreshTime={refreshTime}
              />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
